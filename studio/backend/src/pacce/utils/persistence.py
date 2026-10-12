"""Sistema de persistência para PACCE Planner Studio.

Gerencia salvamento, carregamento, exportação e importação
de projetos do planner em formato JSON.
"""

from __future__ import annotations

import json
import os
import shutil
import zipfile
from datetime import datetime
from pathlib import Path
from typing import Optional

from ..models.planner import ProjetoPlanner, SCHEMA_VERSION


class IdProjetoInvalido(ValueError):
    """Identificador que não pode ser usado como nome de diretório."""


class GerenciadorProjetos:
    """Gerencia projetos do planner no sistema de arquivos.
    
    Estrutura de diretórios:
    projects/
    ├── {project_id}/
    │   ├── project.json
    │   ├── resources/
    │   │   ├── images/
    │   │   └── stickers/
    │   └── exports/
    """
    
    def __init__(self, diretorio_base: str | Path):
        self.diretorio_base = Path(diretorio_base)
        self.diretorio_base.mkdir(parents=True, exist_ok=True)
    
    def _diretorio_projeto(self, projeto_id: str) -> Path:
        """Retorna o diretório de um projeto."""
        # IDs não podem apontar para outras pastas do computador.
        import re
        if not re.fullmatch(r"[A-Za-z0-9_-]{1,128}", projeto_id):
            raise IdProjetoInvalido("ID de projeto inválido")
        return self.diretorio_base / projeto_id
    
    def _arquivo_projeto(self, projeto_id: str) -> Path:
        """Retorna o caminho do arquivo principal do projeto."""
        return self._diretorio_projeto(projeto_id) / "project.json"
    
    def salvar(self, projeto: ProjetoPlanner) -> Path:
        """Salva um projeto no disco."""
        dir_proj = self._diretorio_projeto(projeto.id)
        dir_proj.mkdir(parents=True, exist_ok=True)
        (dir_proj / "resources" / "images").mkdir(parents=True, exist_ok=True)
        (dir_proj / "resources" / "stickers").mkdir(parents=True, exist_ok=True)
        (dir_proj / "exports").mkdir(parents=True, exist_ok=True)
        
        arquivo = self._arquivo_projeto(projeto.id)
        dados = projeto.to_dict()
        
        # Backup antes de sobrescrever
        if arquivo.exists():
            backup = arquivo.with_suffix(f".backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json")
            shutil.copy2(arquivo, backup)
            # Manter apenas os 5 últimos backups
            backups = sorted(dir_proj.glob("project.backup_*.json"))
            for b in backups[:-5]:
                b.unlink()
        
        with open(arquivo, "w", encoding="utf-8") as f:
            json.dump(dados, f, ensure_ascii=False, indent=2)
        
        return arquivo
    
    def carregar(self, projeto_id: str) -> ProjetoPlanner:
        """Carrega um projeto do disco."""
        arquivo = self._arquivo_projeto(projeto_id)
        if not arquivo.exists():
            raise FileNotFoundError(f"Projeto '{projeto_id}' não encontrado")
        
        with open(arquivo, "r", encoding="utf-8") as f:
            dados = json.load(f)
        
        # Migração de schema se necessário
        dados = self._migrar_schema(dados)
        
        return ProjetoPlanner.from_dict(dados)
    
    def listar(self) -> list[dict]:
        """Lista todos os projetos salvos."""
        projetos = []
        
        for dir_proj in self.diretorio_base.iterdir():
            if not dir_proj.is_dir():
                continue
            
            arquivo = dir_proj / "project.json"
            if not arquivo.exists():
                continue
            
            try:
                with open(arquivo, "r", encoding="utf-8") as f:
                    dados = json.load(f)
                
                projetos.append({
                    "id": dados.get("id", dir_proj.name),
                    "nome": dados.get("nome", "Sem nome"),
                    "descricao": dados.get("descricao", ""),
                    "criado_em": dados.get("criado_em", ""),
                    "atualizado_em": dados.get("atualizado_em", ""),
                    "total_paginas": len(dados.get("paginas", [])),
                })
            except (json.JSONDecodeError, KeyError):
                continue
        
        return sorted(projetos, key=lambda p: p.get("atualizado_em", ""), reverse=True)
    
    def excluir(self, projeto_id: str) -> bool:
        """Exclui um projeto do disco."""
        dir_proj = self._diretorio_projeto(projeto_id)
        if dir_proj.exists():
            shutil.rmtree(dir_proj)
            return True
        return False
    
    def duplicar(self, projeto_id: str, novo_nome: str = "") -> ProjetoPlanner:
        """Duplica um projeto existente."""
        import uuid
        
        projeto = self.carregar(projeto_id)
        projeto.id = str(uuid.uuid4())
        projeto.nome = novo_nome or f"{projeto.nome} (cópia)"
        projeto.criado_em = datetime.now().isoformat()
        projeto.atualizado_em = datetime.now().isoformat()
        
        self.salvar(projeto)
        return projeto
    
    def exportar_projeto(self, projeto_id: str, caminho_saida: str) -> str:
        """Exporta um projeto como arquivo ZIP portável."""
        dir_proj = self._diretorio_projeto(projeto_id)
        if not dir_proj.exists():
            raise FileNotFoundError(f"Projeto '{projeto_id}' não encontrado")
        
        with zipfile.ZipFile(caminho_saida, "w", zipfile.ZIP_DEFLATED) as zf:
            for arquivo in dir_proj.rglob("*"):
                if arquivo.is_file() and ".backup_" not in arquivo.name:
                    arcname = arquivo.relative_to(dir_proj)
                    zf.write(arquivo, arcname)
        
        return caminho_saida
    
    def importar_projeto(self, caminho_zip: str) -> ProjetoPlanner:
        """Importa um projeto a partir de um arquivo ZIP."""
        import uuid
        
        with zipfile.ZipFile(caminho_zip, "r") as zf:
            # Ler project.json do ZIP
            with zf.open("project.json") as f:
                dados = json.load(f)
            
            # Gerar novo ID para evitar conflitos
            novo_id = str(uuid.uuid4())
            dados["id"] = novo_id
            
            dir_proj = self._diretorio_projeto(novo_id)
            zf.extractall(dir_proj)
        
        # Salvar com novo ID
        projeto = ProjetoPlanner.from_dict(dados)
        projeto.id = novo_id
        self.salvar(projeto)
        
        return projeto
    
    def obter_diretorio_exportacao(self, projeto_id: str) -> Path:
        """Retorna o diretório de exportação de um projeto."""
        exports = self._diretorio_projeto(projeto_id) / "exports"
        exports.mkdir(parents=True, exist_ok=True)
        return exports
    
    def _migrar_schema(self, dados: dict) -> dict:
        """Migra dados de versões anteriores do schema."""
        versao = dados.get("schema_version", "1.0.0")
        
        # Versão atual, sem migração necessária
        if versao == SCHEMA_VERSION:
            return dados
        
        # Futuras migrações serão adicionadas aqui
        # if versao == "0.9.0":
        #     dados = self._migrar_0_9_para_1_0(dados)
        
        dados["schema_version"] = SCHEMA_VERSION
        return dados
