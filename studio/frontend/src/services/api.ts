import { browserApi } from './browserApi';
import { ProjetoPlanner, ProjetoResumo, RelatorioValidacaoResponse } from '../types';

const API_BASE = '/api';

const serverApi = {
  async listarProjetos(): Promise<ProjetoResumo[]> {
    const res = await fetch(`${API_BASE}/projetos`);
    if (!res.ok) throw new Error('Erro ao listar projetos');
    return res.json();
  },

  async obterProjeto(id: string): Promise<ProjetoPlanner> {
    const res = await fetch(`${API_BASE}/projetos/${id}`);
    if (!res.ok) throw new Error('Erro ao obter projeto');
    return res.json();
  },

  async criarProjeto(payload: any): Promise<ProjetoPlanner> {
    const res = await fetch(`${API_BASE}/projetos/criar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Erro ao criar projeto');
    return res.json();
  },

  async salvarProjeto(id: string, projeto: ProjetoPlanner): Promise<void> {
    const res = await fetch(`${API_BASE}/projetos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projeto),
    });
    if (!res.ok) throw new Error('Erro ao salvar projeto');
  },

  async excluirProjeto(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/projetos/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Erro ao excluir projeto');
  },

  async duplicarProjeto(id: string): Promise<ProjetoPlanner> {
    const res = await fetch(`${API_BASE}/projetos/${id}/duplicar`, { method: 'POST' });
    if (!res.ok) throw new Error('Erro ao duplicar projeto');
    return res.json();
  },

  async validarProjeto(id: string): Promise<RelatorioValidacaoResponse> {
    const res = await fetch(`${API_BASE}/projetos/${id}/validar`);
    if (!res.ok) throw new Error('Erro ao validar hyperlinks');
    return res.json();
  },

  getUrlExportarPdf(id: string): string {
    return `${API_BASE}/projetos/${id}/exportar-pdf`;
  },

  getUrlDownloadAdesivos(): string {
    return `${API_BASE}/adesivos/pacote-padrao`;
  },
};

export const browserMode = import.meta.env.MODE === 'pages';
export const api = browserMode ? browserApi : {
  ...serverApi,
  async exportarPdf(id: string) { window.location.href = serverApi.getUrlExportarPdf(id); },
  async baixarAdesivos() { window.location.href = serverApi.getUrlDownloadAdesivos(); },
  async exportarBackup(id: string) {
    const project = await serverApi.obterProjeto(id);
    const url = URL.createObjectURL(new Blob([JSON.stringify(project,null,2)], {type:'application/json'}));
    const link = document.createElement('a'); link.href=url; link.download=project.nome+'.json'; link.click();
    setTimeout(()=>URL.revokeObjectURL(url),60000);
  },
};
