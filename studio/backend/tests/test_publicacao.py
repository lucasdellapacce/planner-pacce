from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from tempfile import TemporaryDirectory

import pytest
from fastapi.testclient import TestClient

from pacce.api.app import app, FRONTEND_DIST, gerenciador
from pacce.models.planner import ProjetoPlanner
from pacce.utils.persistence import GerenciadorProjetos


def test_interface_e_api_na_mesma_porta():
    if not (FRONTEND_DIST / 'index.html').is_file():
        pytest.skip('Compile a interface antes de verificar a publicação')
    with TestClient(app) as client:
        assert client.get('/').status_code == 200
        assert 'text/html' in client.get('/').headers['content-type']
        assert client.get('/api/health').json()['status'] == 'ok'
        assert client.get('/src/main.tsx').status_code == 404


@pytest.mark.parametrize('project_id', ['..', '../outside', 'C:\\outside', 'a/b', 'a\\b', ''])
def test_id_nao_pode_escapar_da_pasta(project_id):
    with TemporaryDirectory() as directory:
        manager = GerenciadorProjetos(directory)
        with pytest.raises(ValueError):
            manager.excluir(project_id)
        assert Path(directory).is_dir()


def test_exportar_nome_unicode(monkeypatch):
    projeto = ProjetoPlanner(nome='Planejamento — Ação 📅')
    monkeypatch.setattr(gerenciador, 'carregar', lambda _: projeto)
    with TestClient(app) as client:
        response = client.get('/api/projetos/test/exportar-pdf')
        assert response.status_code == 200
        assert "filename*=UTF-8''" in response.headers['content-disposition']
        assert response.content.startswith(b'%PDF')


def test_api_rejeita_id_invalido():
    with TestClient(app) as client:
        assert client.delete('/api/projetos/C:outside').status_code == 400


def test_downloads_simultaneos_adesivos():
    def download(_):
        with TestClient(app) as client:
            response = client.get('/api/adesivos/pacote-padrao')
            assert response.status_code == 200
            assert response.content.startswith(b'PK')
    with ThreadPoolExecutor(max_workers=3) as executor:
        list(executor.map(download, range(3)))
