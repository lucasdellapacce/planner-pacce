"""Gerenciador de adesivos (stickers) digitais para PACCE Planner Studio.

Permite:
- Carregar ícones e ilustrações
- Personalizar cores, fundos e textos
- Exportar para PNG transparente com Pillow
- Empacotar coleções em arquivos ZIP para importação no Goodnotes
"""

from __future__ import annotations

import io
import json
import os
import zipfile
from dataclasses import dataclass, field
from pathlib import Path
from typing import Optional

from PIL import Image, ImageDraw, ImageFont


@dataclass
class Adesivo:
    """Modelo de um adesivo digital."""
    id: str
    nome: str
    categoria: str
    formato: str = "png"  # png ou svg
    largura: int = 512
    altura: int = 512
    cor_primaria: str = "#535DEB"
    cor_secundaria: str = "#172B70"
    cor_fundo: Optional[str] = None
    texto: str = ""
    caminho_arquivo: str = ""
    tags: list[str] = field(default_factory=list)


class MotorAdesivos:
    """Motor para geração, customização e exportação de adesivos digitais."""

    CATEGORIAS = [
        "Tarefas",
        "Compromissos",
        "Trabalho",
        "Estudos",
        "Leitura",
        "Hábitos",
        "Saúde e bem-estar",
        "Datas especiais",
        "Decoração",
        "Navegação",
        "Etiquetas",
        "Checklists",
    ]

    def __init__(self, diretorio_base: str | Path | None = None):
        self.diretorio_base = Path(diretorio_base) if diretorio_base else Path("resources/stickers")
        self.diretorio_base.mkdir(parents=True, exist_ok=True)

    def gerar_adesivo_etiqueta(
        self,
        texto: str,
        cor_fundo: str = "#535DEB",
        cor_texto: str = "#FFFFFF",
        largura: int = 400,
        altura: int = 120,
        raio_canto: int = 24,
    ) -> Image.Image:
        """Gera um adesivo de etiqueta minimalista em PNG transparente com cantos arredondados."""
        img = Image.new("RGBA", (largura, altura), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)

        # Desenhar retângulo arredondado
        draw.rounded_rectangle(
            [(4, 4), (largura - 4, altura - 4)],
            radius=raio_canto,
            fill=cor_fundo,
        )

        # Adicionar texto centralizado
        # Usamos fonte padrão do Pillow se fontes TTF não estiverem carregadas
        try:
            # Tentar fonte padrão
            font = ImageFont.load_default(size=24)
        except TypeError:
            font = ImageFont.load_default()

        bbox = draw.textbbox((0, 0), texto, font=font)
        text_w = bbox[2] - bbox[0]
        text_h = bbox[3] - bbox[1]

        x = (largura - text_w) / 2
        y = (altura - text_h) / 2

        draw.text((x, y), texto, fill=cor_texto, font=font)
        return img

    def gerar_adesivo_icone_tag(
        self,
        icone_label: str,
        texto: str,
        cor_fundo: str = "#F0EEFF",
        cor_borda: str = "#535DEB",
        cor_texto: str = "#172B70",
        largura: int = 300,
        altura: int = 300,
    ) -> Image.Image:
        """Gera um badge/adesivo circular ou quadrado decorativo."""
        img = Image.new("RGBA", (largura, altura), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)

        # Fundo circular
        draw.ellipse([(10, 10), (largura - 10, altura - 10)], fill=cor_fundo, outline=cor_borda, width=6)

        try:
            font_icone = ImageFont.load_default(size=36)
            font_texto = ImageFont.load_default(size=20)
        except TypeError:
            font_icone = ImageFont.load_default()
            font_texto = ImageFont.load_default()

        # Ícone/Símbolo
        bbox_i = draw.textbbox((0, 0), icone_label, font=font_icone)
        w_i = bbox_i[2] - bbox_i[0]
        draw.text(((largura - w_i) / 2, altura * 0.3), icone_label, fill=cor_borda, font=font_icone)

        # Texto descritivo
        bbox_t = draw.textbbox((0, 0), texto, font=font_texto)
        w_t = bbox_t[2] - bbox_t[0]
        draw.text(((largura - w_t) / 2, altura * 0.58), texto, fill=cor_texto, font=font_texto)

        return img

    def criar_colecao_padrao(self) -> list[tuple[str, Image.Image]]:
        """Gera uma coleção padrão de adesivos de alta qualidade."""
        colecao = []

        # 1. Etiquetas de Prioridade
        colecao.append(("etiqueta_alta_prioridade.png", self.gerar_adesivo_etiqueta("URGENTE", "#EF4444", "#FFFFFF")))
        colecao.append(("etiqueta_importante.png", self.gerar_adesivo_etiqueta("IMPORTANTE", "#F59E0B", "#FFFFFF")))
        colecao.append(("etiqueta_concluido.png", self.gerar_adesivo_etiqueta("CONCLUÍDO", "#10B981", "#FFFFFF")))
        colecao.append(("etiqueta_pacce_foco.png", self.gerar_adesivo_etiqueta("FOCO TOTAL", "#535DEB", "#FFFFFF")))

        # 2. Badges de Hábitos e Produtividade
        colecao.append(("badge_leitura.png", self.gerar_adesivo_icone_tag("LIVRO", "Leitura do Dia", "#F0EEFF", "#535DEB", "#172B70")))
        colecao.append(("badge_estudos.png", self.gerar_adesivo_icone_tag("ESTUDO", "Revisão OK", "#DDE2FF", "#172B70", "#172B70")))
        colecao.append(("badge_habito.png", self.gerar_adesivo_icone_tag("META", "Hábito Feito", "#ECFDF5", "#10B981", "#065F46")))
        colecao.append(("badge_reuniao.png", self.gerar_adesivo_icone_tag("REUNIÃO", "Sync de Equipe", "#FEF3C7", "#D97706", "#78350F")))

        return colecao

    def exportar_pacote_zip(self, caminho_zip: str | Path, adesivos: list[tuple[str, Image.Image]] | None = None) -> str:
        """Exporta a coleção de adesivos como um arquivo ZIP para fácil importação no Goodnotes."""
        caminho_zip = Path(caminho_zip)
        caminho_zip.parent.mkdir(parents=True, exist_ok=True)

        itens = adesivos if adesivos is not None else self.criar_colecao_padrao()

        with zipfile.ZipFile(caminho_zip, "w", zipfile.ZIP_DEFLATED) as zf:
            for nome_arquivo, img in itens:
                buffer = io.BytesIO()
                img.save(buffer, format="PNG")
                zf.writestr(f"adesivos/{nome_arquivo}", buffer.getvalue())

        return str(caminho_zip)
