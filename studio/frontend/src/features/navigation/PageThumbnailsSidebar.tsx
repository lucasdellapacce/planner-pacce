import React, { useState } from 'react';
import { 
  Layers, 
  LayoutGrid, 
  List, 
  Plus, 
  Copy, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  Edit2, 
  BookOpen, 
  Calendar, 
  Clock, 
  CheckSquare, 
  FileText,
  Search,
  Check
} from 'lucide-react';
import { Pagina, ProjetoResumo, Paleta } from '../../types';

interface PageThumbnailsSidebarProps {
  paginas: Pagina[];
  paginaSelecionadaId: string;
  onSelecionarPagina: (id: string) => void;
  onMoverPagina: (id: string, direcao: 'cima' | 'baixo') => void;
  onDuplicarPagina: (id: string) => void;
  onExcluirPagina: (id: string) => void;
  onRenomearPagina: (id: string, novoTitulo: string) => void;
  onAbrirGaleriaModelos: () => void;
  onAdicionarPaginaBranco: () => void;
  projetos: ProjetoResumo[];
  projetoAtualId: string;
  onCarregarProjeto: (id: string) => void;
  paleta: Paleta;
}

export const PageThumbnailsSidebar: React.FC<PageThumbnailsSidebarProps> = ({
  paginas,
  paginaSelecionadaId,
  onSelecionarPagina,
  onMoverPagina,
  onDuplicarPagina,
  onExcluirPagina,
  onRenomearPagina,
  onAbrirGaleriaModelos,
  onAdicionarPaginaBranco,
  projetos,
  projetoAtualId,
  onCarregarProjeto,
  paleta,
}) => {
  const [abaAtiva, setAbaAtiva] = useState<'paginas' | 'projetos'>('paginas');
  const [modoVisualizacao, setModoVisualizacao] = useState<'lista' | 'grade'>('lista');
  const [busca, setBusca] = useState<string>('');
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [tituloEditado, setTituloEditado] = useState<string>('');

  const obterIconeSecao = (tipo: string) => {
    switch (tipo) {
      case 'capa':
        return <BookOpen className="w-3.5 h-3.5 text-indigo-500" />;
      case 'indice':
        return <Layers className="w-3.5 h-3.5 text-blue-500" />;
      case 'planejamento_mensal':
      case 'calendario_mensal':
        return <Calendar className="w-3.5 h-3.5 text-purple-500" />;
      case 'planejamento_semanal':
        return <Clock className="w-3.5 h-3.5 text-sky-500" />;
      case 'planejamento_diario':
        return <CheckSquare className="w-3.5 h-3.5 text-emerald-500" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const paginasFiltradas = paginas.filter((p) => {
    if (!busca) return true;
    const term = busca.toLowerCase();
    return (
      (p.titulo && p.titulo.toLowerCase().includes(term)) ||
      (p.id_navegacao && p.id_navegacao.toLowerCase().includes(term)) ||
      (p.secao && p.secao.toLowerCase().includes(term))
    );
  });

  const handleSalvarRenomear = (id: string) => {
    if (tituloEditado.trim()) {
      onRenomearPagina(id, tituloEditado.trim());
    }
    setEditandoId(null);
  };

  return (
    <aside className="w-64 xl:w-80 shrink-0 bg-white border-r border-slate-200/80 flex flex-col h-[calc(100vh-4rem)] select-none">
      {/* Abas e Alternador de Modo de Visualização */}
      <div className="flex items-center justify-between border-b border-slate-100 p-2.5 bg-slate-50/50">
        <div className="flex bg-slate-200/60 p-0.5 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setAbaAtiva('paginas')}
            className={`px-3 py-1 rounded-lg transition-all ${
              abaAtiva === 'paginas'
                ? 'bg-white text-indigo-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Páginas ({paginas.length})
          </button>
          <button
            onClick={() => setAbaAtiva('projetos')}
            className={`px-3 py-1 rounded-lg transition-all ${
              abaAtiva === 'projetos'
                ? 'bg-white text-indigo-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Planners ({projetos.length})
          </button>
        </div>

        {abaAtiva === 'paginas' && (
          <div className="flex items-center space-x-0.5 bg-slate-200/60 p-0.5 rounded-lg text-slate-600">
            <button
              onClick={() => setModoVisualizacao('lista')}
              className={`p-1 rounded transition ${modoVisualizacao === 'lista' ? 'bg-white text-indigo-600 shadow-2xs' : 'hover:text-slate-900'}`}
              title="Modo Lista"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setModoVisualizacao('grade')}
              className={`p-1 rounded transition ${modoVisualizacao === 'grade' ? 'bg-white text-indigo-600 shadow-2xs' : 'hover:text-slate-900'}`}
              title="Modo Miniaturas Visuais"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Barra de Ações Rápidas: Adicionar Modelos ou Página em Branco */}
      {abaAtiva === 'paginas' && (
        <div className="p-2.5 border-b border-slate-100 space-y-2 bg-white">
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={onAbrirGaleriaModelos}
              className="py-1.5 px-2 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 transition flex items-center justify-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Usar Modelo</span>
            </button>
            <button
              onClick={onAdicionarPaginaBranco}
              className="py-1.5 px-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition flex items-center justify-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5 text-slate-500" />
              <span>Página Lisa</span>
            </button>
          </div>

          {/* Campo de Busca Rápida */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Localizar página..."
              className="w-full pl-8 pr-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>
      )}

      {/* Lista / Grade de Páginas */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-1">
        {abaAtiva === 'paginas' ? (
          paginasFiltradas.length === 0 ? (
            <div className="text-center py-10 px-4">
              <Layers className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-medium text-slate-500">Nenhuma página encontrada.</p>
            </div>
          ) : modoVisualizacao === 'lista' ? (
            paginasFiltradas.map((pagina, index) => {
              const selecionada = pagina.id === paginaSelecionadaId;
              const isEditing = editandoId === pagina.id;

              return (
                <div
                  key={pagina.id}
                  onClick={() => onSelecionarPagina(pagina.id)}
                  className={`group flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-all ${
                    selecionada
                      ? 'bg-indigo-50 text-indigo-950 border border-indigo-200 font-semibold shadow-2xs'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center space-x-2 min-w-0 flex-1">
                    <span className="text-[10px] text-slate-400 font-mono w-5 text-right shrink-0">
                      {index + 1}
                    </span>
                    <div className="p-1 rounded bg-white border border-slate-200 shadow-2xs shrink-0">
                      {obterIconeSecao(pagina.tipo)}
                    </div>

                    {isEditing ? (
                      <div className="flex items-center space-x-1 flex-1" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="text"
                          value={tituloEditado}
                          autoFocus
                          onChange={(e) => setTituloEditado(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSalvarRenomear(pagina.id);
                          }}
                          className="w-full px-1.5 py-0.5 text-xs border border-indigo-400 rounded outline-none"
                        />
                        <button
                          onClick={() => handleSalvarRenomear(pagina.id)}
                          className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <span className="truncate flex-1">
                        {pagina.titulo || pagina.id_navegacao || `Página ${index + 1}`}
                      </span>
                    )}
                  </div>

                  {/* Ações da Página no Hover */}
                  <div className="flex items-center space-x-0.5 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => {
                        setEditandoId(pagina.id);
                        setTituloEditado(pagina.titulo || '');
                      }}
                      className="p-1 text-slate-400 hover:text-indigo-600 rounded"
                      title="Renomear Página"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onMoverPagina(pagina.id, 'cima')}
                      disabled={index === 0}
                      className="p-1 text-slate-400 hover:text-indigo-600 disabled:opacity-30 rounded"
                      title="Mover para cima"
                    >
                      <ChevronUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onMoverPagina(pagina.id, 'baixo')}
                      disabled={index === paginas.length - 1}
                      className="p-1 text-slate-400 hover:text-indigo-600 disabled:opacity-30 rounded"
                      title="Mover para baixo"
                    >
                      <ChevronDown className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onDuplicarPagina(pagina.id)}
                      className="p-1 text-slate-400 hover:text-indigo-600 rounded"
                      title="Duplicar Página"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    {paginas.length > 1 && (
                      <button
                        onClick={() => onExcluirPagina(pagina.id)}
                        className="p-1 text-slate-400 hover:text-red-500 rounded"
                        title="Excluir Página"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            /* Modo Grade de Miniaturas Reais */
            <div className="grid grid-cols-2 gap-2 p-1">
              {paginasFiltradas.map((pagina, index) => {
                const selecionada = pagina.id === paginaSelecionadaId;
                return (
                  <div
                    key={pagina.id}
                    onClick={() => onSelecionarPagina(pagina.id)}
                    className={`p-2 rounded-xl border text-xs cursor-pointer flex flex-col items-center space-y-1.5 transition ${
                      selecionada
                        ? 'bg-indigo-50 border-indigo-400 ring-2 ring-indigo-500/20 shadow-2xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {/* Miniatura Proporcional da Folha */}
                    <div className="w-full aspect-[4/3] bg-white rounded border border-slate-200 shadow-2xs flex flex-col items-center justify-center p-1 relative overflow-hidden">
                      <span className="text-[9px] font-bold text-slate-300">Pág {index + 1}</span>
                      {pagina.elementos.length > 0 && (
                        <div className="w-3/4 h-1 bg-indigo-200 rounded mt-1" />
                      )}
                    </div>
                    <span className="text-[10px] font-semibold text-slate-700 truncate w-full text-center">
                      {pagina.titulo || `Pág ${index + 1}`}
                    </span>
                  </div>
                );
              })}
            </div>
          )
        ) : (
          /* Aba de Planners Salvos */
          <div className="space-y-2 p-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Planners Salvos no Workspace
            </span>
            {projetos.map((proj) => {
              const ativo = proj.id === projetoAtualId;
              return (
                <div
                  key={proj.id}
                  onClick={() => onCarregarProjeto(proj.id)}
                  className={`p-3 rounded-2xl border text-xs cursor-pointer transition ${
                    ativo
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-950 font-semibold shadow-2xs'
                      : 'bg-white border-slate-200/80 hover:border-slate-300 text-slate-700 hover:shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900 truncate">{proj.nome}</span>
                    <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-mono">
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
        <span className="text-[11px] font-semibold text-indigo-700">PACCE Studio</span>
        <span className="text-[10px] text-slate-400 font-mono">Goodnotes 100% OK</span>
      </div>
    </aside>
  );
};
