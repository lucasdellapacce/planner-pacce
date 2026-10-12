import React, { useState } from 'react';
import { 
  Layers, 
  FolderKanban, 
  LayoutTemplate, 
  Palette, 
  Sparkles, 
  Settings, 
  ChevronRight,
  BookOpen,
  Calendar,
  Clock,
  CheckSquare,
  FileText
} from 'lucide-react';
import { Pagina, ProjetoResumo } from '../types';

interface SidebarProps {
  paginas: Pagina[];
  paginaSelecionadaId: string;
  onSelecionarPagina: (id: string) => void;
  projetos: ProjetoResumo[];
  projetoAtualId: string;
  onCarregarProjeto: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  paginas,
  paginaSelecionadaId,
  onSelecionarPagina,
  projetos,
  projetoAtualId,
  onCarregarProjeto,
}) => {
  const [abaAtiva, setAbaAtiva] = useState<'paginas' | 'projetos' | 'secoes'>('paginas');

  const obterIconeSecao = (tipo: string) => {
    switch (tipo) {
      case 'capa':
        return <BookOpen className="w-3.5 h-3.5 text-indigo-500" />;
      case 'indice':
        return <Layers className="w-3.5 h-3.5 text-blue-500" />;
      case 'planejamento_mensal':
        return <Calendar className="w-3.5 h-3.5 text-purple-500" />;
      case 'planejamento_semanal':
        return <Clock className="w-3.5 h-3.5 text-sky-500" />;
      case 'planejamento_diario':
        return <CheckSquare className="w-3.5 h-3.5 text-emerald-500" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <aside className="w-72 bg-white border-r border-slate-200/80 flex flex-col h-[calc(100vh-4rem)] select-none">
      {/* Abas Superiores da Barra Lateral */}
      <div className="flex border-b border-slate-100 p-2 gap-1 bg-slate-50/50">
        <button
          onClick={() => setAbaAtiva('paginas')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            abaAtiva === 'paginas'
              ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Páginas ({paginas.length})
        </button>
        <button
          onClick={() => setAbaAtiva('projetos')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            abaAtiva === 'projetos'
              ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Projetos ({projetos.length})
        </button>
      </div>

      {/* Conteúdo da Aba */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {abaAtiva === 'paginas' ? (
          paginas.length === 0 ? (
            <div className="text-center py-10 px-4">
              <Layers className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-medium text-slate-500">Nenhuma página gerada.</p>
              <p className="text-[11px] text-slate-400 mt-1">Crie um planner usando o assistente.</p>
            </div>
          ) : (
            paginas.map((pagina, index) => {
              const selecionada = pagina.id === paginaSelecionadaId;
              return (
                <div
                  key={pagina.id}
                  onClick={() => onSelecionarPagina(pagina.id)}
                  className={`group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition-all ${
                    selecionada
                      ? 'bg-indigo-50/90 text-indigo-900 border border-indigo-200/70 font-semibold shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100/70 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <span className="text-[10px] text-slate-400 font-mono w-5 text-right">
                      {index + 1}
                    </span>
                    <div className="p-1 rounded-md bg-white border border-slate-200/60 shadow-2xs">
                      {obterIconeSecao(pagina.tipo)}
                    </div>
                    <span className="truncate">
                      {pagina.titulo || pagina.id_navegacao || `Página ${index + 1}`}
                    </span>
                  </div>

                  {pagina.id_navegacao && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-mono opacity-80 group-hover:opacity-100">
                      #{pagina.id_navegacao}
                    </span>
                  )}
                </div>
              );
            })
          )
        ) : (
          /* Aba de Projetos */
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
              Seus Planners Salvos
            </span>
            {projetos.map((proj) => {
              const ativo = proj.id === projetoAtualId;
              return (
                <div
                  key={proj.id}
                  onClick={() => onCarregarProjeto(proj.id)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    ativo
                      ? 'bg-indigo-50/80 border-indigo-200 text-indigo-950 font-semibold'
                      : 'bg-white border-slate-200/80 hover:border-slate-300 text-slate-700 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-slate-900 truncate">{proj.nome}</span>
                    <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                      {proj.total_paginas} págs
                    </span>
                  </div>
                  {proj.descricao && (
                    <p className="text-[11px] text-slate-500 line-clamp-1">{proj.descricao}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Rodapé da Barra Lateral */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
        <span className="text-[11px]">PACCE Studio v0.1</span>
        <span className="text-[10px] text-slate-400">Goodnotes Ready</span>
      </div>
    </aside>
  );
};
