"""Motor de renderização PDF para PACCE Planner Studio.

Utiliza ReportLab para gerar PDFs com:
- Dimensões corretas em pontos PDF
- Hyperlinks internos funcionais
- Texto com fontes incorporadas
- Elementos vetoriais
- Imagens
- Metadados
"""

from __future__ import annotations

import io
import os
from pathlib import Path
from typing import Callable, Optional

from reportlab.lib.pagesizes import A4, A3, landscape, portrait
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor, Color, white, black
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import Paragraph

from ..models.planner import (
    ProjetoPlanner, Pagina, Elemento, Hyperlink, Cor,
    FormatoPagina, TipoPagina, TipoElemento, TipoForma,
    mm_para_pontos, obter_dimensoes_pt,
)


def cor_para_reportlab(cor: Cor) -> Color:
    """Converte Cor do modelo para Color do ReportLab."""
    r, g, b = cor.rgb_normalizado
    return Color(r, g, b, alpha=cor.opacidade)


def hex_para_color(hex_str: str, opacidade: float = 1.0) -> Color:
    """Converte hex string para ReportLab Color."""
    h = hex_str.lstrip("#")
    r, g, b = (int(h[i:i+2], 16) / 255.0 for i in (0, 2, 4))
    return Color(r, g, b, alpha=opacidade)


class RenderizadorPDF:
    """Renderiza um ProjetoPlanner como PDF.
    
    Coordena a renderização de todas as páginas, elementos e hyperlinks.
    As coordenadas são convertidas de milímetros para pontos PDF internamente.
    """
    
    def __init__(self, projeto: ProjetoPlanner):
        self.projeto = projeto
        self.canvas: canvas.Canvas | None = None
        self._largura_pt: float = 0
        self._altura_pt: float = 0
        self._destinos: dict[str, str] = {}  # id_navegacao -> bookmark name
        self._progresso_callback: Callable[[int, int], None] | None = None
    
    def definir_callback_progresso(self, callback: Callable[[int, int], None]) -> None:
        """Define callback para reportar progresso (pagina_atual, total)."""
        self._progresso_callback = callback
    
    def _reportar_progresso(self, atual: int, total: int) -> None:
        if self._progresso_callback:
            self._progresso_callback(atual, total)
    
    def renderizar(self, caminho_saida: str) -> str:
        """Renderiza o planner completo como PDF.
        
        Returns:
            Caminho do arquivo PDF gerado.
        """
        cfg = self.projeto.configuracao
        self._largura_pt, self._altura_pt = obter_dimensoes_pt(
            cfg.formato, cfg.largura_mm, cfg.altura_mm
        )
        
        # Criar canvas
        self.canvas = canvas.Canvas(
            caminho_saida,
            pagesize=(self._largura_pt, self._altura_pt),
        )
        
        # Metadados
        self.canvas.setTitle(self.projeto.nome)
        self.canvas.setAuthor("PACCE Planner Studio")
        self.canvas.setSubject(f"Planner digital - {self.projeto.nome}")
        self.canvas.setCreator("PACCE Planner Studio v0.1.0")
        
        total_paginas = len(self.projeto.paginas)
        
        # Primeira passada: registrar destinos (bookmarks)
        for i, pagina in enumerate(self.projeto.paginas):
            if pagina.id_navegacao:
                self._destinos[pagina.id_navegacao] = f"page_{i}"
        
        # Segunda passada: renderizar páginas
        for i, pagina in enumerate(self.projeto.paginas):
            self._reportar_progresso(i + 1, total_paginas)
            
            # Registrar bookmark para esta página
            if pagina.id_navegacao:
                bookmark = self._destinos[pagina.id_navegacao]
                self.canvas.bookmarkPage(bookmark)
                # Adicionar ao outline (índice do PDF)
                titulo_outline = pagina.titulo or pagina.id_navegacao
                self.canvas.addOutlineEntry(
                    titulo_outline, bookmark, level=0
                )
            
            # Renderizar a página
            self._renderizar_pagina(pagina, i)
            
            # Adicionar hyperlinks desta página
            self._renderizar_hyperlinks_pagina(pagina)
            
            # Nova página (exceto a última)
            if i < total_paginas - 1:
                self.canvas.showPage()
        
        # Salvar
        self.canvas.save()
        return caminho_saida
    
    def _renderizar_pagina(self, pagina: Pagina, indice: int) -> None:
        """Renderiza uma única página."""
        c = self.canvas
        
        # Fundo da página
        cor_fundo = cor_para_reportlab(pagina.cor_fundo)
        c.setFillColor(cor_fundo)
        c.rect(0, 0, self._largura_pt, self._altura_pt, fill=1, stroke=0)
        
        # Renderizar elementos
        for elemento in sorted(pagina.elementos, key=lambda e: e.camada):
            if elemento.visivel:
                self._renderizar_elemento(elemento)
    
    def _renderizar_elemento(self, elem: Elemento) -> None:
        """Renderiza um elemento individual."""
        c = self.canvas
        c.saveState()
        
        # Converter coordenadas de mm para pontos PDF
        # NOTA: PDF tem origem no canto inferior esquerdo
        # O modelo usa origem no canto superior esquerdo
        x_pt = elem.x * mm
        y_pt = self._altura_pt - (elem.y * mm) - (elem.altura * mm)
        w_pt = elem.largura * mm
        h_pt = elem.altura * mm
        
        # Rotação
        if elem.rotacao != 0:
            cx = x_pt + w_pt / 2
            cy = y_pt + h_pt / 2
            c.translate(cx, cy)
            c.rotate(elem.rotacao)
            c.translate(-cx, -cy)
        
        # Opacidade
        if elem.opacidade < 1.0:
            c.setFillAlpha(elem.opacidade)
            c.setStrokeAlpha(elem.opacidade)
        
        match elem.tipo:
            case TipoElemento.TEXTO | TipoElemento.CAIXA_TEXTO:
                self._renderizar_texto(elem, x_pt, y_pt, w_pt, h_pt)
            case TipoElemento.FORMA:
                self._renderizar_forma(elem, x_pt, y_pt, w_pt, h_pt)
            case TipoElemento.LINHA:
                self._renderizar_linha(elem, x_pt, y_pt, w_pt, h_pt)
            case TipoElemento.IMAGEM:
                self._renderizar_imagem(elem, x_pt, y_pt, w_pt, h_pt)
            case TipoElemento.CHECKBOX:
                self._renderizar_checkbox(elem, x_pt, y_pt, w_pt, h_pt)
            case TipoElemento.DIVISORIA:
                self._renderizar_divisoria(elem, x_pt, y_pt, w_pt, h_pt)
            case TipoElemento.TABELA:
                self._renderizar_tabela(elem, x_pt, y_pt, w_pt, h_pt)
        
        c.restoreState()
    
    def _renderizar_texto(
        self, elem: Elemento, x: float, y: float, w: float, h: float
    ) -> None:
        """Renderiza um elemento de texto."""
        c = self.canvas
        
        # Fundo da caixa de texto
        if elem.cor_fundo:
            c.setFillColor(cor_para_reportlab(elem.cor_fundo))
            if elem.raio_borda > 0:
                c.roundRect(x, y, w, h, elem.raio_borda * mm, fill=1, stroke=0)
            else:
                c.rect(x, y, w, h, fill=1, stroke=0)
        
        # Borda
        if elem.cor_borda and elem.espessura_borda > 0:
            c.setStrokeColor(cor_para_reportlab(elem.cor_borda))
            c.setLineWidth(elem.espessura_borda * mm)
            if elem.raio_borda > 0:
                c.roundRect(x, y, w, h, elem.raio_borda * mm, fill=0, stroke=1)
            else:
                c.rect(x, y, w, h, fill=0, stroke=1)
        
        # Texto
        if elem.texto:
            c.setFillColor(cor_para_reportlab(elem.cor_texto))
            
            # Fonte
            nome_fonte = elem.familia_fonte
            if elem.negrito and elem.italico:
                nome_fonte += "-BoldOblique"
            elif elem.negrito:
                nome_fonte += "-Bold"
            elif elem.italico:
                nome_fonte += "-Oblique"
            
            try:
                c.setFont(nome_fonte, elem.tamanho_fonte)
            except KeyError:
                c.setFont("Helvetica", elem.tamanho_fonte)
            
            # Posição do texto dentro da caixa
            text_y = y + h - elem.tamanho_fonte - 2
            padding = 2 * mm
            
            if elem.alinhamento == "center":
                c.drawCentredString(x + w / 2, text_y, elem.texto)
            elif elem.alinhamento == "right":
                c.drawRightString(x + w - padding, text_y, elem.texto)
            else:
                c.drawString(x + padding, text_y, elem.texto)
    
    def _renderizar_forma(
        self, elem: Elemento, x: float, y: float, w: float, h: float
    ) -> None:
        """Renderiza uma forma geométrica."""
        c = self.canvas
        
        cor_fill = cor_para_reportlab(elem.cor_fundo) if elem.cor_fundo else None
        cor_stroke = cor_para_reportlab(elem.cor_borda) if elem.cor_borda else cor_para_reportlab(elem.cor_texto)
        
        if cor_fill:
            c.setFillColor(cor_fill)
        if cor_stroke:
            c.setStrokeColor(cor_stroke)
        c.setLineWidth(max(elem.espessura_borda * mm, 0.5))
        
        fill = 1 if cor_fill else 0
        
        match elem.tipo_forma:
            case TipoForma.RETANGULO:
                if elem.raio_borda > 0:
                    c.roundRect(x, y, w, h, elem.raio_borda * mm, fill=fill, stroke=1)
                else:
                    c.rect(x, y, w, h, fill=fill, stroke=1)
            case TipoForma.CIRCULO:
                raio = min(w, h) / 2
                c.circle(x + w / 2, y + h / 2, raio, fill=fill, stroke=1)
            case TipoForma.ELIPSE:
                c.ellipse(x, y, x + w, y + h, fill=fill, stroke=1)
            case TipoForma.LINHA_HORIZONTAL:
                c.line(x, y + h / 2, x + w, y + h / 2)
            case TipoForma.LINHA_VERTICAL:
                c.line(x + w / 2, y, x + w / 2, y + h)
    
    def _renderizar_linha(
        self, elem: Elemento, x: float, y: float, w: float, h: float
    ) -> None:
        """Renderiza uma linha."""
        c = self.canvas
        cor = cor_para_reportlab(elem.cor_texto)
        c.setStrokeColor(cor)
        c.setLineWidth(max(elem.espessura_borda * mm, 0.5))
        c.line(x, y + h, x + w, y)
    
    def _renderizar_imagem(
        self, elem: Elemento, x: float, y: float, w: float, h: float
    ) -> None:
        """Renderiza uma imagem."""
        c = self.canvas
        if elem.caminho_imagem and os.path.exists(elem.caminho_imagem):
            try:
                c.drawImage(
                    elem.caminho_imagem, x, y, w, h,
                    preserveAspectRatio=True, anchor='c',
                    mask='auto',
                )
            except Exception:
                # Se a imagem falhar, desenhar placeholder
                c.setStrokeColor(HexColor("#CCCCCC"))
                c.setFillColor(HexColor("#F0F0F0"))
                c.rect(x, y, w, h, fill=1, stroke=1)
                c.setFillColor(black)
                c.setFont("Helvetica", 8)
                c.drawCentredString(x + w / 2, y + h / 2, "[Imagem]")
    
    def _renderizar_checkbox(
        self, elem: Elemento, x: float, y: float, w: float, h: float
    ) -> None:
        """Renderiza um checkbox."""
        c = self.canvas
        tamanho = min(w, h)
        cor = cor_para_reportlab(elem.cor_texto)
        c.setStrokeColor(cor)
        c.setLineWidth(0.5 * mm)
        c.roundRect(x, y + h - tamanho, tamanho, tamanho, 1 * mm, fill=0, stroke=1)
        
        # Texto ao lado
        if elem.texto:
            c.setFillColor(cor)
            c.setFont(elem.familia_fonte, elem.tamanho_fonte)
            c.drawString(x + tamanho + 2 * mm, y + h - elem.tamanho_fonte, elem.texto)
    
    def _renderizar_divisoria(
        self, elem: Elemento, x: float, y: float, w: float, h: float
    ) -> None:
        """Renderiza uma divisória horizontal."""
        c = self.canvas
        cor = cor_para_reportlab(elem.cor_texto)
        c.setStrokeColor(cor)
        c.setLineWidth(max(elem.espessura_borda * mm, 0.3))
        c.line(x, y + h / 2, x + w, y + h / 2)
    
    def _renderizar_tabela(
        self, elem: Elemento, x: float, y: float, w: float, h: float
    ) -> None:
        """Renderiza uma tabela simples."""
        c = self.canvas
        dados = elem.dados_extras
        linhas = dados.get("linhas", 4)
        colunas = dados.get("colunas", 3)
        
        cor_linha = cor_para_reportlab(elem.cor_texto) if elem.cor_texto else black
        c.setStrokeColor(cor_linha)
        c.setLineWidth(0.3 * mm)
        
        cell_w = w / colunas
        cell_h = h / linhas
        
        # Linhas horizontais
        for i in range(linhas + 1):
            y_l = y + h - i * cell_h
            c.line(x, y_l, x + w, y_l)
        
        # Linhas verticais
        for j in range(colunas + 1):
            x_l = x + j * cell_w
            c.line(x_l, y, x_l, y + h)
    
    def _renderizar_hyperlinks_pagina(self, pagina: Pagina) -> None:
        """Adiciona hyperlinks PDF para esta página."""
        c = self.canvas
        
        for link in self.projeto.hyperlinks:
            if link.pagina_origem_id != pagina.id:
                continue
            if not link.valido:
                continue
            if link.pagina_destino_id not in self._destinos:
                continue
            
            # Converter coordenadas
            x = link.x * mm
            y = self._altura_pt - (link.y * mm) - (link.altura * mm)
            w = link.largura * mm
            h = link.altura * mm
            
            # Criar link interno
            destino = self._destinos[link.pagina_destino_id]
            c.linkRect(
                "", destino,
                (x, y, x + w, y + h),
                Border='[0 0 0]',  # Sem borda visível
            )
    
    def renderizar_para_bytes(self) -> bytes:
        """Renderiza o planner e retorna os bytes do PDF."""
        buffer = io.BytesIO()
        cfg = self.projeto.configuracao
        self._largura_pt, self._altura_pt = obter_dimensoes_pt(
            cfg.formato, cfg.largura_mm, cfg.altura_mm
        )
        
        self.canvas = canvas.Canvas(
            buffer,
            pagesize=(self._largura_pt, self._altura_pt),
        )
        
        # Metadados
        self.canvas.setTitle(self.projeto.nome)
        self.canvas.setAuthor("PACCE Planner Studio")
        self.canvas.setCreator("PACCE Planner Studio v0.1.0")
        
        total = len(self.projeto.paginas)
        
        # Registrar destinos
        for i, pagina in enumerate(self.projeto.paginas):
            if pagina.id_navegacao:
                self._destinos[pagina.id_navegacao] = f"page_{i}"
        
        # Renderizar
        for i, pagina in enumerate(self.projeto.paginas):
            self._reportar_progresso(i + 1, total)
            
            if pagina.id_navegacao:
                bookmark = self._destinos[pagina.id_navegacao]
                self.canvas.bookmarkPage(bookmark)
                titulo = pagina.titulo or pagina.id_navegacao
                self.canvas.addOutlineEntry(titulo, bookmark, level=0)
            
            self._renderizar_pagina(pagina, i)
            self._renderizar_hyperlinks_pagina(pagina)
            
            if i < total - 1:
                self.canvas.showPage()
        
        self.canvas.save()
        buffer.seek(0)
        return buffer.read()
