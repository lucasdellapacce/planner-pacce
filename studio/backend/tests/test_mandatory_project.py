"""Teste do Projeto Obrigatório (Item 18 do Prompt Mestre).

Configurações:
- Nome: PACCE Planner — Outubro a Dezembro 2026
- Idioma: Português brasileiro
- Período: 01/10/2026 a 31/12/2026
- Formato: A4 horizontal (297 x 210 mm)
- Paleta:
  - Primária: #535DEB
  - Azul escuro: #172B70
  - Lavanda clara: #F0EEFF
  - Azul lavanda: #DDE2FF
  - Branco: #FFFFFF
- Seções:
  - Capa
  - Índice
  - Calendário mensal
  - Planejamento semanal
  - Planejamento diário
  - Rastreador de hábitos
  - Planejamento de projetos
  - Planejamento de estudos
  - Rastreador de leitura
  - Revisões mensais
  - Páginas livres
"""

import os
import sys
from pathlib import Path
from datetime import date

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "src"))

from pacce.models.planner import (
    ProjetoPlanner,
    ConfiguracaoProjeto,
    FormatoPagina,
    SecaoPlanejamento,
    Paleta,
    Cor,
    DIMENSOES_FORMATO,
    mm_para_pontos,
)
from pacce.templates.generator import GeradorPlanner
from pacce.pdf.navigation import MotorNavegacao
from pacce.pdf.renderer import RenderizadorPDF
from pacce.stickers.engine import MotorAdesivos
from pacce.utils.persistence import GerenciadorProjetos


def test_geracao_projeto_obrigatorio_completo(tmp_path):
    """Valida e gera o projeto obrigatório com todas as seções e verificações programáticas."""
    # 1. Configuração da Paleta Oficial
    paleta = Paleta(
        nome="PACCE Indigo Classic",
        primaria=Cor("#535DEB"),
        secundaria=Cor("#172B70"),
        fundo_claro=Cor("#F0EEFF"),
        fundo_medio=Cor("#DDE2FF"),
        fundo=Cor("#FFFFFF"),
        texto=Cor("#172B70"),
        texto_claro=Cor("#535DEB"),
        destaque=Cor("#535DEB"),
    )

    # 2. Configuração do Projeto
    secoes_obrigatorias = [
        SecaoPlanejamento.CAPA.value,
        SecaoPlanejamento.INDICE.value,
        SecaoPlanejamento.CALENDARIO_MENSAL.value,
        SecaoPlanejamento.PLANEJAMENTO_SEMANAL.value,
        SecaoPlanejamento.PLANEJAMENTO_DIARIO.value,
        SecaoPlanejamento.HABITOS.value,
        SecaoPlanejamento.PROJETOS.value,
        SecaoPlanejamento.ESTUDOS.value,
        SecaoPlanejamento.LEITURA.value,
        SecaoPlanejamento.REVISOES_MENSAIS.value,
        SecaoPlanejamento.PAGINAS_LIVRES.value,
    ]

    config = ConfiguracaoProjeto(
        formato=FormatoPagina.A4_HORIZONTAL,
        largura_mm=297.0,
        altura_mm=210.0,
        idioma="pt-BR",
        primeiro_dia_semana=0,  # Segunda-feira
        incluir_feriados=True,
        data_inicio="2026-10-01",
        data_fim="2026-12-31",
        paleta=paleta,
        secoes=secoes_obrigatorias,
    )

    projeto = ProjetoPlanner(
        nome="PACCE Planner — Outubro a Dezembro 2026",
        descricao="Planner de validação para Goodnotes gerado pelo PACCE Planner Studio",
        configuracao=config,
    )

    # 3. Geração Automática das Páginas
    gerador = GeradorPlanner(projeto)
    gerador.gerar()

    # Validação do total de páginas geradas
    # Capa (1) + Índice (1) + Meses (3) + Semanas (~14) + Dias (92) + Hábitos (3) + Projetos (1) + Estudos (1) + Leitura (1) + Revisões (3) + Livres (5)
    total_paginas = len(projeto.paginas)
    assert total_paginas > 100, f"Esperado >100 páginas, obtido {total_paginas}"

    # Conferência das datas e IDs de navegação
    ids_navegacao = {p.id_navegacao for p in projeto.paginas if p.id_navegacao}
    assert "capa" in ids_navegacao
    assert "indice" in ids_navegacao
    assert "mes-2026-10" in ids_navegacao
    assert "mes-2026-11" in ids_navegacao
    assert "mes-2026-12" in ids_navegacao
    assert "dia-2026-10-01" in ids_navegacao
    assert "dia-2026-12-31" in ids_navegacao
    assert "projetos" in ids_navegacao
    assert "estudos" in ids_navegacao
    assert "leitura" in ids_navegacao

    # 4. Validação de Hyperlinks
    nav = MotorNavegacao(projeto)
    relatorio = nav.validar()
    assert relatorio.total_hyperlinks > 0, "Deveriam existir hyperlinks"
    assert relatorio.total_invalidos == 0, f"Erros nos links: {[p.descricao for p in relatorio.problemas if p.severidade == 'erro']}"
    assert relatorio.aprovado is True

    # 5. Renderização do PDF e Verificação do Arquivo
    diretorio_saida = tmp_path / "output_mandatory"
    diretorio_saida.mkdir(parents=True, exist_ok=True)
    caminho_pdf = diretorio_saida / "PACCE_Planner_Outubro_Dezembro_2026.pdf"

    progresso_registrado = []
    def on_progress(atual, total):
        if atual % 25 == 0 or atual == total:
            progresso_registrado.append((atual, total))

    renderer = RenderizadorPDF(projeto)
    renderer.definir_callback_progresso(on_progress)
    renderer.renderizar(str(caminho_pdf))

    assert caminho_pdf.exists()
    tamanho_pdf = caminho_pdf.stat().st_size
    assert tamanho_pdf > 100_000, f"PDF gerado é muito pequeno: {tamanho_pdf} bytes"
    assert len(progresso_registrado) > 0, "O callback de progresso deve ter sido acionado"

    # 6. Geração e Exportação da Coleção de Adesivos
    motor_stickers = MotorAdesivos(diretorio_saida / "stickers")
    caminho_zip = diretorio_saida / "PACCE_Stickers_Out_Dez_2026.zip"
    motor_stickers.exportar_pacote_zip(caminho_zip)

    assert caminho_zip.exists()
    assert caminho_zip.stat().st_size > 1_000

    # 7. Persistência do Projeto em JSON
    gerenciador = GerenciadorProjetos(diretorio_saida.parent)
    caminho_json = gerenciador.salvar(projeto)
    assert caminho_json.exists()
