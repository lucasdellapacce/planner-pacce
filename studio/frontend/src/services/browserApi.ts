import { ProjetoPlanner, ProjetoResumo, RelatorioValidacaoResponse } from '../types';

let worker: Worker | undefined;
let nextId = 0;
const pending = new Map<number, { resolve: (value: any) => void; reject: (reason: Error) => void }>();
function execute<T>(action: string, payload: unknown): Promise<T> {
  if (!worker) {
    worker = new Worker('/planner-worker.js',{type:'module'});
    worker.onmessage = ({data}) => {
      const task = pending.get(data.id);
      if (!task) return;
      pending.delete(data.id);
      if (data.error) { console.error("Motor PACCE:",data.error); task.reject(new Error(data.error)); }
      else task.resolve(data.bytes || data.result);
    };
    worker.onerror = () => {
      pending.forEach(task => task.reject(new Error('Falha ao iniciar o motor de planners. Recarregue a página.')));
      pending.clear(); worker?.terminate(); worker = undefined;
    };
  }
  const id = ++nextId;
  return new Promise((resolve,reject) => { pending.set(id,{resolve,reject}); worker!.postMessage({id,action,payload}); });
}
let database: Promise<IDBDatabase> | undefined;
function db() {
  if (!database) database = new Promise<IDBDatabase>((resolve,reject) => {
    const request = indexedDB.open('pacce-planner-studio',1);
    request.onupgradeneeded = () => request.result.createObjectStore('projects',{keyPath:'id'});
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(new Error('Não foi possível abrir o armazenamento deste navegador.'));
  });
  return database;
}
async function transaction<T>(mode: IDBTransactionMode, run: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const database = await db();
  return new Promise((resolve,reject) => {
    const tx = database.transaction('projects',mode);
    const request = run(tx.objectStore('projects'));
    tx.oncomplete = () => resolve(request.result);
    tx.onerror = () => reject(tx.error || new Error('Erro ao salvar neste navegador.'));
    tx.onabort = () => reject(tx.error || new Error('Armazenamento cheio ou indisponível.'));
  });
}
function download(bytes: Uint8Array, type: string, name: string) {
  const blob = new Blob([new Uint8Array(bytes).buffer],{type});
  const url=URL.createObjectURL(blob);
  const link=document.createElement('a'); link.href=url; link.download=name; link.click();
  setTimeout(()=>URL.revokeObjectURL(url),60000);
}
export const browserApi = {
  async listarProjetos(): Promise<ProjetoResumo[]> {
    const projects=await transaction<ProjetoPlanner[]>('readonly',s=>s.getAll());
    return projects.map(p=>({id:p.id,nome:p.nome,descricao:p.descricao,criado_em:p.criado_em,atualizado_em:p.atualizado_em,total_paginas:p.paginas.length})).sort((a,b)=>b.atualizado_em.localeCompare(a.atualizado_em));
  },
  async obterProjeto(id: string): Promise<ProjetoPlanner> {
    const project=await transaction<ProjetoPlanner>('readonly',s=>s.get(id));
    if(!project) throw new Error('Projeto não encontrado neste navegador.');
    return project;
  },
  async criarProjeto(payload: any): Promise<ProjetoPlanner> {
    const project=await execute<ProjetoPlanner>('create',payload);
    await this.salvarProjeto(project.id,project);
    return project;
  },
  async salvarProjeto(id: string, project: ProjetoPlanner): Promise<void> {
    await transaction('readwrite',s=>s.put({...project,id,atualizado_em:new Date().toISOString()}));
  },
  async excluirProjeto(id: string): Promise<void> { await transaction('readwrite',s=>s.delete(id)); },
  async duplicarProjeto(id: string): Promise<ProjetoPlanner> {
    const original=await this.obterProjeto(id);
    const copy={...original,id:crypto.randomUUID(),nome:original.nome+' (cópia)',criado_em:new Date().toISOString()};
    await this.salvarProjeto(copy.id,copy); return copy;
  },
  async validarProjeto(id: string): Promise<RelatorioValidacaoResponse> { return execute('validate',await this.obterProjeto(id)); },
  async exportarPdf(id: string) {
    const project=await this.obterProjeto(id);
    download(await execute<Uint8Array>('pdf',project),'application/pdf',project.nome+'.pdf');
  },
  async baixarAdesivos() { download(await execute<Uint8Array>('stickers',null),'application/zip','PACCE_Adesivos_Goodnotes.zip'); },
  async exportarBackup(id: string) {
    const project=await this.obterProjeto(id);
    download(new TextEncoder().encode(JSON.stringify(project,null,2)),'application/json',project.nome+'.json');
  },
  async importarBackup(file: File) {
    const project=JSON.parse(await file.text()) as ProjetoPlanner;
    if(!project.nome || !Array.isArray(project.paginas) || !project.configuracao || project.schema_version!=='1.0.0') throw new Error('Arquivo de projeto PACCE inválido.');
    project.id=crypto.randomUUID();
    await this.salvarProjeto(project.id,project); return project;
  }
};
