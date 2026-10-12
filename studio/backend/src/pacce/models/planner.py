"""Modelo de dados do PACCE Planner Studio.

Define todas as estruturas de dados para projetos, páginas,
elementos, templates, hyperlinks e configurações.
"""

from __future__ import annotations

import uuid
from dataclasses import dataclass, field
from datetime import date, datetime
from enum import Enum
from typing import Any, Optional


# ─── Enums ────────────────────────────────────────────────────────

class FormatoPagina(Enum):
    """Formatos de página suportados."""
    A4_VERTICAL = "a4_vertical"
    A4_HORIZONTAL = "a4_horizontal"
    A3_VERTICAL = "a3_vertical"
    A3_HORIZONTAL = "a3_horizontal"
    A5_VERTICAL = "a5_vertical"
    A5_HORIZONTAL = "a5_horizontal"
    PERSONALIZADO = "personalizado"


class TipoPagina(Enum):
    """Tipos de página disponíveis."""
    # Planejamento geral
    CAPA = "capa"
    CONTRACAPA = "contracapa"
    INDICE = "indice"
    VISAO_ANUAL = "visao_anual"
    CALENDARIO_ANUAL = "calendario_anual"
    METAS_ANUAIS = "metas_anuais"
    PLANEJAMENTO_TRIMESTRAL = "planejamento_trimestral"
    PLANEJAMENTO_MENSAL = "planejamento_mensal"
    PLANEJAMENTO_SEMANAL = "planejamento_semanal"
    PLANEJAMENTO_DIARIO = "planejamento_diario"
    # Organização pessoal
    HABITOS = "habitos"
    ROTINAS = "rotinas"
    TAREFAS = "tarefas"
    METAS = "metas"
    FINANCAS = "financas"
    LISTA_COMPRAS = "lista_compras"
    ANOTACOES = "anotacoes"
    REFLEXOES = "reflexoes"
    REVISOES = "revisoes"
    # Trabalho
    PROJETOS = "projetos"
    REUNIOES = "reunioes"
    ENTREGAS = "entregas"
    KANBAN = "kanban"
    PRIORIDADES = "prioridades"
    RESULTADOS = "resultados"
    # Estudos
    PLANEJAMENTO_ESTUDOS = "planejamento_estudos"
    CRONOGRAMA = "cronograma"
    DISCIPLINAS = "disciplinas"
    RESUMOS = "resumos"
    REVISOES_ESTUDOS = "revisoes_estudos"
    ATIVIDADES = "atividades"
    # Leitura
    BIBLIOTECA = "biblioteca"
    LISTA_LEITURA = "lista_leitura"
    LIVROS_CONCLUIDOS = "livros_concluidos"
    AVALIACOES = "avaliacoes"
    METAS_LEITURA = "metas_leitura"
    REGISTRO_PAGINAS = "registro_paginas"
    RESENHAS = "resenhas"
    # Páginas livres
    PAGINA_LISA = "pagina_lisa"
    PAGINA_PAUTADA = "pagina_pautada"
    PAGINA_PONTILHADA = "pagina_pontilhada"
    PAGINA_QUADRICULADA = "pagina_quadriculada"
    PAGINA_GRADE_5MM = "pagina_grade_5mm"
    PAGINA_CHECKLIST = "pagina_checklist"
    PAGINA_CORNELL = "pagina_cornell"
    TEMPLATE_PERSONALIZADO = "template_personalizado"


class TipoElemento(Enum):
    """Tipos de elemento no editor visual."""
    TEXTO = "texto"
    CAIXA_TEXTO = "caixa_texto"
    FORMA = "forma"
    LINHA = "linha"
    IMAGEM = "imagem"
    ICONE = "icone"
    ADESIVO = "adesivo"
    DIVISORIA = "divisoria"
    TABELA = "tabela"
    CHECKBOX = "checkbox"
    HYPERLINK = "hyperlink"
    GRUPO = "grupo"


class TipoForma(Enum):
    """Tipos de forma geométrica."""
    RETANGULO = "retangulo"
    CIRCULO = "circulo"
    ELIPSE = "elipse"
    TRIANGULO = "triangulo"
    ESTRELA = "estrela"
    LOSANGO = "losango"
    LINHA_HORIZONTAL = "linha_horizontal"
    LINHA_VERTICAL = "linha_vertical"


class SecaoPlanejamento(Enum):
    """Seções disponíveis para um planner."""
    CAPA = "capa"
    CONTRACAPA = "contracapa"
    INDICE = "indice"
    CALENDARIO_MENSAL = "calendario_mensal"
    PLANEJAMENTO_SEMANAL = "planejamento_semanal"
    PLANEJAMENTO_DIARIO = "planejamento_diario"
    HABITOS = "habitos"
    PROJETOS = "projetos"
    ESTUDOS = "estudos"
    LEITURA = "leitura"
    REVISOES_MENSAIS = "revisoes_mensais"
    PAGINAS_LIVRES = "paginas_livres"
    METAS = "metas"
    FINANCAS = "financas"
    ANOTACOES = "anotacoes"


# ─── Dimensões ────────────────────────────────────────────────────

# Dimensões em milímetros
DIMENSOES_FORMATO: dict[FormatoPagina, tuple[float, float]] = {
    FormatoPagina.A4_VERTICAL: (210.0, 297.0),
    FormatoPagina.A4_HORIZONTAL: (297.0, 210.0),
    FormatoPagina.A3_VERTICAL: (297.0, 420.0),
    FormatoPagina.A3_HORIZONTAL: (420.0, 297.0),
    FormatoPagina.A5_VERTICAL: (148.0, 210.0),
    FormatoPagina.A5_HORIZONTAL: (210.0, 148.0),
}

# Conversão: 1 mm = 72/25.4 pontos PDF
MM_PARA_PT = 72.0 / 25.4  # ≈ 2.8346


def mm_para_pontos(mm: float) -> float:
    """Converte milímetros para pontos PDF."""
    return mm * MM_PARA_PT


def pontos_para_mm(pt: float) -> float:
    """Converte pontos PDF para milímetros."""
    return pt / MM_PARA_PT


def obter_dimensoes_pt(formato: FormatoPagina, 
                        largura_mm: float = 0, 
                        altura_mm: float = 0) -> tuple[float, float]:
    """Obtém dimensões em pontos PDF para um formato.
    
    Para formato PERSONALIZADO, usa largura_mm e altura_mm.
    """
    if formato == FormatoPagina.PERSONALIZADO:
        if largura_mm <= 0 or altura_mm <= 0:
            raise ValueError("Dimensões personalizadas devem ser positivas")
        return (mm_para_pontos(largura_mm), mm_para_pontos(altura_mm))
    
    dims = DIMENSOES_FORMATO[formato]
    return (mm_para_pontos(dims[0]), mm_para_pontos(dims[1]))


# ─── Estilo ───────────────────────────────────────────────────────

@dataclass
class Cor:
    """Representação de cor com suporte a hex, RGB e opacidade."""
    hex: str = "#000000"
    opacidade: float = 1.0
    
    @property
    def rgb(self) -> tuple[int, int, int]:
        """Converte hex para RGB."""
        h = self.hex.lstrip("#")
        return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))
    
    @property
    def rgb_normalizado(self) -> tuple[float, float, float]:
        """RGB normalizado [0,1] para uso em PDF."""
        r, g, b = self.rgb
        return (r / 255.0, g / 255.0, b / 255.0)
    
    def to_dict(self) -> dict:
        return {"hex": self.hex, "opacidade": self.opacidade}
    
    @classmethod
    def from_dict(cls, d: dict) -> "Cor":
        return cls(hex=d.get("hex", "#000000"), opacidade=d.get("opacidade", 1.0))


@dataclass
class Paleta:
    """Paleta de cores do planner."""
    nome: str = "Padrão"
    primaria: Cor = field(default_factory=lambda: Cor("#535DEB"))
    secundaria: Cor = field(default_factory=lambda: Cor("#172B70"))
    fundo_claro: Cor = field(default_factory=lambda: Cor("#F0EEFF"))
    fundo_medio: Cor = field(default_factory=lambda: Cor("#DDE2FF"))
    fundo: Cor = field(default_factory=lambda: Cor("#FFFFFF"))
    texto: Cor = field(default_factory=lambda: Cor("#1A1A1A"))
    texto_claro: Cor = field(default_factory=lambda: Cor("#6B7280"))
    destaque: Cor = field(default_factory=lambda: Cor("#535DEB"))
    
    def to_dict(self) -> dict:
        return {
            "nome": self.nome,
            "primaria": self.primaria.to_dict(),
            "secundaria": self.secundaria.to_dict(),
            "fundo_claro": self.fundo_claro.to_dict(),
            "fundo_medio": self.fundo_medio.to_dict(),
            "fundo": self.fundo.to_dict(),
            "texto": self.texto.to_dict(),
            "texto_claro": self.texto_claro.to_dict(),
            "destaque": self.destaque.to_dict(),
        }
    
    @classmethod
    def from_dict(cls, d: dict) -> "Paleta":
        return cls(
            nome=d.get("nome", "Padrão"),
            primaria=Cor.from_dict(d.get("primaria", {})),
            secundaria=Cor.from_dict(d.get("secundaria", {})),
            fundo_claro=Cor.from_dict(d.get("fundo_claro", {})),
            fundo_medio=Cor.from_dict(d.get("fundo_medio", {})),
            fundo=Cor.from_dict(d.get("fundo", {})),
            texto=Cor.from_dict(d.get("texto", {})),
            texto_claro=Cor.from_dict(d.get("texto_claro", {})),
            destaque=Cor.from_dict(d.get("destaque", {})),
        )


@dataclass
class Tipografia:
    """Configuração tipográfica."""
    familia_titulo: str = "Helvetica"
    familia_corpo: str = "Helvetica"
    tamanho_titulo: float = 24.0
    tamanho_subtitulo: float = 18.0
    tamanho_corpo: float = 10.0
    tamanho_pequeno: float = 8.0
    tamanho_rodape: float = 7.0
    
    def to_dict(self) -> dict:
        return {
            "familia_titulo": self.familia_titulo,
            "familia_corpo": self.familia_corpo,
            "tamanho_titulo": self.tamanho_titulo,
            "tamanho_subtitulo": self.tamanho_subtitulo,
            "tamanho_corpo": self.tamanho_corpo,
            "tamanho_pequeno": self.tamanho_pequeno,
            "tamanho_rodape": self.tamanho_rodape,
        }
    
    @classmethod
    def from_dict(cls, d: dict) -> "Tipografia":
        return cls(**{k: d[k] for k in d if k in cls.__dataclass_fields__})


# ─── Elementos ────────────────────────────────────────────────────

@dataclass
class Elemento:
    """Elemento visual em uma página."""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    tipo: TipoElemento = TipoElemento.TEXTO
    x: float = 0.0  # posição em mm
    y: float = 0.0
    largura: float = 50.0
    altura: float = 20.0
    rotacao: float = 0.0
    opacidade: float = 1.0
    bloqueado: bool = False
    visivel: bool = True
    camada: int = 0
    
    # Conteúdo
    texto: str = ""
    cor_texto: Cor = field(default_factory=lambda: Cor("#1A1A1A"))
    cor_fundo: Cor | None = None
    cor_borda: Cor | None = None
    espessura_borda: float = 0.0
    raio_borda: float = 0.0
    
    # Tipografia (para elementos de texto)
    familia_fonte: str = "Helvetica"
    tamanho_fonte: float = 10.0
    negrito: bool = False
    italico: bool = False
    alinhamento: str = "left"  # left, center, right
    
    # Imagem
    caminho_imagem: str = ""
    
    # Forma
    tipo_forma: TipoForma | None = None
    
    # Hyperlink
    destino_link: str = ""  # ID da página destino
    
    # Grupo
    filhos: list[str] = field(default_factory=list)  # IDs dos elementos filhos
    
    # Metadados
    nome: str = ""
    dados_extras: dict = field(default_factory=dict)
    
    def to_dict(self) -> dict:
        d = {
            "id": self.id,
            "tipo": self.tipo.value,
            "x": self.x, "y": self.y,
            "largura": self.largura, "altura": self.altura,
            "rotacao": self.rotacao, "opacidade": self.opacidade,
            "bloqueado": self.bloqueado, "visivel": self.visivel,
            "camada": self.camada,
            "texto": self.texto,
            "cor_texto": self.cor_texto.to_dict(),
            "espessura_borda": self.espessura_borda,
            "raio_borda": self.raio_borda,
            "familia_fonte": self.familia_fonte,
            "tamanho_fonte": self.tamanho_fonte,
            "negrito": self.negrito, "italico": self.italico,
            "alinhamento": self.alinhamento,
            "caminho_imagem": self.caminho_imagem,
            "destino_link": self.destino_link,
            "filhos": self.filhos,
            "nome": self.nome,
            "dados_extras": self.dados_extras,
        }
        if self.cor_fundo:
            d["cor_fundo"] = self.cor_fundo.to_dict()
        if self.cor_borda:
            d["cor_borda"] = self.cor_borda.to_dict()
        if self.tipo_forma:
            d["tipo_forma"] = self.tipo_forma.value
        return d
    
    @classmethod
    def from_dict(cls, d: dict) -> "Elemento":
        elem = cls()
        elem.id = d.get("id", str(uuid.uuid4()))
        elem.tipo = TipoElemento(d.get("tipo", "texto"))
        elem.x = d.get("x", 0)
        elem.y = d.get("y", 0)
        elem.largura = d.get("largura", 50)
        elem.altura = d.get("altura", 20)
        elem.rotacao = d.get("rotacao", 0)
        elem.opacidade = d.get("opacidade", 1.0)
        elem.bloqueado = d.get("bloqueado", False)
        elem.visivel = d.get("visivel", True)
        elem.camada = d.get("camada", 0)
        elem.texto = d.get("texto", "")
        elem.cor_texto = Cor.from_dict(d.get("cor_texto", {}))
        if "cor_fundo" in d:
            elem.cor_fundo = Cor.from_dict(d["cor_fundo"])
        if "cor_borda" in d:
            elem.cor_borda = Cor.from_dict(d["cor_borda"])
        elem.espessura_borda = d.get("espessura_borda", 0)
        elem.raio_borda = d.get("raio_borda", 0)
        elem.familia_fonte = d.get("familia_fonte", "Helvetica")
        elem.tamanho_fonte = d.get("tamanho_fonte", 10)
        elem.negrito = d.get("negrito", False)
        elem.italico = d.get("italico", False)
        elem.alinhamento = d.get("alinhamento", "left")
        elem.caminho_imagem = d.get("caminho_imagem", "")
        if "tipo_forma" in d and d["tipo_forma"]:
            elem.tipo_forma = TipoForma(d["tipo_forma"])
        elem.destino_link = d.get("destino_link", "")
        elem.filhos = d.get("filhos", [])
        elem.nome = d.get("nome", "")
        elem.dados_extras = d.get("dados_extras", {})
        return elem


# ─── Página ───────────────────────────────────────────────────────

@dataclass
class Pagina:
    """Uma página do planner."""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    tipo: TipoPagina = TipoPagina.PAGINA_LISA
    titulo: str = ""
    subtitulo: str = ""
    elementos: list[Elemento] = field(default_factory=list)
    template_id: str = ""
    
    # Metadados de data (para páginas datadas)
    data_referencia: str = ""  # ISO format: YYYY-MM-DD
    mes_referencia: int = 0
    ano_referencia: int = 0
    semana_referencia: int = 0
    
    # Identificador estável para hyperlinks
    id_navegacao: str = ""
    
    # Configuração
    cor_fundo: Cor = field(default_factory=lambda: Cor("#FFFFFF"))
    margens: dict = field(default_factory=lambda: {
        "topo": 10.0, "base": 10.0, "esquerda": 10.0, "direita": 10.0
    })
    
    # Estado
    ordem: int = 0
    secao: str = ""
    
    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "tipo": self.tipo.value,
            "titulo": self.titulo,
            "subtitulo": self.subtitulo,
            "elementos": [e.to_dict() for e in self.elementos],
            "template_id": self.template_id,
            "data_referencia": self.data_referencia,
            "mes_referencia": self.mes_referencia,
            "ano_referencia": self.ano_referencia,
            "semana_referencia": self.semana_referencia,
            "id_navegacao": self.id_navegacao,
            "cor_fundo": self.cor_fundo.to_dict(),
            "margens": self.margens,
            "ordem": self.ordem,
            "secao": self.secao,
        }
    
    @classmethod
    def from_dict(cls, d: dict) -> "Pagina":
        p = cls()
        p.id = d.get("id", str(uuid.uuid4()))
        p.tipo = TipoPagina(d.get("tipo", "pagina_lisa"))
        p.titulo = d.get("titulo", "")
        p.subtitulo = d.get("subtitulo", "")
        p.elementos = [Elemento.from_dict(e) for e in d.get("elementos", [])]
        p.template_id = d.get("template_id", "")
        p.data_referencia = d.get("data_referencia", "")
        p.mes_referencia = d.get("mes_referencia", 0)
        p.ano_referencia = d.get("ano_referencia", 0)
        p.semana_referencia = d.get("semana_referencia", 0)
        p.id_navegacao = d.get("id_navegacao", "")
        p.cor_fundo = Cor.from_dict(d.get("cor_fundo", {"hex": "#FFFFFF"}))
        p.margens = d.get("margens", {
            "topo": 10.0, "base": 10.0, "esquerda": 10.0, "direita": 10.0
        })
        p.ordem = d.get("ordem", 0)
        p.secao = d.get("secao", "")
        return p


# ─── Hyperlink ────────────────────────────────────────────────────

@dataclass
class Hyperlink:
    """Define um hyperlink entre páginas."""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    pagina_origem_id: str = ""
    elemento_id: str = ""  # elemento clicável
    pagina_destino_id: str = ""  # ID de navegação da página destino
    tipo: str = "navegacao"  # navegacao, indice, aba, retorno
    
    # Área clicável em mm (relativa à página)
    x: float = 0.0
    y: float = 0.0
    largura: float = 0.0
    altura: float = 0.0
    
    # Resolução
    numero_pagina_destino: int = -1  # Resolvido durante exportação
    valido: bool = True
    mensagem_erro: str = ""
    
    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "pagina_origem_id": self.pagina_origem_id,
            "elemento_id": self.elemento_id,
            "pagina_destino_id": self.pagina_destino_id,
            "tipo": self.tipo,
            "x": self.x, "y": self.y,
            "largura": self.largura, "altura": self.altura,
            "numero_pagina_destino": self.numero_pagina_destino,
            "valido": self.valido,
            "mensagem_erro": self.mensagem_erro,
        }
    
    @classmethod
    def from_dict(cls, d: dict) -> "Hyperlink":
        h = cls()
        for k, v in d.items():
            if hasattr(h, k):
                setattr(h, k, v)
        return h


# ─── Projeto ──────────────────────────────────────────────────────

SCHEMA_VERSION = "1.0.0"


@dataclass
class ConfiguracaoProjeto:
    """Configuração geral do projeto."""
    formato: FormatoPagina = FormatoPagina.A4_HORIZONTAL
    largura_mm: float = 297.0
    altura_mm: float = 210.0
    idioma: str = "pt-BR"
    primeiro_dia_semana: int = 0  # 0=segunda
    incluir_feriados: bool = True
    
    # Período
    data_inicio: str = ""  # ISO format
    data_fim: str = ""
    
    # Estilo
    paleta: Paleta = field(default_factory=Paleta)
    tipografia: Tipografia = field(default_factory=Tipografia)
    
    # Seções selecionadas
    secoes: list[str] = field(default_factory=list)
    
    def to_dict(self) -> dict:
        return {
            "formato": self.formato.value,
            "largura_mm": self.largura_mm,
            "altura_mm": self.altura_mm,
            "idioma": self.idioma,
            "primeiro_dia_semana": self.primeiro_dia_semana,
            "incluir_feriados": self.incluir_feriados,
            "data_inicio": self.data_inicio,
            "data_fim": self.data_fim,
            "paleta": self.paleta.to_dict(),
            "tipografia": self.tipografia.to_dict(),
            "secoes": self.secoes,
        }
    
    @classmethod
    def from_dict(cls, d: dict) -> "ConfiguracaoProjeto":
        c = cls()
        c.formato = FormatoPagina(d.get("formato", "a4_horizontal"))
        c.largura_mm = d.get("largura_mm", 297.0)
        c.altura_mm = d.get("altura_mm", 210.0)
        c.idioma = d.get("idioma", "pt-BR")
        c.primeiro_dia_semana = d.get("primeiro_dia_semana", 0)
        c.incluir_feriados = d.get("incluir_feriados", True)
        c.data_inicio = d.get("data_inicio", "")
        c.data_fim = d.get("data_fim", "")
        c.paleta = Paleta.from_dict(d.get("paleta", {}))
        c.tipografia = Tipografia.from_dict(d.get("tipografia", {}))
        c.secoes = d.get("secoes", [])
        return c


@dataclass
class ProjetoPlanner:
    """Projeto completo de um planner."""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    nome: str = "Novo Planner"
    descricao: str = ""
    schema_version: str = SCHEMA_VERSION
    
    configuracao: ConfiguracaoProjeto = field(default_factory=ConfiguracaoProjeto)
    paginas: list[Pagina] = field(default_factory=list)
    hyperlinks: list[Hyperlink] = field(default_factory=list)
    
    # Metadados
    criado_em: str = field(default_factory=lambda: datetime.now().isoformat())
    atualizado_em: str = field(default_factory=lambda: datetime.now().isoformat())
    versao: int = 1
    
    def to_dict(self) -> dict:
        self.atualizado_em = datetime.now().isoformat()
        return {
            "id": self.id,
            "nome": self.nome,
            "descricao": self.descricao,
            "schema_version": self.schema_version,
            "configuracao": self.configuracao.to_dict(),
            "paginas": [p.to_dict() for p in self.paginas],
            "hyperlinks": [h.to_dict() for h in self.hyperlinks],
            "criado_em": self.criado_em,
            "atualizado_em": self.atualizado_em,
            "versao": self.versao,
        }
    
    @classmethod
    def from_dict(cls, d: dict) -> "ProjetoPlanner":
        p = cls()
        p.id = d.get("id", str(uuid.uuid4()))
        p.nome = d.get("nome", "Novo Planner")
        p.descricao = d.get("descricao", "")
        p.schema_version = d.get("schema_version", SCHEMA_VERSION)
        p.configuracao = ConfiguracaoProjeto.from_dict(d.get("configuracao", {}))
        p.paginas = [Pagina.from_dict(pg) for pg in d.get("paginas", [])]
        p.hyperlinks = [Hyperlink.from_dict(h) for h in d.get("hyperlinks", [])]
        p.criado_em = d.get("criado_em", datetime.now().isoformat())
        p.atualizado_em = d.get("atualizado_em", datetime.now().isoformat())
        p.versao = d.get("versao", 1)
        return p
    
    def obter_pagina_por_id(self, pagina_id: str) -> Pagina | None:
        """Busca uma página pelo ID."""
        for p in self.paginas:
            if p.id == pagina_id:
                return p
        return None
    
    def obter_pagina_por_navegacao(self, id_navegacao: str) -> Pagina | None:
        """Busca uma página pelo ID de navegação."""
        for p in self.paginas:
            if p.id_navegacao == id_navegacao:
                return p
        return None
    
    def reordenar_paginas(self) -> None:
        """Atualiza os números de ordem das páginas."""
        for i, p in enumerate(self.paginas):
            p.ordem = i
    
    def adicionar_pagina(self, pagina: Pagina, posicao: int = -1) -> None:
        """Adiciona uma página na posição especificada."""
        if posicao < 0:
            self.paginas.append(pagina)
        else:
            self.paginas.insert(posicao, pagina)
        self.reordenar_paginas()
    
    def remover_pagina(self, pagina_id: str) -> bool:
        """Remove uma página e seus hyperlinks associados."""
        pagina = self.obter_pagina_por_id(pagina_id)
        if not pagina:
            return False
        self.paginas.remove(pagina)
        # Remover hyperlinks associados
        self.hyperlinks = [
            h for h in self.hyperlinks
            if h.pagina_origem_id != pagina_id and h.pagina_destino_id != pagina.id_navegacao
        ]
        self.reordenar_paginas()
        return True
    
    def mover_pagina(self, pagina_id: str, nova_posicao: int) -> bool:
        """Move uma página para uma nova posição."""
        pagina = self.obter_pagina_por_id(pagina_id)
        if not pagina:
            return False
        self.paginas.remove(pagina)
        self.paginas.insert(nova_posicao, pagina)
        self.reordenar_paginas()
        return True
