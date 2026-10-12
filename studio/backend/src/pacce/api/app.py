"""API REST FastAPI para o PACCE Planner Studio.

Fornece endpoints para:
- Gerenciamento de projetos (CRUD, duplicação, importação/exportação)
- Assistente de criação de planners
- Geração e customização de páginas e elementos
- Validação de integridade e navegação
- Exportação de PDFs de alta performance
- Gerenciador e exportação de pacotes de adesivos
"""

from __future__ import annotations

import io
import os
from pathlib import Path
from typing import Any, Optional
from urllib.parse import quote
from tempfile import TemporaryDirectory

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, Response, JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

from ..models.planner import (
    ProjetoPlanner,
    ConfiguracaoProjeto,
    FormatoPagina,
    SecaoPlanejamento,
    Paleta,
    Cor,
)
from ..templates.generator import GeradorPlanner
from ..pdf.navigation import MotorNavegacao
from ..pdf.renderer import RenderizadorPDF
from ..stickers.engine import MotorAdesivos
from ..utils.persistence import GerenciadorProjetos, IdProjetoInvalido


# Configuração do app e diretório de projetos
BASE_DIR = Path(__file__).resolve().parents[4]
PROJECTS_DIR = BASE_DIR / "projects"
PROJECTS_DIR.mkdir(parents=True, exist_ok=True)

gerenciador = GerenciadorProjetos(PROJECTS_DIR)
motor_stickers = MotorAdesivos(BASE_DIR / "resources" / "stickers")

app = FastAPI(
    title="PACCE Planner Studio API",
    version="0.1.0",
    description="Backend para criação, edição e exportação de planners digitais para Goodnotes.",
)

# CORS aberto para comunicação com o frontend local (Vite/React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(IdProjetoInvalido)
async def id_projeto_invalido_handler(request, exc):
    return JSONResponse(status_code=400, content={"detail": str(exc)})


# ─── Schemas Pydantic ───────────────────────────────────────────────

class NovoProjetoRequest(BaseModel):
    nome: str = "Meu Planner"
    descricao: str = ""
    formato: str = "a4_horizontal"
    idioma: str = "pt-BR"
    primeiro_dia_semana: int = 0  # 0 = Segunda
    incluir_feriados: bool = True
    data_inicio: str = "2026-10-01"
    data_fim: str = "2026-12-31"
    cor_primaria: str = "#535DEB"
    cor_secundaria: str = "#172B70"
    cor_fundo_claro: str = "#F0EEFF"
    secoes: list[str] = Field(default_factory=lambda: [
        "capa", "indice", "calendario_mensal", "planejamento_semanal",
        "planejamento_diario", "habitos", "projetos", "estudos",
        "leitura", "revisoes_mensais", "paginas_livres"
    ])


# ─── Endpoints ──────────────────────────────────────────────────────

@app.get("/api/health")
def health_check():
    """Verifica status da API."""
    return {"status": "ok", "app": "PACCE Planner Studio", "version": "0.1.0"}


@app.get("/api/projetos")
def listar_projetos():
    """Lista todos os projetos salvos no estúdio."""
    return gerenciador.listar()


@app.post("/api/projetos/criar")
def criar_projeto(req: NovoProjetoRequest):
    """Cria um novo projeto via assistente e gera automaticamente suas páginas."""
    paleta = Paleta(
        nome="Customizada",
        primaria=Cor(req.cor_primaria),
        secundaria=Cor(req.cor_secundaria),
        fundo_claro=Cor(req.cor_fundo_claro),
        fundo_medio=Cor("#DDE2FF"),
        fundo=Cor("#FFFFFF"),
        texto=Cor(req.cor_secundaria),
        texto_claro=Cor(req.cor_primaria),
        destaque=Cor(req.cor_primaria),
    )

    config = ConfiguracaoProjeto(
        formato=FormatoPagina(req.formato),
        idioma=req.idioma,
        primeiro_dia_semana=req.primeiro_dia_semana,
        incluir_feriados=req.incluir_feriados,
        data_inicio=req.data_inicio,
        data_fim=req.data_fim,
        paleta=paleta,
        secoes=req.secoes,
    )

    projeto = ProjetoPlanner(
        nome=req.nome,
        descricao=req.descricao,
        configuracao=config,
    )

    # Gerar páginas
    gerador = GeradorPlanner(projeto)
    gerador.gerar()

    # Salvar no disco
    gerenciador.salvar(projeto)
    return projeto.to_dict()


@app.get("/api/projetos/{projeto_id}")
def obter_projeto(projeto_id: str):
    """Obtém os dados completos de um projeto pelo ID."""
    try:
        projeto = gerenciador.carregar(projeto_id)
        return projeto.to_dict()
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Projeto não encontrado")


@app.put("/api/projetos/{projeto_id}")
def salvar_projeto(projeto_id: str, dados: dict):
    """Atualiza e salva as alterações feitas no projeto."""
    try:
        projeto = ProjetoPlanner.from_dict(dados)
        projeto.id = projeto_id
        gerenciador.salvar(projeto)
        return {"status": "sucesso", "atualizado_em": projeto.atualizado_em}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.delete("/api/projetos/{projeto_id}")
def excluir_projeto(projeto_id: str):
    """Exclui um projeto."""
    sucesso = gerenciador.excluir(projeto_id)
    if not sucesso:
        raise HTTPException(status_code=404, detail="Projeto não encontrado")
    return {"status": "excluído"}


@app.post("/api/projetos/{projeto_id}/duplicar")
def duplicar_projeto(projeto_id: str):
    """Duplica um projeto existente."""
    try:
        copia = gerenciador.duplicar(projeto_id)
        return copia.to_dict()
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Projeto original não encontrado")


@app.get("/api/projetos/{projeto_id}/validar")
def validar_hyperlinks(projeto_id: str):
    """Executa a validação formal de todos os hyperlinks do planner."""
    try:
        projeto = gerenciador.carregar(projeto_id)
        nav = MotorNavegacao(projeto)
        relatorio = nav.validar()
        return {
            "aprovado": relatorio.aprovado,
            "total_hyperlinks": relatorio.total_hyperlinks,
            "total_validos": relatorio.total_validos,
            "total_invalidos": relatorio.total_invalidos,
            "problemas": [
                {
                    "tipo": p.tipo,
                    "severidade": p.severidade,
                    "descricao": p.descricao,
                    "pagina_origem": p.pagina_origem_id,
                }
                for p in relatorio.problemas
            ],
        }
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Projeto não encontrado")


@app.get("/api/projetos/{projeto_id}/exportar-pdf")
def exportar_pdf(projeto_id: str):
    """Renderiza e faz download do PDF interativo compatível com Goodnotes."""
    try:
        projeto = gerenciador.carregar(projeto_id)
        renderer = RenderizadorPDF(projeto)
        pdf_bytes = renderer.renderizar_para_bytes()

        nome_arquivo = f"{projeto.nome.replace(' ', '_')}.pdf"
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename=planner.pdf; filename*=UTF-8''{quote(nome_arquivo, safe='')}"},
        )
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Projeto não encontrado")


@app.get("/api/adesivos/pacote-padrao")
def baixar_pacote_adesivos():
    """Exporta o pacote ZIP oficial de adesivos e etiquetas do PACCE Planner Studio."""
    with TemporaryDirectory(prefix="pacce-stickers-") as diretorio:
        caminho_temporario = Path(diretorio) / "stickers.zip"
        motor_stickers.exportar_pacote_zip(caminho_temporario)
        conteudo = caminho_temporario.read_bytes()

    return Response(
        content=conteudo,
        media_type="application/zip",
        headers={"Content-Disposition": "attachment; filename=PACCE_Adesivos_Goodnotes.zip"},
    )


# O mesmo servidor entrega a interface compilada e a API para o túnel.
# Montar depois das rotas mantém /api disponível; não expõe o código-fonte.
FRONTEND_DIST = BASE_DIR / "frontend" / "dist"
if (FRONTEND_DIST / "index.html").is_file():
    app.mount("/", StaticFiles(directory=FRONTEND_DIST, html=True), name="frontend")
