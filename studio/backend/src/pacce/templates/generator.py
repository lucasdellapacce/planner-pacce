"""Gerador de planner para PACCE Planner Studio.

Cria automaticamente as páginas de um planner a partir
da configuração do projeto, incluindo:
- Capa
- Índice com hyperlinks
- Calendários mensais
- Planejamento semanal
- Planejamento diário
- Seções extras
- Navegação completa
"""

from __future__ import annotations

from datetime import date
from typing import Optional

from ..calendar.engine import (
    MotorCalendario, DiaDaSemana, MesCalendario, SemanaCalendario,
    MESES_PTBR, MESES_PTBR_ABREV, DIAS_SEMANA_PTBR_ABREV,
)
from ..models.planner import (
    ProjetoPlanner, ConfiguracaoProjeto, Pagina, Elemento, Hyperlink,
    Cor, Paleta, TipoPagina, TipoElemento, TipoForma,
    FormatoPagina, SecaoPlanejamento, mm_para_pontos,
)
from ..pdf.navigation import MotorNavegacao


class GeradorPlanner:
    """Gera automaticamente as páginas de um planner.
    
    A partir da configuração do projeto, cria todas as páginas
    necessárias com layouts, elementos e hyperlinks.
    """
    
    def __init__(self, projeto: ProjetoPlanner):
        self.projeto = projeto
        self.cfg = projeto.configuracao
        self.paleta = self.cfg.paleta
        self.motor_cal = MotorCalendario(
            primeiro_dia_semana=DiaDaSemana(self.cfg.primeiro_dia_semana),
            incluir_feriados=self.cfg.incluir_feriados,
        )
        self.motor_nav = MotorNavegacao(projeto)
        
        # Dimensões em mm
        self.larg = self.cfg.largura_mm
        self.alt = self.cfg.altura_mm
        
        # Margens padrão em mm
        self.margem_topo = 12.0
        self.margem_base = 10.0
        self.margem_esq = 12.0
        self.margem_dir = 12.0
        
        # Área útil
        self.area_larg = self.larg - self.margem_esq - self.margem_dir
        self.area_alt = self.alt - self.margem_topo - self.margem_base
        
        # Cores da paleta
        self.cor_primaria = self.paleta.primaria
        self.cor_secundaria = self.paleta.secundaria
        self.cor_fundo_claro = self.paleta.fundo_claro
        self.cor_fundo_medio = self.paleta.fundo_medio
        self.cor_fundo = self.paleta.fundo
        self.cor_texto = self.paleta.texto
        self.cor_texto_claro = self.paleta.texto_claro
    
    def gerar(self) -> ProjetoPlanner:
        """Gera todas as páginas do planner."""
        self.projeto.paginas.clear()
        self.projeto.hyperlinks.clear()
        
        data_inicio = date.fromisoformat(self.cfg.data_inicio)
        data_fim = date.fromisoformat(self.cfg.data_fim)
        
        secoes = self.cfg.secoes
        
        # Gerar páginas por seção
        if SecaoPlanejamento.CAPA.value in secoes:
            self._gerar_capa()
        
        if SecaoPlanejamento.INDICE.value in secoes:
            self._gerar_indice()
        
        # Gerar calendários mensais
        meses = self.motor_cal.gerar_intervalo(data_inicio, data_fim)
        
        if SecaoPlanejamento.CALENDARIO_MENSAL.value in secoes:
            self._gerar_calendarios_mensais(meses)
        
        if SecaoPlanejamento.PLANEJAMENTO_SEMANAL.value in secoes:
            self._gerar_planejamento_semanal(data_inicio, data_fim, meses)
        
        if SecaoPlanejamento.PLANEJAMENTO_DIARIO.value in secoes:
            self._gerar_planejamento_diario(data_inicio, data_fim)
        
        if SecaoPlanejamento.HABITOS.value in secoes:
            self._gerar_rastreador_habitos(meses)
        
        if SecaoPlanejamento.PROJETOS.value in secoes:
            self._gerar_planejamento_projetos()
        
        if SecaoPlanejamento.ESTUDOS.value in secoes:
            self._gerar_planejamento_estudos()
        
        if SecaoPlanejamento.LEITURA.value in secoes:
            self._gerar_rastreador_leitura()
        
        if SecaoPlanejamento.REVISOES_MENSAIS.value in secoes:
            self._gerar_revisoes_mensais(meses)
        
        if SecaoPlanejamento.PAGINAS_LIVRES.value in secoes:
            self._gerar_paginas_livres()
        
        # Atualizar ordens
        self.projeto.reordenar_paginas()
        
        # Preencher índice
        if SecaoPlanejamento.INDICE.value in secoes:
            self._preencher_indice()
        
        # Criar navegação
        self._criar_navegacao_global(meses)
        
        # Resolver e validar hyperlinks
        self.motor_nav.resolver_hyperlinks()
        
        return self.projeto
    
    # ─── Geradores de páginas ─────────────────────────────────────
    
    def _gerar_capa(self) -> Pagina:
        """Gera a página de capa."""
        pagina = Pagina(
            tipo=TipoPagina.CAPA,
            titulo=self.projeto.nome,
            id_navegacao="capa",
            cor_fundo=Cor(self.cor_primaria.hex),
            secao="capa",
        )
        
        # Título centralizado
        pagina.elementos.append(Elemento(
            tipo=TipoElemento.TEXTO,
            x=self.larg * 0.15,
            y=self.alt * 0.35,
            largura=self.larg * 0.7,
            altura=20.0,
            texto=self.projeto.nome,
            cor_texto=Cor("#FFFFFF"),
            familia_fonte="Helvetica",
            tamanho_fonte=36.0,
            negrito=True,
            alinhamento="center",
        ))
        
        # Período
        data_inicio = date.fromisoformat(self.cfg.data_inicio)
        data_fim = date.fromisoformat(self.cfg.data_fim)
        periodo = (
            f"{MESES_PTBR[data_inicio.month]} {data_inicio.year} — "
            f"{MESES_PTBR[data_fim.month]} {data_fim.year}"
        )
        pagina.elementos.append(Elemento(
            tipo=TipoElemento.TEXTO,
            x=self.larg * 0.15,
            y=self.alt * 0.5,
            largura=self.larg * 0.7,
            altura=12.0,
            texto=periodo,
            cor_texto=Cor("#FFFFFF", 0.85),
            familia_fonte="Helvetica",
            tamanho_fonte=16.0,
            alinhamento="center",
        ))
        
        # Linha decorativa
        pagina.elementos.append(Elemento(
            tipo=TipoElemento.FORMA,
            tipo_forma=TipoForma.RETANGULO,
            x=self.larg * 0.35,
            y=self.alt * 0.47,
            largura=self.larg * 0.3,
            altura=0.5,
            cor_fundo=Cor("#FFFFFF", 0.5),
        ))
        
        self.projeto.adicionar_pagina(pagina)
        return pagina
    
    def _gerar_indice(self) -> Pagina:
        """Gera a página de índice (será preenchida depois)."""
        pagina = Pagina(
            tipo=TipoPagina.INDICE,
            titulo="Índice",
            id_navegacao="indice",
            cor_fundo=self.cor_fundo,
            secao="indice",
        )
        
        # Título
        pagina.elementos.append(Elemento(
            tipo=TipoElemento.TEXTO,
            x=self.margem_esq,
            y=self.margem_topo,
            largura=self.area_larg,
            altura=12.0,
            texto="Índice",
            cor_texto=self.cor_secundaria,
            familia_fonte="Helvetica",
            tamanho_fonte=24.0,
            negrito=True,
            alinhamento="left",
        ))
        
        # Linha sob o título
        pagina.elementos.append(Elemento(
            tipo=TipoElemento.FORMA,
            tipo_forma=TipoForma.RETANGULO,
            x=self.margem_esq,
            y=self.margem_topo + 14,
            largura=self.area_larg,
            altura=0.5,
            cor_fundo=self.cor_primaria,
        ))
        
        self.projeto.adicionar_pagina(pagina)
        return pagina
    
    def _gerar_calendarios_mensais(self, meses: list[MesCalendario]) -> list[Pagina]:
        """Gera páginas de calendário mensal."""
        paginas = []
        
        for mes_cal in meses:
            pagina = Pagina(
                tipo=TipoPagina.PLANEJAMENTO_MENSAL,
                titulo=f"{mes_cal.nome} {mes_cal.ano}",
                id_navegacao=mes_cal.id_pagina,
                mes_referencia=mes_cal.mes,
                ano_referencia=mes_cal.ano,
                cor_fundo=self.cor_fundo,
                secao="calendario_mensal",
            )
            
            # Título do mês
            pagina.elementos.append(Elemento(
                tipo=TipoElemento.TEXTO,
                x=self.margem_esq,
                y=self.margem_topo,
                largura=self.area_larg,
                altura=12.0,
                texto=f"{mes_cal.nome} {mes_cal.ano}",
                cor_texto=self.cor_secundaria,
                familia_fonte="Helvetica",
                tamanho_fonte=22.0,
                negrito=True,
                alinhamento="center",
            ))
            
            # Cabeçalho dos dias da semana
            dias_semana = self.motor_cal.obter_dias_semana_ordenados()
            cell_w = self.area_larg / 7
            header_y = self.margem_topo + 18
            
            for j, dia_nome in enumerate(dias_semana):
                x = self.margem_esq + j * cell_w
                pagina.elementos.append(Elemento(
                    tipo=TipoElemento.TEXTO,
                    x=x,
                    y=header_y,
                    largura=cell_w,
                    altura=6.0,
                    texto=dia_nome,
                    cor_texto=self.cor_primaria,
                    familia_fonte="Helvetica",
                    tamanho_fonte=9.0,
                    negrito=True,
                    alinhamento="center",
                ))
            
            # Grid do calendário
            cell_h = min((self.area_alt - 30) / len(mes_cal.semanas), 25.0)
            grid_y = header_y + 8
            
            for i, semana in enumerate(mes_cal.semanas):
                for j, dia in enumerate(semana.dias):
                    x = self.margem_esq + j * cell_w
                    y = grid_y + i * cell_h
                    
                    # Fundo da célula
                    cor_cel = self.cor_fundo_claro if dia.pertence_ao_mes else Cor("#F8F8F8")
                    if dia.eh_fim_semana and dia.pertence_ao_mes:
                        cor_cel = self.cor_fundo_medio
                    
                    pagina.elementos.append(Elemento(
                        tipo=TipoElemento.FORMA,
                        tipo_forma=TipoForma.RETANGULO,
                        x=x + 0.3,
                        y=y + 0.3,
                        largura=cell_w - 0.6,
                        altura=cell_h - 0.6,
                        cor_fundo=cor_cel,
                        cor_borda=Cor("#E5E7EB"),
                        espessura_borda=0.1,
                        raio_borda=1.0,
                    ))
                    
                    # Número do dia
                    cor_num = self.cor_texto if dia.pertence_ao_mes else self.cor_texto_claro
                    pagina.elementos.append(Elemento(
                        tipo=TipoElemento.TEXTO,
                        x=x + 1.5,
                        y=y + 1.0,
                        largura=cell_w - 3,
                        altura=5.0,
                        texto=str(dia.dia),
                        cor_texto=cor_num,
                        familia_fonte="Helvetica",
                        tamanho_fonte=9.0,
                        negrito=dia.eh_feriado,
                        alinhamento="right",
                    ))
                    
                    # Indicador de feriado
                    if dia.eh_feriado and dia.pertence_ao_mes:
                        pagina.elementos.append(Elemento(
                            tipo=TipoElemento.TEXTO,
                            x=x + 1.5,
                            y=y + 6.5,
                            largura=cell_w - 3,
                            altura=4.0,
                            texto=dia.nome_feriado[:15],
                            cor_texto=self.cor_primaria,
                            familia_fonte="Helvetica",
                            tamanho_fonte=5.0,
                            alinhamento="left",
                        ))
            
            self.projeto.adicionar_pagina(pagina)
            paginas.append(pagina)
        
        return paginas
    
    def _gerar_planejamento_semanal(
        self, data_inicio: date, data_fim: date,
        meses: list[MesCalendario]
    ) -> list[Pagina]:
        """Gera páginas de planejamento semanal."""
        paginas = []
        semanas = self.motor_cal.gerar_semanas_intervalo(data_inicio, data_fim)
        
        for semana in semanas:
            pagina = Pagina(
                tipo=TipoPagina.PLANEJAMENTO_SEMANAL,
                titulo=f"Semana {semana.numero_semana}",
                subtitulo=semana.label,
                id_navegacao=semana.id_pagina,
                semana_referencia=semana.numero_semana,
                ano_referencia=semana.ano_semana,
                cor_fundo=self.cor_fundo,
                secao="planejamento_semanal",
            )
            
            # Título
            pagina.elementos.append(Elemento(
                tipo=TipoElemento.TEXTO,
                x=self.margem_esq,
                y=self.margem_topo,
                largura=self.area_larg * 0.6,
                altura=10.0,
                texto=f"Semana {semana.numero_semana} — {semana.label}",
                cor_texto=self.cor_secundaria,
                familia_fonte="Helvetica",
                tamanho_fonte=16.0,
                negrito=True,
            ))
            
            # Linha decorativa
            pagina.elementos.append(Elemento(
                tipo=TipoElemento.FORMA,
                tipo_forma=TipoForma.RETANGULO,
                x=self.margem_esq,
                y=self.margem_topo + 12,
                largura=self.area_larg,
                altura=0.4,
                cor_fundo=self.cor_primaria,
            ))
            
            # Layout: 7 colunas para os dias + coluna de notas
            col_w = self.area_larg / 4  # 4 colunas
            row_h = (self.area_alt - 20) / 2  # 2 linhas
            start_y = self.margem_topo + 16
            
            for idx, dia in enumerate(semana.dias):
                if idx < 4:
                    col = idx
                    row = 0
                else:
                    col = idx - 4
                    row = 1
                
                x = self.margem_esq + col * col_w
                y = start_y + row * row_h
                
                # Se é o último slot (idx=7 não existe, usamos 7 dias em 8 slots)
                if idx >= 7:
                    continue
                
                # Cabeçalho do dia
                cor_header = self.cor_primaria if not dia.eh_fim_semana else self.cor_secundaria
                pagina.elementos.append(Elemento(
                    tipo=TipoElemento.FORMA,
                    tipo_forma=TipoForma.RETANGULO,
                    x=x + 0.5,
                    y=y,
                    largura=col_w - 1,
                    altura=7.0,
                    cor_fundo=cor_header,
                    raio_borda=1.5,
                ))
                
                pagina.elementos.append(Elemento(
                    tipo=TipoElemento.TEXTO,
                    x=x + 2,
                    y=y + 0.8,
                    largura=col_w - 4,
                    altura=6.0,
                    texto=f"{dia.nome_dia_semana_abrev} {dia.dia}/{dia.mes:02d}",
                    cor_texto=Cor("#FFFFFF"),
                    familia_fonte="Helvetica",
                    tamanho_fonte=8.0,
                    negrito=True,
                    alinhamento="center",
                ))
                
                # Área de escrita
                pagina.elementos.append(Elemento(
                    tipo=TipoElemento.FORMA,
                    tipo_forma=TipoForma.RETANGULO,
                    x=x + 0.5,
                    y=y + 8,
                    largura=col_w - 1,
                    altura=row_h - 10,
                    cor_fundo=self.cor_fundo_claro,
                    cor_borda=Cor("#E5E7EB"),
                    espessura_borda=0.1,
                    raio_borda=1.5,
                ))
                
                # Linhas pautadas
                linha_y = y + 14
                while linha_y < y + row_h - 4:
                    pagina.elementos.append(Elemento(
                        tipo=TipoElemento.FORMA,
                        tipo_forma=TipoForma.LINHA_HORIZONTAL,
                        x=x + 2,
                        y=linha_y,
                        largura=col_w - 4,
                        altura=0.1,
                        cor_texto=Cor("#E5E7EB"),
                        espessura_borda=0.05,
                    ))
                    linha_y += 5.0
            
            # Notas (coluna extra se sobrar espaço na última posição)
            if len(semana.dias) == 7:
                # A 8ª posição é "Notas"
                x = self.margem_esq + 3 * col_w
                y = start_y + row_h
                
                pagina.elementos.append(Elemento(
                    tipo=TipoElemento.FORMA,
                    tipo_forma=TipoForma.RETANGULO,
                    x=x + 0.5,
                    y=y,
                    largura=col_w - 1,
                    altura=7.0,
                    cor_fundo=Cor("#6B7280"),
                    raio_borda=1.5,
                ))
                pagina.elementos.append(Elemento(
                    tipo=TipoElemento.TEXTO,
                    x=x + 2,
                    y=y + 0.8,
                    largura=col_w - 4,
                    altura=6.0,
                    texto="Notas",
                    cor_texto=Cor("#FFFFFF"),
                    familia_fonte="Helvetica",
                    tamanho_fonte=8.0,
                    negrito=True,
                    alinhamento="center",
                ))
                pagina.elementos.append(Elemento(
                    tipo=TipoElemento.FORMA,
                    tipo_forma=TipoForma.RETANGULO,
                    x=x + 0.5,
                    y=y + 8,
                    largura=col_w - 1,
                    altura=row_h - 10,
                    cor_fundo=self.cor_fundo_claro,
                    cor_borda=Cor("#E5E7EB"),
                    espessura_borda=0.1,
                    raio_borda=1.5,
                ))
            
            self.projeto.adicionar_pagina(pagina)
            paginas.append(pagina)
        
        return paginas
    
    def _gerar_planejamento_diario(
        self, data_inicio: date, data_fim: date
    ) -> list[Pagina]:
        """Gera páginas de planejamento diário."""
        paginas = []
        dias = self.motor_cal.gerar_dias_intervalo(data_inicio, data_fim)
        
        for dia in dias:
            # Pular fins de semana (opcional, mas reduz volume)
            pagina = Pagina(
                tipo=TipoPagina.PLANEJAMENTO_DIARIO,
                titulo=f"{dia.dia:02d}/{dia.mes:02d}/{dia.ano}",
                id_navegacao=f"dia-{dia.data.isoformat()}",
                data_referencia=dia.data.isoformat(),
                mes_referencia=dia.mes,
                ano_referencia=dia.ano,
                cor_fundo=self.cor_fundo,
                secao="planejamento_diario",
            )
            
            # Cabeçalho
            pagina.elementos.append(Elemento(
                tipo=TipoElemento.FORMA,
                tipo_forma=TipoForma.RETANGULO,
                x=0, y=0,
                largura=self.larg, altura=self.margem_topo + 10,
                cor_fundo=self.cor_primaria,
            ))
            
            pagina.elementos.append(Elemento(
                tipo=TipoElemento.TEXTO,
                x=self.margem_esq,
                y=self.margem_topo - 4,
                largura=self.area_larg,
                altura=10.0,
                texto=f"{dia.nome_dia_semana}, {dia.dia} de {dia.nome_mes} de {dia.ano}",
                cor_texto=Cor("#FFFFFF"),
                familia_fonte="Helvetica",
                tamanho_fonte=16.0,
                negrito=True,
            ))
            
            # Seções do dia
            secao_y = self.margem_topo + 16
            secao_h = (self.area_alt - 20) / 3
            
            # Tarefas
            self._adicionar_secao_dia(
                pagina, "Tarefas", secao_y,
                self.margem_esq, self.area_larg * 0.55, secao_h,
                com_checkbox=True,
            )
            
            # Compromissos
            self._adicionar_secao_dia(
                pagina, "Compromissos", secao_y,
                self.margem_esq + self.area_larg * 0.58, self.area_larg * 0.42,
                secao_h, com_horarios=True,
            )
            
            # Notas
            self._adicionar_secao_dia(
                pagina, "Notas", secao_y + secao_h + 3,
                self.margem_esq, self.area_larg * 0.55, secao_h,
            )
            
            # Prioridades
            self._adicionar_secao_dia(
                pagina, "Prioridades", secao_y + secao_h + 3,
                self.margem_esq + self.area_larg * 0.58, self.area_larg * 0.42,
                secao_h, com_checkbox=True, num_items=3,
            )
            
            # Gratidão / Reflexão
            self._adicionar_secao_dia(
                pagina, "Reflexão do dia", secao_y + 2 * secao_h + 6,
                self.margem_esq, self.area_larg, secao_h * 0.7,
            )
            
            self.projeto.adicionar_pagina(pagina)
            paginas.append(pagina)
        
        return paginas
    
    def _adicionar_secao_dia(
        self, pagina: Pagina, titulo: str,
        y: float, x: float, largura: float, altura: float,
        com_checkbox: bool = False, com_horarios: bool = False,
        num_items: int = 6,
    ) -> None:
        """Adiciona uma seção ao planejamento diário."""
        # Título da seção
        pagina.elementos.append(Elemento(
            tipo=TipoElemento.TEXTO,
            x=x, y=y,
            largura=largura, altura=6.0,
            texto=titulo,
            cor_texto=self.cor_primaria,
            familia_fonte="Helvetica",
            tamanho_fonte=10.0,
            negrito=True,
        ))
        
        # Área
        pagina.elementos.append(Elemento(
            tipo=TipoElemento.FORMA,
            tipo_forma=TipoForma.RETANGULO,
            x=x, y=y + 7,
            largura=largura, altura=altura - 8,
            cor_fundo=self.cor_fundo_claro,
            cor_borda=Cor("#E5E7EB"),
            espessura_borda=0.1,
            raio_borda=2.0,
        ))
        
        # Conteúdo
        item_y = y + 10
        item_h = min(6.0, (altura - 14) / num_items)
        
        for i in range(num_items):
            if item_y + item_h > y + altura - 2:
                break
            
            if com_checkbox:
                pagina.elementos.append(Elemento(
                    tipo=TipoElemento.CHECKBOX,
                    x=x + 3, y=item_y,
                    largura=largura - 6, altura=item_h,
                    cor_texto=self.cor_texto_claro,
                    espessura_borda=0.1,
                ))
            elif com_horarios:
                hora = 8 + i
                pagina.elementos.append(Elemento(
                    tipo=TipoElemento.TEXTO,
                    x=x + 3, y=item_y,
                    largura=10, altura=item_h,
                    texto=f"{hora:02d}:00",
                    cor_texto=self.cor_texto_claro,
                    familia_fonte="Helvetica",
                    tamanho_fonte=7.0,
                ))
                pagina.elementos.append(Elemento(
                    tipo=TipoElemento.FORMA,
                    tipo_forma=TipoForma.LINHA_HORIZONTAL,
                    x=x + 15, y=item_y + item_h - 1,
                    largura=largura - 20, altura=0.1,
                    cor_texto=Cor("#E5E7EB"),
                    espessura_borda=0.05,
                ))
            else:
                pagina.elementos.append(Elemento(
                    tipo=TipoElemento.FORMA,
                    tipo_forma=TipoForma.LINHA_HORIZONTAL,
                    x=x + 3, y=item_y + item_h - 1,
                    largura=largura - 6, altura=0.1,
                    cor_texto=Cor("#E5E7EB"),
                    espessura_borda=0.05,
                ))
            
            item_y += item_h
    
    def _gerar_rastreador_habitos(self, meses: list[MesCalendario]) -> list[Pagina]:
        """Gera páginas de rastreamento de hábitos."""
        paginas = []
        
        for mes_cal in meses:
            pagina = Pagina(
                tipo=TipoPagina.HABITOS,
                titulo=f"Hábitos — {mes_cal.nome} {mes_cal.ano}",
                id_navegacao=f"habitos-{mes_cal.ano}-{mes_cal.mes:02d}",
                mes_referencia=mes_cal.mes,
                ano_referencia=mes_cal.ano,
                cor_fundo=self.cor_fundo,
                secao="habitos",
            )
            
            # Título
            pagina.elementos.append(Elemento(
                tipo=TipoElemento.TEXTO,
                x=self.margem_esq, y=self.margem_topo,
                largura=self.area_larg, altura=10,
                texto=f"Rastreador de Hábitos — {mes_cal.nome} {mes_cal.ano}",
                cor_texto=self.cor_secundaria,
                familia_fonte="Helvetica",
                tamanho_fonte=16.0,
                negrito=True,
            ))
            
            # Tabela de hábitos
            num_habitos = 10
            col_habito_w = self.area_larg * 0.25
            col_dia_w = (self.area_larg - col_habito_w) / mes_cal.total_dias
            table_y = self.margem_topo + 18
            row_h = min(6.0, (self.area_alt - 25) / (num_habitos + 1))
            
            # Cabeçalho - números dos dias
            for d in range(mes_cal.total_dias):
                pagina.elementos.append(Elemento(
                    tipo=TipoElemento.TEXTO,
                    x=self.margem_esq + col_habito_w + d * col_dia_w,
                    y=table_y,
                    largura=col_dia_w, altura=row_h,
                    texto=str(d + 1),
                    cor_texto=self.cor_primaria,
                    familia_fonte="Helvetica",
                    tamanho_fonte=5.0,
                    alinhamento="center",
                ))
            
            # Linhas para hábitos
            for h in range(num_habitos):
                y = table_y + (h + 1) * row_h
                
                # Área do nome do hábito
                pagina.elementos.append(Elemento(
                    tipo=TipoElemento.FORMA,
                    tipo_forma=TipoForma.RETANGULO,
                    x=self.margem_esq, y=y,
                    largura=col_habito_w - 1, altura=row_h - 0.5,
                    cor_fundo=self.cor_fundo_claro if h % 2 == 0 else self.cor_fundo,
                    cor_borda=Cor("#E5E7EB"),
                    espessura_borda=0.05,
                    raio_borda=1.0,
                ))
                
                # Células para cada dia
                for d in range(mes_cal.total_dias):
                    pagina.elementos.append(Elemento(
                        tipo=TipoElemento.FORMA,
                        tipo_forma=TipoForma.RETANGULO,
                        x=self.margem_esq + col_habito_w + d * col_dia_w + 0.2,
                        y=y + 0.2,
                        largura=col_dia_w - 0.4, altura=row_h - 0.9,
                        cor_borda=Cor("#E5E7EB"),
                        espessura_borda=0.05,
                        raio_borda=0.5,
                    ))
            
            self.projeto.adicionar_pagina(pagina)
            paginas.append(pagina)
        
        return paginas
    
    def _gerar_planejamento_projetos(self) -> Pagina:
        """Gera página de planejamento de projetos."""
        pagina = Pagina(
            tipo=TipoPagina.PROJETOS,
            titulo="Planejamento de Projetos",
            id_navegacao="projetos",
            cor_fundo=self.cor_fundo,
            secao="projetos",
        )
        
        pagina.elementos.append(Elemento(
            tipo=TipoElemento.TEXTO,
            x=self.margem_esq, y=self.margem_topo,
            largura=self.area_larg, altura=10,
            texto="Planejamento de Projetos",
            cor_texto=self.cor_secundaria,
            familia_fonte="Helvetica",
            tamanho_fonte=18.0,
            negrito=True,
        ))
        
        # 4 blocos de projeto
        bloco_w = (self.area_larg - 4) / 2
        bloco_h = (self.area_alt - 30) / 2
        
        for i in range(4):
            col = i % 2
            row = i // 2
            x = self.margem_esq + col * (bloco_w + 4)
            y = self.margem_topo + 16 + row * (bloco_h + 4)
            
            pagina.elementos.append(Elemento(
                tipo=TipoElemento.FORMA,
                tipo_forma=TipoForma.RETANGULO,
                x=x, y=y, largura=bloco_w, altura=bloco_h,
                cor_fundo=self.cor_fundo_claro,
                cor_borda=Cor("#E5E7EB"),
                espessura_borda=0.1,
                raio_borda=3.0,
            ))
            
            pagina.elementos.append(Elemento(
                tipo=TipoElemento.TEXTO,
                x=x + 3, y=y + 3,
                largura=bloco_w - 6, altura=6,
                texto=f"Projeto {i+1}",
                cor_texto=self.cor_primaria,
                familia_fonte="Helvetica",
                tamanho_fonte=10.0,
                negrito=True,
            ))
            
            # Linhas para anotação
            line_y = y + 12
            while line_y < y + bloco_h - 3:
                pagina.elementos.append(Elemento(
                    tipo=TipoElemento.FORMA,
                    tipo_forma=TipoForma.LINHA_HORIZONTAL,
                    x=x + 3, y=line_y,
                    largura=bloco_w - 6, altura=0.1,
                    cor_texto=Cor("#E5E7EB"),
                    espessura_borda=0.05,
                ))
                line_y += 6
        
        self.projeto.adicionar_pagina(pagina)
        return pagina
    
    def _gerar_planejamento_estudos(self) -> Pagina:
        """Gera página de planejamento de estudos."""
        pagina = Pagina(
            tipo=TipoPagina.PLANEJAMENTO_ESTUDOS,
            titulo="Planejamento de Estudos",
            id_navegacao="estudos",
            cor_fundo=self.cor_fundo,
            secao="estudos",
        )
        
        pagina.elementos.append(Elemento(
            tipo=TipoElemento.TEXTO,
            x=self.margem_esq, y=self.margem_topo,
            largura=self.area_larg, altura=10,
            texto="Planejamento de Estudos",
            cor_texto=self.cor_secundaria,
            familia_fonte="Helvetica",
            tamanho_fonte=18.0,
            negrito=True,
        ))
        
        # Tabela de disciplinas
        pagina.elementos.append(Elemento(
            tipo=TipoElemento.TABELA,
            x=self.margem_esq, y=self.margem_topo + 16,
            largura=self.area_larg, altura=self.area_alt - 20,
            cor_texto=Cor("#E5E7EB"),
            dados_extras={"linhas": 12, "colunas": 5},
        ))
        
        # Cabeçalhos
        headers = ["Disciplina", "Meta", "Progresso", "Status", "Notas"]
        col_w = self.area_larg / 5
        for j, header in enumerate(headers):
            pagina.elementos.append(Elemento(
                tipo=TipoElemento.TEXTO,
                x=self.margem_esq + j * col_w + 2,
                y=self.margem_topo + 17,
                largura=col_w - 4, altura=5,
                texto=header,
                cor_texto=self.cor_primaria,
                familia_fonte="Helvetica",
                tamanho_fonte=8.0,
                negrito=True,
                alinhamento="center",
            ))
        
        self.projeto.adicionar_pagina(pagina)
        return pagina
    
    def _gerar_rastreador_leitura(self) -> Pagina:
        """Gera página de rastreamento de leitura."""
        pagina = Pagina(
            tipo=TipoPagina.LISTA_LEITURA,
            titulo="Rastreador de Leitura",
            id_navegacao="leitura",
            cor_fundo=self.cor_fundo,
            secao="leitura",
        )
        
        pagina.elementos.append(Elemento(
            tipo=TipoElemento.TEXTO,
            x=self.margem_esq, y=self.margem_topo,
            largura=self.area_larg, altura=10,
            texto="Rastreador de Leitura",
            cor_texto=self.cor_secundaria,
            familia_fonte="Helvetica",
            tamanho_fonte=18.0,
            negrito=True,
        ))
        
        # Grid de livros
        card_w = (self.area_larg - 6) / 3
        card_h = (self.area_alt - 25) / 4
        
        for i in range(12):
            col = i % 3
            row = i // 3
            x = self.margem_esq + col * (card_w + 3)
            y = self.margem_topo + 16 + row * (card_h + 2)
            
            pagina.elementos.append(Elemento(
                tipo=TipoElemento.FORMA,
                tipo_forma=TipoForma.RETANGULO,
                x=x, y=y, largura=card_w, altura=card_h,
                cor_fundo=self.cor_fundo_claro,
                cor_borda=Cor("#E5E7EB"),
                espessura_borda=0.1,
                raio_borda=2.0,
            ))
            
            # Labels
            for j, label in enumerate(["Título:", "Autor:", "Páginas:", "Nota:"]):
                pagina.elementos.append(Elemento(
                    tipo=TipoElemento.TEXTO,
                    x=x + 2, y=y + 3 + j * (card_h - 6) / 4,
                    largura=card_w - 4, altura=4,
                    texto=label,
                    cor_texto=self.cor_texto_claro,
                    familia_fonte="Helvetica",
                    tamanho_fonte=6.0,
                ))
        
        self.projeto.adicionar_pagina(pagina)
        return pagina
    
    def _gerar_revisoes_mensais(self, meses: list[MesCalendario]) -> list[Pagina]:
        """Gera páginas de revisão mensal."""
        paginas = []
        
        for mes_cal in meses:
            pagina = Pagina(
                tipo=TipoPagina.REVISOES,
                titulo=f"Revisão — {mes_cal.nome} {mes_cal.ano}",
                id_navegacao=f"revisao-{mes_cal.ano}-{mes_cal.mes:02d}",
                mes_referencia=mes_cal.mes,
                ano_referencia=mes_cal.ano,
                cor_fundo=self.cor_fundo,
                secao="revisoes_mensais",
            )
            
            pagina.elementos.append(Elemento(
                tipo=TipoElemento.TEXTO,
                x=self.margem_esq, y=self.margem_topo,
                largura=self.area_larg, altura=10,
                texto=f"Revisão — {mes_cal.nome} {mes_cal.ano}",
                cor_texto=self.cor_secundaria,
                familia_fonte="Helvetica",
                tamanho_fonte=18.0,
                negrito=True,
            ))
            
            secoes = [
                "O que deu certo", "O que precisa melhorar",
                "Metas para o próximo mês", "Gratidão"
            ]
            
            sec_h = (self.area_alt - 20) / len(secoes)
            for i, sec_titulo in enumerate(secoes):
                y = self.margem_topo + 16 + i * sec_h
                
                pagina.elementos.append(Elemento(
                    tipo=TipoElemento.TEXTO,
                    x=self.margem_esq, y=y,
                    largura=self.area_larg, altura=6,
                    texto=sec_titulo,
                    cor_texto=self.cor_primaria,
                    familia_fonte="Helvetica",
                    tamanho_fonte=10.0,
                    negrito=True,
                ))
                
                pagina.elementos.append(Elemento(
                    tipo=TipoElemento.FORMA,
                    tipo_forma=TipoForma.RETANGULO,
                    x=self.margem_esq, y=y + 7,
                    largura=self.area_larg, altura=sec_h - 10,
                    cor_fundo=self.cor_fundo_claro,
                    cor_borda=Cor("#E5E7EB"),
                    espessura_borda=0.1,
                    raio_borda=2.0,
                ))
            
            self.projeto.adicionar_pagina(pagina)
            paginas.append(pagina)
        
        return paginas
    
    def _gerar_paginas_livres(self, quantidade: int = 5) -> list[Pagina]:
        """Gera páginas livres pontilhadas."""
        paginas = []
        
        for i in range(quantidade):
            pagina = Pagina(
                tipo=TipoPagina.PAGINA_PONTILHADA,
                titulo=f"Notas {i+1}",
                id_navegacao=f"notas-{i+1}",
                cor_fundo=self.cor_fundo,
                secao="paginas_livres",
            )
            
            # Grid de pontos
            espacamento = 5.0  # 5mm
            x = self.margem_esq
            while x <= self.larg - self.margem_dir:
                y = self.margem_topo
                while y <= self.alt - self.margem_base:
                    pagina.elementos.append(Elemento(
                        tipo=TipoElemento.FORMA,
                        tipo_forma=TipoForma.CIRCULO,
                        x=x, y=y,
                        largura=0.4, altura=0.4,
                        cor_fundo=Cor("#D1D5DB"),
                    ))
                    y += espacamento
                x += espacamento
            
            self.projeto.adicionar_pagina(pagina)
            paginas.append(pagina)
        
        return paginas
    
    def _preencher_indice(self) -> None:
        """Preenche o índice com links para as seções."""
        indice = self.projeto.obter_pagina_por_navegacao("indice")
        if not indice:
            return
        
        # Coletar entradas únicas do índice
        entradas = []
        secoes_vistas = set()
        
        for pagina in self.projeto.paginas:
            if pagina.id_navegacao == "indice" or pagina.id_navegacao == "capa":
                continue
            
            # Agrupar por seção para não repetir
            chave = pagina.secao or pagina.id_navegacao
            if pagina.tipo in (TipoPagina.PLANEJAMENTO_MENSAL,):
                # Mostrar cada mês
                entradas.append((pagina.titulo, pagina.id_navegacao))
            elif pagina.tipo in (
                TipoPagina.PLANEJAMENTO_SEMANAL, TipoPagina.PLANEJAMENTO_DIARIO,
                TipoPagina.PAGINA_PONTILHADA, TipoPagina.HABITOS, TipoPagina.REVISOES,
            ):
                # Agrupar por seção
                if chave not in secoes_vistas:
                    secoes_vistas.add(chave)
                    # Encontrar primeiro da seção
                    titulo_secao = {
                        "planejamento_semanal": "Planejamento Semanal",
                        "planejamento_diario": "Planejamento Diário",
                        "paginas_livres": "Páginas Livres",
                        "habitos": "Rastreador de Hábitos",
                        "revisoes_mensais": "Revisões Mensais",
                    }.get(chave, pagina.titulo)
                    entradas.append((titulo_secao, pagina.id_navegacao))
            else:
                entradas.append((pagina.titulo, pagina.id_navegacao))
        
        # Renderizar entradas no índice
        y = self.margem_topo + 20
        entrada_h = 7.0
        
        for i, (titulo, id_nav) in enumerate(entradas):
            if y + entrada_h > self.alt - self.margem_base:
                break
            
            # Número
            indice.elementos.append(Elemento(
                tipo=TipoElemento.TEXTO,
                x=self.margem_esq,
                y=y,
                largura=8, altura=entrada_h,
                texto=f"{i+1}.",
                cor_texto=self.cor_primaria,
                familia_fonte="Helvetica",
                tamanho_fonte=9.0,
                negrito=True,
                alinhamento="right",
            ))
            
            # Título clicável
            elem_titulo = Elemento(
                tipo=TipoElemento.TEXTO,
                x=self.margem_esq + 10,
                y=y,
                largura=self.area_larg - 10, altura=entrada_h,
                texto=titulo,
                cor_texto=self.cor_texto,
                familia_fonte="Helvetica",
                tamanho_fonte=9.0,
                destino_link=id_nav,
            )
            indice.elementos.append(elem_titulo)
            
            # Criar hyperlink
            self.motor_nav.criar_link_indice(
                indice,
                self.projeto.obter_pagina_por_navegacao(id_nav) or Pagina(id_navegacao=id_nav),
                self.margem_esq + 10, y,
                self.area_larg - 10, entrada_h,
            )
            
            # Linha pontilhada
            indice.elementos.append(Elemento(
                tipo=TipoElemento.FORMA,
                tipo_forma=TipoForma.LINHA_HORIZONTAL,
                x=self.margem_esq,
                y=y + entrada_h - 1,
                largura=self.area_larg,
                altura=0.1,
                cor_texto=Cor("#E5E7EB"),
                espessura_borda=0.05,
            ))
            
            y += entrada_h
    
    def _criar_navegacao_global(self, meses: list[MesCalendario]) -> None:
        """Cria navegação global entre seções e meses."""
        # Navegação entre calendários mensais
        paginas_mensais = [
            p for p in self.projeto.paginas
            if p.tipo == TipoPagina.PLANEJAMENTO_MENSAL
        ]
        
        indice = self.projeto.obter_pagina_por_navegacao("indice")
        
        if paginas_mensais:
            # Navegação sequencial entre meses
            self.motor_nav.criar_navegacao_sequencial(
                paginas_mensais,
                x_anterior=self.margem_esq,
                y_nav=self.alt - self.margem_base - 6,
                x_proximo=self.larg - self.margem_dir - 15,
                largura_botao=15.0,
                altura_botao=6.0,
                pagina_indice=indice,
                x_indice=self.larg / 2 - 10,
                largura_indice=20.0,
            )
        
        # Navegação entre semanas
        paginas_semanais = [
            p for p in self.projeto.paginas
            if p.tipo == TipoPagina.PLANEJAMENTO_SEMANAL
        ]
        
        if paginas_semanais:
            self.motor_nav.criar_navegacao_sequencial(
                paginas_semanais,
                x_anterior=self.margem_esq,
                y_nav=self.alt - self.margem_base - 6,
                x_proximo=self.larg - self.margem_dir - 15,
                largura_botao=15.0,
                altura_botao=6.0,
                pagina_indice=indice,
                x_indice=self.larg / 2 - 10,
                largura_indice=20.0,
            )
        
        # Navegação entre dias
        paginas_diarias = [
            p for p in self.projeto.paginas
            if p.tipo == TipoPagina.PLANEJAMENTO_DIARIO
        ]
        
        if paginas_diarias:
            self.motor_nav.criar_navegacao_sequencial(
                paginas_diarias,
                x_anterior=self.margem_esq,
                y_nav=self.alt - self.margem_base - 6,
                x_proximo=self.larg - self.margem_dir - 15,
                largura_botao=15.0,
                altura_botao=6.0,
                pagina_indice=indice,
                x_indice=self.larg / 2 - 10,
                largura_indice=20.0,
            )
        
        # Links entre mês → primeira semana do mês
        for pagina_mes in paginas_mensais:
            mes = pagina_mes.mes_referencia
            ano = pagina_mes.ano_referencia
            # Encontrar primeira semana deste mês
            for ps in paginas_semanais:
                semana_dias = None
                # Verificar se a semana pertence a este mês
                id_nav = ps.id_navegacao  # semana-YYYY-WNN
                if ps.ano_referencia == ano:
                    # Link do mês para a primeira semana
                    self.motor_nav.criar_link_navegacao(
                        pagina_mes, ps,
                        self.larg - self.margem_dir - 30,
                        self.margem_topo,
                        30.0, 8.0,
                        tipo="navegacao",
                    )
                    break
