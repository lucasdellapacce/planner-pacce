import React from 'react';
import { 
  Plus, 
  Sparkles, 
  Clock, 
  FileText, 
  Copy, 
  Trash2, 
  Download, 
  ArrowRight, 
  LayoutTemplate, 
  Layers, 
  Calendar,
  CheckCircle2,
  FolderOpen
} from 'lucide-react';
import { ProjetoResumo, Paleta } from '../../types';
import { BIBLIOTECA_MODELOS } from '../templates/templateLibrary';
import { TemplateThumbnail } from '../templates/TemplateThumbnail';

interface DashboardViewProps {
  projetos: ProjetoResumo[];
  projetoAtivoId: string;
  onSelecionarProjeto: (id: string) => void;
  onAbrirWizard: () => void;
  onAbrirGaleriaModelos: () => void;
  onDuplicarProjeto: (id: string) => void;
  onExcluirProjeto: (id: string) => void;
  onExportarPdf: (id: string) => void;
  onEntrarEditor: () => void;
  paletaPadrao: Paleta;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  projetos,
  projetoAtivoId,
  onSelecionarProjeto,
  onAbrirWizard,
  onAbrirGaleriaModelos,
  onDuplicarProjeto,
  onExcluirProjeto,
  onExportarPdf,
  onEntrarEditor,
  paletaPadrao,
}) => {
  return (
    <div className="flex-1 overflow-y-auto bg-slate-50/70 p-8 select-none">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Banner de Boas-Vindas & Ação Principal */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#172B70] via-[#2D3F9E] to-[#535DEB] p-8 text-white shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-indigo-100">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>Estúdio de Criação de Planners Digitais</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Crie planners perfeitos para o Goodnotes.
            </h1>
            <p className="text-sm text-indigo-100/90 leading-relaxed">
              Combine a facilidade visual do Canva, a organização de páginas do Goodnotes e a precisão vetorial milimétrica com navegação hiperlinkada nativa.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={onAbrirWizard}
                className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-white text-[#172B70] font-bold text-xs shadow-lg shadow-black/10 hover:bg-indigo-50 active:scale-[0.98] transition-all"
              >
                <Plus className="w-4 h-4 text-indigo-600" />
                <span>Criar Novo Planner</span>
              </button>

              <button
                onClick={onAbrirGaleriaModelos}
                className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 backdrop-blur-md active:scale-[0.98] transition-all"
              >
                <LayoutTemplate className="w-4 h-4 text-indigo-200" />
                <span>Explorar Biblioteca de Modelos</span>
              </button>
            </div>
          </div>

          {/* Efeitos Decorativos de Fundo */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 pointer-events-none flex items-center justify-center">
            <Calendar className="w-80 h-80 text-white -mr-16 -mt-16" />
          </div>
        </div>

        {/* Seção 1: Projetos Recentes */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Seus Planners Recentes</h2>
              <p className="text-xs text-slate-500">
                Continue editando seus projetos salvos ou faça o download para o Goodnotes.
              </p>
            </div>
            {projetos.length > 0 && (
              <span className="text-xs font-semibold text-slate-400">
                {projetos.length} {projetos.length === 1 ? 'projeto salvo' : 'projetos salvos'}
              </span>
            )}
          </div>

          {projetos.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80 shadow-2xs space-y-3">
              <FolderOpen className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-700">Nenhum projeto encontrado</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Você ainda não tem nenhum planner criado. Inicie um agora usando nosso assistente de etapas.
              </p>
              <button
                onClick={onAbrirWizard}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Começar Agora</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {projetos.map((proj) => {
                const ativo = proj.id === projetoAtivoId;
                return (
                  <div
                    key={proj.id}
                    onClick={() => {
                      onSelecionarProjeto(proj.id);
                      onEntrarEditor();
                    }}
                    className={`group bg-white rounded-2xl border p-5 flex flex-col justify-between transition-all cursor-pointer shadow-xs hover:shadow-md hover:-translate-y-0.5 ${
                      ativo
                        ? 'border-indigo-500 ring-2 ring-indigo-500/20'
                        : 'border-slate-200/80 hover:border-indigo-300'
                    }`}
                  >
                    <div>
                      {/* Simulação Visual de Capa / Prévia */}
                      <div className="h-32 rounded-xl bg-gradient-to-br from-indigo-50 via-slate-50 to-indigo-100/50 border border-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden group-hover:from-indigo-100/60 transition-colors">
                        <div className="w-16 h-20 bg-white rounded shadow-sm border border-slate-200 flex flex-col items-center justify-center p-1.5 transform group-hover:scale-105 transition-transform">
                          <div className="w-full h-2 bg-indigo-500 rounded-2xs mb-1" />
                          <div className="w-3/4 h-1 bg-slate-200 rounded-2xs mb-0.5" />
                          <div className="w-1/2 h-1 bg-slate-200 rounded-2xs" />
                        </div>
                        <span className="absolute bottom-2 right-3 text-[10px] font-mono px-2 py-0.5 rounded bg-white/80 text-slate-500 backdrop-blur-xs border border-slate-200/60">
                          {proj.total_paginas} páginas
                        </span>
                      </div>

                      {/* Título e Descrição */}
                      <div className="mt-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                            {proj.nome}
                          </h3>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                          {proj.descricao || 'Planner digital personalizado.'}
                        </p>
                      </div>
                    </div>

                    {/* Rodapé do Card com Ações */}
                    <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-400 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {proj.atualizado_em ? new Date(proj.atualizado_em).toLocaleDateString('pt-BR') : 'Hoje'}
                      </span>

                      <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => onDuplicarProjeto(proj.id)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition"
                          title="Duplicar Planner"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onExportarPdf(proj.id)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition"
                          title="Exportar PDF para Goodnotes"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onExcluirProjeto(proj.id)}
                          className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 transition"
                          title="Excluir Planner"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Seção 2: Modelos em Destaque da Galeria */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Modelos Prontos em Destaque</h2>
              <p className="text-xs text-slate-500">
                Adicione páginas sofisticadas ao seu planner com 1 clique.
              </p>
            </div>
            <button
              onClick={onAbrirGaleriaModelos}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center space-x-1"
            >
              <span>Ver todos os {BIBLIOTECA_MODELOS.length} modelos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {BIBLIOTECA_MODELOS.slice(0, 4).map((mod) => (
              <div
                key={mod.id}
                onClick={onAbrirGaleriaModelos}
                className="bg-white rounded-2xl border border-slate-200/80 p-3 hover:border-indigo-400 transition cursor-pointer group shadow-2xs hover:shadow-sm flex flex-col justify-between"
              >
                <div className="w-full flex items-center justify-center p-2 rounded-xl bg-slate-50 group-hover:bg-indigo-50/40 transition">
                  <TemplateThumbnail
                    modelo={mod}
                    paleta={paletaPadrao}
                    estilo="apple"
                    largura={160}
                    altura={110}
                    proporcaoHorizontal={true}
                  />
                </div>
                <div className="mt-3">
                  <h4 className="text-xs font-bold text-slate-800 truncate">{mod.nome}</h4>
                  <p className="text-[10px] text-slate-400 capitalize mt-0.5">{mod.categoria.replace('_', ' ')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
