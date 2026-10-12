"""Motor de hyperlinks e navegação para PACCE Planner Studio.

Gerencia a criação, resolução e validação de hyperlinks
entre páginas do planner, garantindo integridade na exportação.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Optional

from ..models.planner import (
    ProjetoPlanner, Pagina, Hyperlink, Elemento,
    TipoElemento, mm_para_pontos,
)


@dataclass
class ProblemaNavegacao:
    """Representa um problema encontrado na validação de hyperlinks."""
    tipo: str  # link_quebrado, destino_inexistente, area_fora, sobreposicao, destino_incorreto
    hyperlink_id: str
    pagina_origem_id: str
    descricao: str
    severidade: str = "erro"  # erro, aviso


@dataclass
class RelatorioValidacao:
    """Relatório de validação dos hyperlinks."""
    total_hyperlinks: int = 0
    total_validos: int = 0
    total_invalidos: int = 0
    problemas: list[ProblemaNavegacao] = field(default_factory=list)
    
    @property
    def aprovado(self) -> bool:
        """Retorna True se não há erros (avisos são permitidos)."""
        return all(p.severidade != "erro" for p in self.problemas)
    
    def resumo(self) -> str:
        """Gera um resumo legível do relatório."""
        linhas = [
            f"=== Relatório de Validação de Hyperlinks ===",
            f"Total: {self.total_hyperlinks}",
            f"Válidos: {self.total_validos}",
            f"Inválidos: {self.total_invalidos}",
            f"Status: {'✅ APROVADO' if self.aprovado else '❌ REPROVADO'}",
        ]
        if self.problemas:
            linhas.append("\nProblemas encontrados:")
            for p in self.problemas:
                icone = "🔴" if p.severidade == "erro" else "🟡"
                linhas.append(f"  {icone} [{p.tipo}] {p.descricao}")
        return "\n".join(linhas)


class MotorNavegacao:
    """Motor de hyperlinks e navegação.
    
    Responsabilidades:
    - Criar hyperlinks entre páginas
    - Resolver IDs de navegação para números de página
    - Validar integridade da navegação
    - Gerar elementos de navegação (abas, botões, índice)
    """
    
    def __init__(self, projeto: ProjetoPlanner):
        self.projeto = projeto
        self._mapa_navegacao: dict[str, int] = {}  # id_navegacao -> índice da página
    
    def _construir_mapa(self) -> None:
        """Constrói o mapa de navegação a partir das páginas atuais."""
        self._mapa_navegacao.clear()
        for i, pagina in enumerate(self.projeto.paginas):
            if pagina.id_navegacao:
                self._mapa_navegacao[pagina.id_navegacao] = i
    
    def resolver_hyperlinks(self) -> None:
        """Resolve todos os hyperlinks para números de página reais."""
        self._construir_mapa()
        
        for link in self.projeto.hyperlinks:
            destino = link.pagina_destino_id
            if destino in self._mapa_navegacao:
                link.numero_pagina_destino = self._mapa_navegacao[destino]
                link.valido = True
                link.mensagem_erro = ""
            else:
                link.numero_pagina_destino = -1
                link.valido = False
                link.mensagem_erro = f"Destino '{destino}' não encontrado"
    
    def validar(self) -> RelatorioValidacao:
        """Valida todos os hyperlinks e retorna relatório."""
        self._construir_mapa()
        relatorio = RelatorioValidacao()
        relatorio.total_hyperlinks = len(self.projeto.hyperlinks)
        
        for link in self.projeto.hyperlinks:
            problemas = self._validar_link(link)
            if problemas:
                link.valido = False
                relatorio.problemas.extend(problemas)
                relatorio.total_invalidos += 1
            else:
                link.valido = True
                relatorio.total_validos += 1
        
        return relatorio
    
    def _validar_link(self, link: Hyperlink) -> list[ProblemaNavegacao]:
        """Valida um hyperlink individual."""
        problemas = []
        
        # Verificar se o destino existe
        if link.pagina_destino_id not in self._mapa_navegacao:
            problemas.append(ProblemaNavegacao(
                tipo="destino_inexistente",
                hyperlink_id=link.id,
                pagina_origem_id=link.pagina_origem_id,
                descricao=f"Destino '{link.pagina_destino_id}' não existe nas páginas do projeto",
            ))
            return problemas
        
        # Verificar se a página de origem existe
        pagina_origem = self.projeto.obter_pagina_por_id(link.pagina_origem_id)
        if not pagina_origem:
            problemas.append(ProblemaNavegacao(
                tipo="link_quebrado",
                hyperlink_id=link.id,
                pagina_origem_id=link.pagina_origem_id,
                descricao=f"Página de origem '{link.pagina_origem_id}' não existe",
            ))
            return problemas
        
        # Verificar área clicável dentro dos limites da página
        cfg = self.projeto.configuracao
        larg_mm = cfg.largura_mm
        alt_mm = cfg.altura_mm
        
        if link.largura > 0 and link.altura > 0:
            if (link.x < 0 or link.y < 0 or
                link.x + link.largura > larg_mm or
                link.y + link.altura > alt_mm):
                problemas.append(ProblemaNavegacao(
                    tipo="area_fora",
                    hyperlink_id=link.id,
                    pagina_origem_id=link.pagina_origem_id,
                    descricao=(
                        f"Área clicável ({link.x:.1f},{link.y:.1f} "
                        f"{link.largura:.1f}x{link.altura:.1f}mm) "
                        f"excede os limites da página ({larg_mm:.1f}x{alt_mm:.1f}mm)"
                    ),
                    severidade="aviso",
                ))
        
        return problemas
    
    def criar_link_indice(
        self, pagina_indice: Pagina, pagina_destino: Pagina,
        x: float, y: float, largura: float, altura: float
    ) -> Hyperlink:
        """Cria um hyperlink do índice para uma página."""
        link = Hyperlink(
            pagina_origem_id=pagina_indice.id,
            pagina_destino_id=pagina_destino.id_navegacao,
            tipo="indice",
            x=x, y=y, largura=largura, altura=altura,
        )
        self.projeto.hyperlinks.append(link)
        return link
    
    def criar_link_navegacao(
        self, pagina_origem: Pagina, pagina_destino: Pagina,
        x: float, y: float, largura: float, altura: float,
        tipo: str = "navegacao"
    ) -> Hyperlink:
        """Cria um hyperlink de navegação entre páginas."""
        link = Hyperlink(
            pagina_origem_id=pagina_origem.id,
            pagina_destino_id=pagina_destino.id_navegacao,
            tipo=tipo,
            x=x, y=y, largura=largura, altura=altura,
        )
        self.projeto.hyperlinks.append(link)
        return link
    
    def criar_navegacao_sequencial(
        self, paginas: list[Pagina],
        x_anterior: float, y_nav: float, x_proximo: float,
        largura_botao: float, altura_botao: float,
        pagina_indice: Pagina | None = None,
        x_indice: float = 0, largura_indice: float = 0,
    ) -> list[Hyperlink]:
        """Cria navegação sequencial (anterior/próximo) entre uma lista de páginas.
        
        Opcionalmente adiciona botão de retorno ao índice.
        """
        links = []
        
        for i, pagina in enumerate(paginas):
            # Botão anterior
            if i > 0:
                links.append(self.criar_link_navegacao(
                    pagina, paginas[i - 1],
                    x_anterior, y_nav, largura_botao, altura_botao,
                    tipo="navegacao",
                ))
            
            # Botão próximo
            if i < len(paginas) - 1:
                links.append(self.criar_link_navegacao(
                    pagina, paginas[i + 1],
                    x_proximo, y_nav, largura_botao, altura_botao,
                    tipo="navegacao",
                ))
            
            # Botão retorno ao índice
            if pagina_indice and largura_indice > 0:
                links.append(self.criar_link_navegacao(
                    pagina, pagina_indice,
                    x_indice, y_nav, largura_indice, altura_botao,
                    tipo="retorno",
                ))
        
        return links
    
    def criar_abas_mensais(
        self, paginas_mensais: list[Pagina],
        y_aba: float, largura_aba: float, altura_aba: float,
        x_inicio: float, espacamento: float,
        paginas_destino: list[Pagina] | None = None,
    ) -> list[Hyperlink]:
        """Cria abas de navegação mensal em múltiplas páginas.
        
        As abas são posicionadas horizontalmente ou verticalmente.
        Se paginas_destino for fornecido, as abas são criadas nessas páginas.
        """
        destinos = paginas_destino or paginas_mensais
        links = []
        
        for pagina_destino_abas in destinos:
            for j, pagina_mes in enumerate(paginas_mensais):
                x = x_inicio + j * (largura_aba + espacamento)
                links.append(self.criar_link_navegacao(
                    pagina_destino_abas, pagina_mes,
                    x, y_aba, largura_aba, altura_aba,
                    tipo="aba",
                ))
        
        return links
    
    def recalcular_apos_reorganizacao(self) -> RelatorioValidacao:
        """Recalcula e valida hyperlinks após reorganização de páginas."""
        self.resolver_hyperlinks()
        return self.validar()
