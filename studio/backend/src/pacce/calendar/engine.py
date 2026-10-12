"""Motor de calendário inteligente para PACCE Planner Studio.

Gera calendários corretos para qualquer ano, com suporte a:
- Português brasileiro
- Primeiro dia da semana configurável
- Anos bissextos
- Feriados brasileiros
- Intervalos personalizados
- Semanas que atravessam meses
"""

from __future__ import annotations

import calendar
from dataclasses import dataclass, field
from datetime import date, timedelta
from enum import Enum
from typing import Optional


class DiaDaSemana(Enum):
    """Dias da semana com início configurável."""
    SEGUNDA = 0
    TERCA = 1
    QUARTA = 2
    QUINTA = 3
    SEXTA = 4
    SABADO = 5
    DOMINGO = 6


# Nomes em português brasileiro
MESES_PTBR = [
    "", "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
]

MESES_PTBR_ABREV = [
    "", "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
    "Jul", "Ago", "Set", "Out", "Nov", "Dez"
]

DIAS_SEMANA_PTBR = [
    "Segunda-feira", "Terça-feira", "Quarta-feira",
    "Quinta-feira", "Sexta-feira", "Sábado", "Domingo"
]

DIAS_SEMANA_PTBR_ABREV = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"]

DIAS_SEMANA_PTBR_CURTO = ["S", "T", "Q", "Q", "S", "S", "D"]


@dataclass
class Feriado:
    """Representa um feriado."""
    data: date
    nome: str
    tipo: str = "nacional"  # nacional, estadual, municipal


def obter_feriados_nacionais(ano: int) -> list[Feriado]:
    """Retorna os feriados nacionais brasileiros para um dado ano.
    
    Inclui feriados fixos e feriados móveis baseados na Páscoa.
    """
    feriados = [
        Feriado(date(ano, 1, 1), "Confraternização Universal"),
        Feriado(date(ano, 4, 21), "Tiradentes"),
        Feriado(date(ano, 5, 1), "Dia do Trabalho"),
        Feriado(date(ano, 9, 7), "Independência do Brasil"),
        Feriado(date(ano, 10, 12), "Nossa Senhora Aparecida"),
        Feriado(date(ano, 11, 2), "Finados"),
        Feriado(date(ano, 11, 15), "Proclamação da República"),
        Feriado(date(ano, 12, 25), "Natal"),
    ]
    
    # Feriados móveis baseados na Páscoa
    pascoa = _calcular_pascoa(ano)
    feriados.extend([
        Feriado(pascoa - timedelta(days=47), "Carnaval"),
        Feriado(pascoa - timedelta(days=46), "Carnaval"),
        Feriado(pascoa - timedelta(days=2), "Sexta-feira Santa"),
        Feriado(pascoa, "Páscoa"),
        Feriado(pascoa + timedelta(days=60), "Corpus Christi"),
    ])
    
    feriados.sort(key=lambda f: f.data)
    return feriados


def _calcular_pascoa(ano: int) -> date:
    """Calcula a data da Páscoa usando o algoritmo de Meeus/Jones/Butcher."""
    a = ano % 19
    b = ano // 100
    c = ano % 100
    d = b // 4
    e = b % 4
    f = (b + 8) // 25
    g = (b - f + 1) // 3
    h = (19 * a + b - d - g + 15) % 30
    i = c // 4
    k = c % 4
    l = (32 + 2 * e + 2 * i - h - k) % 7
    m = (a + 11 * h + 22 * l) // 451
    mes = (h + l - 7 * m + 114) // 31
    dia = ((h + l - 7 * m + 114) % 31) + 1
    return date(ano, mes, dia)


@dataclass
class DiaCalendario:
    """Representa um dia no calendário com metadados."""
    data: date
    dia: int
    mes: int
    ano: int
    dia_semana: int  # 0=segunda, 6=domingo
    nome_dia_semana: str
    nome_dia_semana_abrev: str
    nome_mes: str
    nome_mes_abrev: str
    pertence_ao_mes: bool = True  # False para dias de preenchimento
    eh_feriado: bool = False
    nome_feriado: str = ""
    eh_fim_semana: bool = False
    semana_do_ano: int = 0
    dia_do_ano: int = 0


@dataclass
class SemanaCalendario:
    """Representa uma semana completa no calendário."""
    numero_semana: int  # ISO week number
    ano_semana: int  # ISO year
    dias: list[DiaCalendario]
    data_inicio: date
    data_fim: date
    
    @property
    def id_pagina(self) -> str:
        """Identificador estável para a página desta semana."""
        return f"semana-{self.ano_semana}-W{self.numero_semana:02d}"
    
    @property
    def label(self) -> str:
        """Label legível para exibição."""
        inicio = self.data_inicio
        fim = self.data_fim
        if inicio.month == fim.month:
            return f"{inicio.day}–{fim.day} de {MESES_PTBR[inicio.month]}"
        return (f"{inicio.day} de {MESES_PTBR_ABREV[inicio.month]} – "
                f"{fim.day} de {MESES_PTBR_ABREV[fim.month]}")


@dataclass
class MesCalendario:
    """Representa um mês completo."""
    mes: int
    ano: int
    nome: str
    nome_abrev: str
    dias: list[DiaCalendario]
    semanas: list[SemanaCalendario]
    total_dias: int
    primeiro_dia_semana: int  # dia da semana do dia 1
    
    @property
    def id_pagina(self) -> str:
        """Identificador estável para a página deste mês."""
        return f"mes-{self.ano}-{self.mes:02d}"
    
    @property
    def label(self) -> str:
        return f"{self.nome} {self.ano}"


@dataclass
class AnoCalendario:
    """Representa um ano completo."""
    ano: int
    meses: list[MesCalendario]
    eh_bissexto: bool
    total_dias: int


class MotorCalendario:
    """Motor de calendário inteligente.
    
    Gera calendários corretos com suporte a personalização
    de idioma, primeiro dia da semana e feriados.
    """
    
    def __init__(
        self,
        primeiro_dia_semana: DiaDaSemana = DiaDaSemana.SEGUNDA,
        incluir_feriados: bool = True,
        feriados_extras: list[Feriado] | None = None,
    ):
        self.primeiro_dia_semana = primeiro_dia_semana
        self.incluir_feriados = incluir_feriados
        self.feriados_extras = feriados_extras or []
        self._cache_feriados: dict[int, dict[date, Feriado]] = {}
    
    def _obter_feriados_ano(self, ano: int) -> dict[date, Feriado]:
        """Obtém mapa de feriados para um ano (com cache)."""
        if ano not in self._cache_feriados:
            feriados = {}
            if self.incluir_feriados:
                for f in obter_feriados_nacionais(ano):
                    feriados[f.data] = f
            for f in self.feriados_extras:
                if f.data.year == ano:
                    feriados[f.data] = f
            self._cache_feriados[ano] = feriados
        return self._cache_feriados[ano]
    
    def _criar_dia(self, dt: date, pertence_ao_mes: bool = True) -> DiaCalendario:
        """Cria um DiaCalendario a partir de uma date."""
        feriados = self._obter_feriados_ano(dt.year)
        feriado = feriados.get(dt)
        dia_semana = dt.weekday()  # 0=segunda
        
        return DiaCalendario(
            data=dt,
            dia=dt.day,
            mes=dt.month,
            ano=dt.year,
            dia_semana=dia_semana,
            nome_dia_semana=DIAS_SEMANA_PTBR[dia_semana],
            nome_dia_semana_abrev=DIAS_SEMANA_PTBR_ABREV[dia_semana],
            nome_mes=MESES_PTBR[dt.month],
            nome_mes_abrev=MESES_PTBR_ABREV[dt.month],
            pertence_ao_mes=pertence_ao_mes,
            eh_feriado=feriado is not None,
            nome_feriado=feriado.nome if feriado else "",
            eh_fim_semana=dia_semana >= 5,
            semana_do_ano=dt.isocalendar()[1],
            dia_do_ano=dt.timetuple().tm_yday,
        )
    
    def gerar_mes(self, ano: int, mes: int) -> MesCalendario:
        """Gera um MesCalendario completo."""
        total_dias = calendar.monthrange(ano, mes)[1]
        primeiro_dia = date(ano, mes, 1)
        ultimo_dia = date(ano, mes, total_dias)
        
        # Dias do mês
        dias = []
        for d in range(1, total_dias + 1):
            dt = date(ano, mes, d)
            dias.append(self._criar_dia(dt))
        
        # Gerar semanas (com dias de preenchimento de meses vizinhos)
        semanas = self._gerar_semanas_mes(ano, mes)
        
        return MesCalendario(
            mes=mes,
            ano=ano,
            nome=MESES_PTBR[mes],
            nome_abrev=MESES_PTBR_ABREV[mes],
            dias=dias,
            semanas=semanas,
            total_dias=total_dias,
            primeiro_dia_semana=primeiro_dia.weekday(),
        )
    
    def _gerar_semanas_mes(self, ano: int, mes: int) -> list[SemanaCalendario]:
        """Gera as semanas de um mês com preenchimento."""
        total_dias = calendar.monthrange(ano, mes)[1]
        primeiro_dia = date(ano, mes, 1)
        ultimo_dia = date(ano, mes, total_dias)
        
        # Encontrar o início da primeira semana
        offset = (primeiro_dia.weekday() - self.primeiro_dia_semana.value) % 7
        inicio_semana = primeiro_dia - timedelta(days=offset)
        
        semanas = []
        atual = inicio_semana
        
        while atual <= ultimo_dia:
            dias_semana = []
            for i in range(7):
                dt = atual + timedelta(days=i)
                pertence = dt.month == mes and dt.year == ano
                dias_semana.append(self._criar_dia(dt, pertence_ao_mes=pertence))
            
            iso_year, iso_week, _ = atual.isocalendar()
            semanas.append(SemanaCalendario(
                numero_semana=iso_week,
                ano_semana=iso_year,
                dias=dias_semana,
                data_inicio=atual,
                data_fim=atual + timedelta(days=6),
            ))
            
            atual += timedelta(days=7)
        
        return semanas
    
    def gerar_ano(self, ano: int) -> AnoCalendario:
        """Gera um AnoCalendario completo."""
        eh_bissexto = calendar.isleap(ano)
        meses = [self.gerar_mes(ano, m) for m in range(1, 13)]
        total_dias = 366 if eh_bissexto else 365
        
        return AnoCalendario(
            ano=ano,
            meses=meses,
            eh_bissexto=eh_bissexto,
            total_dias=total_dias,
        )
    
    def gerar_intervalo(
        self, data_inicio: date, data_fim: date
    ) -> list[MesCalendario]:
        """Gera calendários para um intervalo personalizado de datas."""
        if data_fim < data_inicio:
            raise ValueError("Data fim deve ser posterior à data início")
        
        meses = []
        atual_ano = data_inicio.year
        atual_mes = data_inicio.month
        
        while True:
            mes_cal = self.gerar_mes(atual_ano, atual_mes)
            meses.append(mes_cal)
            
            if atual_ano == data_fim.year and atual_mes == data_fim.month:
                break
            
            atual_mes += 1
            if atual_mes > 12:
                atual_mes = 1
                atual_ano += 1
        
        return meses
    
    def gerar_dias_intervalo(
        self, data_inicio: date, data_fim: date
    ) -> list[DiaCalendario]:
        """Gera lista de dias para um intervalo."""
        if data_fim < data_inicio:
            raise ValueError("Data fim deve ser posterior à data início")
        
        dias = []
        atual = data_inicio
        while atual <= data_fim:
            dias.append(self._criar_dia(atual))
            atual += timedelta(days=1)
        
        return dias
    
    def gerar_semanas_intervalo(
        self, data_inicio: date, data_fim: date
    ) -> list[SemanaCalendario]:
        """Gera lista de semanas para um intervalo."""
        # Alinhar ao início da primeira semana
        offset = (data_inicio.weekday() - self.primeiro_dia_semana.value) % 7
        inicio = data_inicio - timedelta(days=offset)
        
        semanas = []
        atual = inicio
        
        while atual <= data_fim:
            dias = []
            for i in range(7):
                dt = atual + timedelta(days=i)
                pertence = data_inicio <= dt <= data_fim
                dias.append(self._criar_dia(dt, pertence_ao_mes=pertence))
            
            iso_year, iso_week, _ = atual.isocalendar()
            semanas.append(SemanaCalendario(
                numero_semana=iso_week,
                ano_semana=iso_year,
                dias=dias,
                data_inicio=atual,
                data_fim=atual + timedelta(days=6),
            ))
            
            atual += timedelta(days=7)
        
        return semanas
    
    def obter_dias_semana_ordenados(self) -> list[str]:
        """Retorna os nomes abreviados dos dias na ordem configurada."""
        inicio = self.primeiro_dia_semana.value
        indices = [(inicio + i) % 7 for i in range(7)]
        return [DIAS_SEMANA_PTBR_ABREV[i] for i in indices]
    
    def obter_dias_semana_curtos_ordenados(self) -> list[str]:
        """Retorna as iniciais dos dias na ordem configurada."""
        inicio = self.primeiro_dia_semana.value
        indices = [(inicio + i) % 7 for i in range(7)]
        return [DIAS_SEMANA_PTBR_CURTO[i] for i in indices]
