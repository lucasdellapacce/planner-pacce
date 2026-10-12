import React, { useState, useMemo } from 'react';
import { 
  X, 
  Search, 
  Sparkles, 
  Plus, 
  Check, 
  SlidersHorizontal,
  ChevronRight,
  Layers,
  ArrowRight,
  LayoutTemplate
} from 'lucide-react';
import { 
  BIBLIOTECA_MODELOS, 
  CATEGORIAS_MODELOS, 
  ESTILOS_VISUAIS, 
  ModeloPaginaDef 
} from './templateLibrary';
import { TemplateThumbnail } from './TemplateThumbnail';
import { Paleta, Pagina } from '../../types';

interface TemplateGalleryModalProps {
  aberto: boolean;
  onFechar: () => void;
  paleta: Paleta;
  larguraMm: number;
  alturaMm: number;
  onInserirPaginaModelo: (novaPagina: Pagina) => void;
}

export const TemplateGalleryModal: React.FC<TemplateGalleryModalProps> = ({
  aberto,
  onFechar,
  paleta,
  larguraMm,
  alturaMm,
  onInserirPaginaModelo,
}) => {
  const [categoriaAtiva, setCategoriaAtiva] = useState<string>('todos');
  const [busca, setBusca] = useState<string>('');
  const [estiloSelecionado, setEstiloSelecionado] = useState<string>('apple');
  const [modeloSelecionado, setModeloSelecionado] = useState<ModeloPaginaDef | null>(BIBLIOTECA_MODELOS[0]);

  // Filtragem de modelos
  const modelosFiltrados = useMemo(() => {
    return BIBLIOTECA_MODELOS.filter((m) => {
      const matchCategoria = categoriaAtiva === 'todos' || m.categoria === categoriaAtiva;
      const matchBusca = 
        busca.trim() === '' ||
        m.nome.toLowerCase().includes(busca.toLowerCase()) ||
        m.descricao.toLowerCase().includes(busca.toLowerCase());
      return matchCategoria && matchBusca;
    });
  }, [categoriaAtiva, busca]);

  if (!aberto) return null;

  const handleAplicarModelo = () => {
    if (!modeloSelecionado) return;

    // Gerar elementos respeitando dimensões da folha atual
    const elementos = modeloSelecionado.gerarElementos(
      larguraMm || 297,
      alturaMm || 210,
      paleta,
      estiloSelecionado
    );

    const idNav = modeloSelecionado.id + '_' + Math.random().toString(36).substring(2, 6);

    const novaPagina: Pagina = {
      id: 'page_' + Math.random().toString(36).substring(2, 9),
      tipo: modeloSelecionado.categoria === 'capas_indices' ? 'capa' : 'template_personalizado',
      titulo: modeloSelecionado.nome,
      subtitulo: `Modelo: ${modeloSelecionado.nome} (${estiloSelecionado})`,
      elementos,
      template_id: modeloSelecionado.id,
      data_referencia: '',
      mes_referencia: 0,
      ano_referencia: 0,
      semana_referencia: 0,
      id_navegacao: idNav,
      cor_fundo: { hex: '#FFFFFF', opacidade: 1 },
      margens: { topo: 10, base: 10, esquerda: 10, direita: 10 },
      ordem: 9999, // Será ajustada pela função que insere
      secao: modeloSelecionado.categoria,
    };

    onInserirPaginaModelo(novaPagina);
    onFechar();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 w-full max-w-5xl h-[88vh] flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-2xs">
              <LayoutTemplate className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-slate-900">Galeria de Modelos de Página</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100">
                  {BIBLIOTECA_MODELOS.length} Modelos Prontos
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Selecione uma composição profissional e personalize todos os elementos no estúdio.
              </p>
            </div>
          </div>

          <button
            onClick={onFechar}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barra de Filtros e Busca */}
        <div className="px-6 py-3 border-b border-slate-100 flex items-center justify-between gap-4 bg-white">
          {/* Categorias em Pílulas */}
          <div className="flex items-center space-x-1.5 overflow-x-auto py-1 scrollbar-none flex-1">
            {CATEGORIAS_MODELOS.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoriaAtiva(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  categoriaAtiva === cat.id
                    ? 'bg-[#172B70] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {cat.nome}
              </button>
            ))}
          </div>

          {/* Campo de Busca */}
          <div className="relative w-64 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar modelo..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
            />
          </div>
        </div>

        {/* Conteúdo Principal: Grade de Modelos + Painel de Detalhes da Prévia */}
        <div className="flex flex-1 overflow-hidden">
          {/* Grade de Modelos (Lado Esquerdo) */}
          <div className="flex-1 overflow-y-auto p-6 bg-slate-50/40">
            {modelosFiltrados.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-sm font-semibold text-slate-600">Nenhum modelo encontrado</p>
                <p className="text-xs text-slate-400 mt-1">Tente pesquisar por outro termo ou selecionar outra categoria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {modelosFiltrados.map((mod) => {
                  const selecionado = modeloSelecionado?.id === mod.id;
                  return (
                    <div
                      key={mod.id}
                      onClick={() => setModeloSelecionado(mod)}
                      className={`group p-3 rounded-2xl border transition-all cursor-pointer flex flex-col bg-white ${
                        selecionado
                          ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-md'
                          : 'border-slate-200/80 hover:border-indigo-300 hover:shadow-sm'
                      }`}
                    >
                      {/* Thumbnail Real */}
                      <div className="w-full flex items-center justify-center p-2 rounded-xl bg-slate-50 group-hover:bg-indigo-50/30 transition">
                        <TemplateThumbnail
                          modelo={mod}
                          paleta={paleta}
                          estilo={estiloSelecionado}
                          largura={200}
                          altura={135}
                          proporcaoHorizontal={larguraMm >= alturaMm}
                        />
                      </div>

                      {/* Informações */}
                      <div className="mt-3 flex flex-col flex-1 justify-between">
                        <div>
                          <div className="flex items-center justify-between">
                            <h3 className="text-xs font-bold text-slate-800 truncate">{mod.nome}</h3>
                            {selecionado && (
                              <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                                <Check className="w-2.5 h-2.5" />
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                            {mod.descricao}
                          </p>
                        </div>

                        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                          <span className="capitalize">{mod.categoria.replace('_', ' ')}</span>
                          <span className="text-indigo-600 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center">
                            Ver detalhes <ChevronRight className="w-3 h-3 ml-0.5" />
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Painel de Prévia e Personalização de Estilo (Lado Direito) */}
          <div className="w-84 border-l border-slate-100 bg-white p-5 flex flex-col justify-between overflow-y-auto">
            {modeloSelecionado ? (
              <div className="space-y-5">
                <div>
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest block mb-1">
                    Prévia Ampliada
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">{modeloSelecionado.nome}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{modeloSelecionado.descricao}</p>
                </div>

                {/* Prévia com Proporção Real */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-center shadow-inner">
                  <TemplateThumbnail
                    modelo={modeloSelecionado}
                    paleta={paleta}
                    estilo={estiloSelecionado}
                    largura={240}
                    altura={165}
                    proporcaoHorizontal={larguraMm >= alturaMm}
                  />
                </div>

                {/* Seletor de Estilo Visual */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Estilo Visual do Modelo</span>
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {ESTILOS_VISUAIS.map((est) => (
                      <button
                        key={est.id}
                        onClick={() => setEstiloSelecionado(est.id)}
                        className={`p-2 rounded-xl border text-left transition-all ${
                          estiloSelecionado === est.id
                            ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-semibold shadow-2xs'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <div className="text-[11px] leading-tight">{est.nome}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Metadados Técnicos */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-[11px] space-y-1.5 text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Dimensões:</span>
                    <span className="font-semibold">{larguraMm} × {alturaMm} mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Fidelidade:</span>
                    <span className="font-semibold text-emerald-600">100% Editável no Canvas</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Exportação:</span>
                    <span className="font-semibold text-indigo-600">Goodnotes & PDF Vetorial</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-slate-400 text-xs">
                Selecione um modelo para ver a prévia
              </div>
            )}

            {/* Botão de Ação */}
            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={handleAplicarModelo}
                disabled={!modeloSelecionado}
                className="w-full py-3 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-[#535DEB] to-[#172B70] hover:opacity-95 shadow-lg shadow-indigo-500/25 flex items-center justify-center space-x-2 active:scale-[0.99] transition-all disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                <span>Usar este Modelo no Planner</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
