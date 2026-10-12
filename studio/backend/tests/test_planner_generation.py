"""Testes do gerador de planner, modelos e geração de PDF."""

import os
import sys
import tempfile
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
    mm_para_pontos,
    obter_dimensoes_pt,
)
from pacce.templates.generator import GeradorPlanner
from pacce.pdf.navigation import MotorNavegacao
from pacce.pdf.renderer import RenderizadorPDF
from pacce.utils.persistence import GerenciadorProjetos


def test_conversao_dimensoes_a4_horizontal():
    """Valida cálculo de dimensões em mm e pontos PDF para A4 Horizontal."""
    larg_pt, alt_pt = obter_dimensoes_pt(FormatoPagina.A4_HORIZONTAL)
    # A4 horizontal = 297mm x 210mm
    # 297 * 72 / 25.4 ≈ 841.8897 pt
    # 210 * 72 / 25.4 ≈ 595.2755 pt
    assert round(larg_pt, 2) == 841.89
    assert round(alt_pt, 2) == 595.28


def test_fluxo_inicial_outubro_2026():
    """Testa o primeiro fluxo funcional requerido:
    Criar um planner A4 horizontal em português brasileiro,
    com capa, índice, calendário de outubro de 2026 e hyperlinks internos válidos.
    """
    config = ConfiguracaoProjeto(
        formato=FormatoPagina.A4_HORIZONTAL,
        largura_mm=297.0,
        altura_mm=210.0,
        idioma="pt-BR",
        primeiro_dia_semana=0,
        incluir_feriados=True,
        data_inicio="2026-10-01",
        data_fim="2026-10-31",
        secoes=[
            SecaoPlanejamento.CAPA.value,
            SecaoPlanejamento.INDICE.value,
            SecaoPlanejamento.CALENDARIO_MENSAL.value,
        ],
    )

    projeto = ProjetoPlanner(
        nome="PACCE Planner - Outubro 2026",
        configuracao=config,
    )

    gerador = GeradorPlanner(projeto)
    gerador.gerar()

    # Validações estruturais
    assert len(projeto.paginas) >= 3
    ids_paginas = [p.id_navegacao for p in projeto.paginas]
    assert "capa" in ids_paginas
    assert "indice" in ids_paginas
    assert "mes-2026-10" in ids_paginas

    # Validação de Hyperlinks
    nav = MotorNavegacao(projeto)
    relatorio = nav.validar()
    assert relatorio.total_hyperlinks > 0
    assert relatorio.total_invalidos == 0
    assert relatorio.aprovado is True

    # Renderização de PDF
    with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp:
        caminho_pdf = tmp.name

    try:
        renderer = RenderizadorPDF(projeto)
        renderer.renderizar(caminho_pdf)

        assert os.path.exists(caminho_pdf)
        tamanho = os.path.getsize(caminho_pdf)
        assert tamanho > 1024  # Arquivo gerado tem conteúdo
    finally:
        if os.path.exists(caminho_pdf):
            os.remove(caminho_pdf)


def test_persistencia_projeto():
    """Valida salvar, carregar e listar projetos em JSON."""
    with tempfile.TemporaryDirectory() as tmpdir:
        gerenciador = GerenciadorProjetos(tmpdir)

        config = ConfiguracaoProjeto(
            formato=FormatoPagina.A4_HORIZONTAL,
            data_inicio="2026-10-01",
            data_fim="2026-10-31",
            secoes=[SecaoPlanejamento.CAPA.value],
        )
        projeto = ProjetoPlanner(nome="Planner Teste", configuracao=config)
        gerador = GeradorPlanner(projeto)
        gerador.gerar()

        # Salvar
        arquivo = gerenciador.salvar(projeto)
        assert arquivo.exists()

        # Listar
        lista = gerenciador.listar()
        assert len(lista) == 1
        assert lista[0]["nome"] == "Planner Teste"

        # Carregar
        carregado = gerenciador.carregar(projeto.id)
        assert carregado.id == projeto.id
        assert carregado.nome == "Planner Teste"
        assert len(carregado.paginas) == len(projeto.paginas)
