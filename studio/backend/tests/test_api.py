"""Testes automatizados da API REST FastAPI do PACCE Planner Studio."""

import os
import sys
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "src"))

from pacce.api.app import app

client = TestClient(app)


def test_health_check():
    """Valida o endpoint de saúde."""
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "ok"
    assert data["app"] == "PACCE Planner Studio"


def test_fluxo_api_projeto_e_exportacao():
    """Valida o ciclo completo via API:
    1. Criar projeto via POST
    2. Listar projetos
    3. Obter projeto por ID
    4. Validar hyperlinks
    5. Exportar PDF
    6. Duplicar projeto
    7. Excluir projetos
    """
    # 1. Criar projeto
    payload = {
        "nome": "Planner Teste API",
        "descricao": "Criado pelo teste automatizado",
        "formato": "a4_horizontal",
        "idioma": "pt-BR",
        "primeiro_dia_semana": 0,
        "incluir_feriados": True,
        "data_inicio": "2026-10-01",
        "data_fim": "2026-10-31",
        "cor_primaria": "#535DEB",
        "cor_secundaria": "#172B70",
        "cor_fundo_claro": "#F0EEFF",
        "secoes": ["capa", "indice", "calendario_mensal"],
    }
    res_criar = client.post("/api/projetos/criar", json=payload)
    assert res_criar.status_code == 200
    projeto = res_criar.json()
    projeto_id = projeto["id"]
    assert projeto["nome"] == "Planner Teste API"
    assert len(projeto["paginas"]) >= 3

    # 2. Listar
    res_listar = client.get("/api/projetos")
    assert res_listar.status_code == 200
    projetos = res_listar.json()
    assert any(p["id"] == projeto_id for p in projetos)

    # 3. Obter
    res_obter = client.get(f"/api/projetos/{projeto_id}")
    assert res_obter.status_code == 200
    assert res_obter.json()["id"] == projeto_id

    # 4. Validar Hyperlinks
    res_val = client.get(f"/api/projetos/{projeto_id}/validar")
    assert res_val.status_code == 200
    val_data = res_val.json()
    assert val_data["aprovado"] is True
    assert val_data["total_hyperlinks"] > 0
    assert val_data["total_invalidos"] == 0

    # 5. Exportar PDF
    res_pdf = client.get(f"/api/projetos/{projeto_id}/exportar-pdf")
    assert res_pdf.status_code == 200
    assert res_pdf.headers["content-type"] == "application/pdf"
    assert len(res_pdf.content) > 1000

    # 6. Duplicar
    res_dup = client.post(f"/api/projetos/{projeto_id}/duplicar")
    assert res_dup.status_code == 200
    copia_id = res_dup.json()["id"]
    assert copia_id != projeto_id

    # 7. Excluir
    res_del1 = client.delete(f"/api/projetos/{projeto_id}")
    assert res_del1.status_code == 200
    res_del2 = client.delete(f"/api/projetos/{copia_id}")
    assert res_del2.status_code == 200


def test_download_pacote_adesivos():
    """Valida o endpoint de download do pacote de adesivos."""
    res = client.get("/api/adesivos/pacote-padrao")
    assert res.status_code == 200
    assert res.headers["content-type"] == "application/zip"
    assert len(res.content) > 1000
