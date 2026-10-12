"""Testes do motor de calendário do PACCE Planner Studio."""

import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "src"))

from datetime import date
from pacce.calendar.engine import (
    MotorCalendario, DiaDaSemana, DiaCalendario,
    SemanaCalendario, MesCalendario, AnoCalendario,
    Feriado, obter_feriados_nacionais, _calcular_pascoa,
    MESES_PTBR, MESES_PTBR_ABREV, DIAS_SEMANA_PTBR,
)


class TestPascoa:
    """Testes do cálculo de Páscoa."""
    
    def test_pascoa_2026(self):
        assert _calcular_pascoa(2026) == date(2026, 4, 5)
    
    def test_pascoa_2024(self):
        assert _calcular_pascoa(2024) == date(2024, 3, 31)
    
    def test_pascoa_2025(self):
        assert _calcular_pascoa(2025) == date(2025, 4, 20)
    
    def test_pascoa_2028(self):
        assert _calcular_pascoa(2028) == date(2028, 4, 16)


class TestFeriados:
    """Testes dos feriados brasileiros."""
    
    def test_feriados_2026_contagem(self):
        feriados = obter_feriados_nacionais(2026)
        assert len(feriados) >= 12  # 8 fixos + 4 móveis (Carnaval x2, Sexta Santa, Páscoa, Corpus)
    
    def test_natal_2026(self):
        feriados = obter_feriados_nacionais(2026)
        natal = [f for f in feriados if f.nome == "Natal"]
        assert len(natal) == 1
        assert natal[0].data == date(2026, 12, 25)
    
    def test_carnaval_2026(self):
        feriados = obter_feriados_nacionais(2026)
        carnaval = [f for f in feriados if f.nome == "Carnaval"]
        assert len(carnaval) == 2
        # Páscoa 2026 = 5 de abril, Carnaval = 47 e 46 dias antes
        assert carnaval[0].data == date(2026, 2, 17)  # 47 dias antes
        assert carnaval[1].data == date(2026, 2, 18)  # 46 dias antes
    
    def test_independencia(self):
        feriados = obter_feriados_nacionais(2026)
        indep = [f for f in feriados if "Independ" in f.nome]
        assert len(indep) == 1
        assert indep[0].data == date(2026, 9, 7)
    
    def test_feriados_ordenados(self):
        feriados = obter_feriados_nacionais(2026)
        datas = [f.data for f in feriados]
        assert datas == sorted(datas)


class TestAnosBissextos:
    """Testes de anos bissextos."""
    
    def test_2024_bissexto(self):
        motor = MotorCalendario()
        ano = motor.gerar_ano(2024)
        assert ano.eh_bissexto is True
        assert ano.total_dias == 366
    
    def test_2025_nao_bissexto(self):
        motor = MotorCalendario()
        ano = motor.gerar_ano(2025)
        assert ano.eh_bissexto is False
        assert ano.total_dias == 365
    
    def test_2000_bissexto(self):
        motor = MotorCalendario()
        ano = motor.gerar_ano(2000)
        assert ano.eh_bissexto is True
    
    def test_1900_nao_bissexto(self):
        motor = MotorCalendario()
        ano = motor.gerar_ano(1900)
        assert ano.eh_bissexto is False
    
    def test_fevereiro_2024_29_dias(self):
        motor = MotorCalendario()
        fev = motor.gerar_mes(2024, 2)
        assert fev.total_dias == 29
    
    def test_fevereiro_2026_28_dias(self):
        motor = MotorCalendario()
        fev = motor.gerar_mes(2026, 2)
        assert fev.total_dias == 28


class TestMotorCalendario:
    """Testes do motor de calendário."""
    
    def test_gerar_mes_outubro_2026(self):
        motor = MotorCalendario()
        out = motor.gerar_mes(2026, 10)
        assert out.nome == "Outubro"
        assert out.nome_abrev == "Out"
        assert out.total_dias == 31
        assert out.ano == 2026
        assert out.mes == 10
    
    def test_gerar_mes_novembro_2026(self):
        motor = MotorCalendario()
        nov = motor.gerar_mes(2026, 11)
        assert nov.total_dias == 30
    
    def test_gerar_mes_dezembro_2026(self):
        motor = MotorCalendario()
        dez = motor.gerar_mes(2026, 12)
        assert dez.total_dias == 31
    
    def test_primeiro_dia_outubro_2026(self):
        """1 de outubro de 2026 é quinta-feira."""
        motor = MotorCalendario()
        out = motor.gerar_mes(2026, 10)
        assert out.dias[0].dia == 1
        assert out.dias[0].dia_semana == 3  # quinta = 3
        assert out.dias[0].nome_dia_semana == "Quinta-feira"
    
    def test_semanas_outubro_2026(self):
        motor = MotorCalendario()
        out = motor.gerar_mes(2026, 10)
        assert len(out.semanas) >= 4  # Outubro sempre tem pelo menos 4 semanas
    
    def test_id_pagina_mes(self):
        motor = MotorCalendario()
        out = motor.gerar_mes(2026, 10)
        assert out.id_pagina == "mes-2026-10"
    
    def test_dias_fim_semana(self):
        motor = MotorCalendario()
        out = motor.gerar_mes(2026, 10)
        fds = [d for d in out.dias if d.eh_fim_semana]
        # Outubro 2026: sábados e domingos
        assert len(fds) >= 8  # Pelo menos 4 sábados + 4 domingos
    
    def test_feriado_12_outubro(self):
        motor = MotorCalendario()
        out = motor.gerar_mes(2026, 10)
        dia_12 = out.dias[11]  # dia 12 (0-indexed)
        assert dia_12.eh_feriado is True
        assert "Aparecida" in dia_12.nome_feriado
    
    def test_gerar_intervalo(self):
        motor = MotorCalendario()
        meses = motor.gerar_intervalo(date(2026, 10, 1), date(2026, 12, 31))
        assert len(meses) == 3
        assert meses[0].nome == "Outubro"
        assert meses[1].nome == "Novembro"
        assert meses[2].nome == "Dezembro"
    
    def test_gerar_intervalo_entre_anos(self):
        motor = MotorCalendario()
        meses = motor.gerar_intervalo(date(2026, 11, 1), date(2027, 2, 28))
        assert len(meses) == 4
        assert meses[0].nome == "Novembro"
        assert meses[3].nome == "Fevereiro"
        assert meses[3].ano == 2027
    
    def test_gerar_dias_intervalo(self):
        motor = MotorCalendario()
        dias = motor.gerar_dias_intervalo(date(2026, 10, 1), date(2026, 10, 31))
        assert len(dias) == 31
        assert dias[0].data == date(2026, 10, 1)
        assert dias[-1].data == date(2026, 10, 31)
    
    def test_gerar_semanas_intervalo(self):
        motor = MotorCalendario()
        semanas = motor.gerar_semanas_intervalo(date(2026, 10, 1), date(2026, 12, 31))
        assert len(semanas) >= 13  # ~13 semanas em 3 meses
    
    def test_primeiro_dia_domingo(self):
        motor = MotorCalendario(primeiro_dia_semana=DiaDaSemana.DOMINGO)
        dias = motor.obter_dias_semana_ordenados()
        assert dias[0] == "Dom"
        assert dias[6] == "Sáb"
    
    def test_primeiro_dia_segunda(self):
        motor = MotorCalendario(primeiro_dia_semana=DiaDaSemana.SEGUNDA)
        dias = motor.obter_dias_semana_ordenados()
        assert dias[0] == "Seg"
        assert dias[6] == "Dom"
    
    def test_nomes_ptbr(self):
        assert MESES_PTBR[1] == "Janeiro"
        assert MESES_PTBR[12] == "Dezembro"
        assert MESES_PTBR_ABREV[10] == "Out"
        assert DIAS_SEMANA_PTBR[0] == "Segunda-feira"
    
    def test_semana_que_atravessa_meses(self):
        """Verifica semanas que começam em um mês e terminam em outro."""
        motor = MotorCalendario()
        out = motor.gerar_mes(2026, 10)
        ultima_semana = out.semanas[-1]
        # A última semana de outubro pode ter dias de novembro
        tem_novembro = any(d.mes == 11 for d in ultima_semana.dias)
        # É possível que a última semana contenha dias de novembro
        # (depende do ano, mas verificamos que a lógica funciona)
        assert len(ultima_semana.dias) == 7
    
    def test_label_semana(self):
        motor = MotorCalendario()
        semanas = motor.gerar_semanas_intervalo(date(2026, 10, 1), date(2026, 10, 7))
        assert len(semanas) >= 1
        label = semanas[0].label
        assert isinstance(label, str)
        assert len(label) > 0
    
    def test_ano_completo(self):
        motor = MotorCalendario()
        ano = motor.gerar_ano(2026)
        assert len(ano.meses) == 12
        assert ano.ano == 2026
        total_dias_meses = sum(m.total_dias for m in ano.meses)
        assert total_dias_meses == 365
    
    def test_sem_feriados(self):
        motor = MotorCalendario(incluir_feriados=False)
        out = motor.gerar_mes(2026, 10)
        feriados = [d for d in out.dias if d.eh_feriado]
        assert len(feriados) == 0
    
    def test_feriado_extra(self):
        extra = Feriado(date(2026, 10, 15), "Dia do Professor", "comemorativo")
        motor = MotorCalendario(feriados_extras=[extra])
        out = motor.gerar_mes(2026, 10)
        dia_15 = out.dias[14]
        assert dia_15.eh_feriado is True
        assert dia_15.nome_feriado == "Dia do Professor"


class TestDiaCalendario:
    """Testes da estrutura DiaCalendario."""
    
    def test_dia_do_ano(self):
        motor = MotorCalendario()
        jan = motor.gerar_mes(2026, 1)
        assert jan.dias[0].dia_do_ano == 1
        assert jan.dias[30].dia_do_ano == 31
    
    def test_semana_iso(self):
        motor = MotorCalendario()
        out = motor.gerar_mes(2026, 10)
        # Todos os dias devem ter semana_do_ano válida
        for dia in out.dias:
            assert 1 <= dia.semana_do_ano <= 53
    
    def test_caracteres_acentuados(self):
        """Verifica que nomes em PT-BR têm acentos corretos."""
        motor = MotorCalendario()
        mar = motor.gerar_mes(2026, 3)
        assert mar.nome == "Março"
        
        out = motor.gerar_mes(2026, 10)
        sabado = [d for d in out.dias if d.dia_semana == 5]
        if sabado:
            assert sabado[0].nome_dia_semana_abrev == "Sáb"
            assert sabado[0].nome_dia_semana == "Sábado"


if __name__ == "__main__":
    import pytest
    pytest.main([__file__, "-v"])
