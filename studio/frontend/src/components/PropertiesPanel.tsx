import React from 'react';
import { 
  Sliders, 
  Type, 
  Link2, 
  Square, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Bold, 
  Italic, 
  Trash2, 
  Palette,
  Layers,
  Sparkles
} from 'lucide-react';
import { Elemento, Pagina } from '../types';

interface PropertiesPanelProps {
  elemento: Elemento | null;
  pagina: Pagina | null;
  onAtualizarElemento: (atualizado: Elemento) => void;
  onExcluirElemento: (id: string) => void;
  todasPaginas: Pagina[];
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  elemento,
  pagina,
  onAtualizarElemento,
  onExcluirElemento,
  todasPaginas,
}) => {
  const paletaCores = [
    '#535DEB', // Índigo primário
    '#172B70', // Azul marinho
    '#F0EEFF', // Fundo lavanda
    '#DDE2FF', // Fundo médio
    '#1E293B', // Ardósia escuro
    '#64748B', // Cinza texto
    '#10B981', // Verde
    '#EF4444', // Vermelho
    '#F59E0B', // Âmbar
    '#FFFFFF', // Branco
  ];

  if (!elemento) {
    return (
      <aside className="w-64 xl:w-80 shrink-0 bg-white border-l border-slate-200/80 p-5 flex flex-col justify-between h-[calc(100vh-4rem)] select-none">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">
            <Sliders className="w-4 h-4 text-indigo-600" />
            <span>Propriedades da Página</span>
          </div>

          {pagina && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-500 font-medium mb-1">Título da Página</label>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium">
                  {pagina.titulo || 'Sem título'}
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Identificador de Navegação</label>
                <div className="p-2 rounded-lg bg-indigo-50/70 border border-indigo-100 font-mono text-indigo-700 font-bold">
                  #{pagina.id_navegacao || 'não indexado'}
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Seção / Categoria</label>
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 capitalize">
                  {pagina.secao?.replace('_', ' ') || 'Geral'}
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Total de Objetos na Página</label>
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 font-semibold">
                  {pagina.elementos.length} elementos gráficos
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-3 bg-indigo-50/60 rounded-2xl border border-indigo-100 text-[11px] text-indigo-900/80 text-center leading-relaxed">
          💡 Clique em qualquer elemento na folha para editar suas dimensões, cores, fontes e links de navegação.
        </div>
      </aside>
    );
  }

  const handleChange = (campo: keyof Elemento, valor: any) => {
    onAtualizarElemento({
      ...elemento,
      [campo]: valor,
    });
  };

  return (
    <aside className="w-64 xl:w-80 shrink-0 bg-white border-l border-slate-200/80 p-5 overflow-y-auto h-[calc(100vh-4rem)] select-none space-y-4">
      {/* Cabeçalho do Elemento */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <Square className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-bold text-slate-900 capitalize">
            {elemento.nome || elemento.tipo.replace('_', ' ')}
          </span>
        </div>
        <button
          onClick={() => onExcluirElemento(elemento.id)}
          className="p-1 text-slate-400 hover:text-red-500 rounded transition"
          title="Excluir Elemento"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-4 text-xs">
        {/* Posição e Dimensões (mm) */}
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Posição e Tamanho (mm)
          </span>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] text-slate-500 block mb-0.5">X (mm)</label>
              <input
                type="number"
                step="0.5"
                value={Math.round(elemento.x * 10) / 10}
                onChange={(e) => handleChange('x', parseFloat(e.target.value) || 0)}
                className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-slate-800 font-mono text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-500 block mb-0.5">Y (mm)</label>
              <input
                type="number"
                step="0.5"
                value={Math.round(elemento.y * 10) / 10}
                onChange={(e) => handleChange('y', parseFloat(e.target.value) || 0)}
                className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-slate-800 font-mono text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-500 block mb-0.5">Largura (mm)</label>
              <input
                type="number"
                step="0.5"
                value={Math.round(elemento.largura * 10) / 10}
                onChange={(e) => handleChange('largura', Math.max(1, parseFloat(e.target.value) || 1))}
                className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-slate-800 font-mono text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-500 block mb-0.5">Altura (mm)</label>
              <input
                type="number"
                step="0.5"
                value={Math.round(elemento.altura * 10) / 10}
                onChange={(e) => handleChange('altura', Math.max(1, parseFloat(e.target.value) || 1))}
                className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-slate-800 font-mono text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Conteúdo de Texto */}
        {(elemento.tipo === 'texto' || elemento.tipo === 'caixa_texto' || elemento.tipo === 'checkbox') && (
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Texto e Tipografia
            </span>
            <textarea
              rows={2}
              value={elemento.texto}
              onChange={(e) => handleChange('texto', e.target.value)}
              className="w-full p-2 rounded-lg border border-slate-200 text-slate-800 text-xs focus:ring-1 focus:ring-indigo-500 outline-none resize-none mb-2"
              placeholder="Digite o texto..."
            />

            <div className="flex items-center space-x-1.5 mb-2">
              <button
                onClick={() => handleChange('negrito', !elemento.negrito)}
                className={`p-1.5 rounded-lg border ${
                  elemento.negrito ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'border-slate-200 text-slate-600'
                }`}
                title="Negrito"
              >
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleChange('italico', !elemento.italico)}
                className={`p-1.5 rounded-lg border ${
                  elemento.italico ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'border-slate-200 text-slate-600'
                }`}
                title="Itálico"
              >
                <Italic className="w-3.5 h-3.5" />
              </button>
              <div className="h-4 w-px bg-slate-200" />
              <button
                onClick={() => handleChange('alinhamento', 'left')}
                className={`p-1.5 rounded-lg border ${
                  elemento.alinhamento === 'left' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'border-slate-200 text-slate-600'
                }`}
              >
                <AlignLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleChange('alinhamento', 'center')}
                className={`p-1.5 rounded-lg border ${
                  elemento.alinhamento === 'center' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'border-slate-200 text-slate-600'
                }`}
              >
                <AlignCenter className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleChange('alinhamento', 'right')}
                className={`p-1.5 rounded-lg border ${
                  elemento.alinhamento === 'right' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'border-slate-200 text-slate-600'
                }`}
              >
                <AlignRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Cores: Texto, Fundo e Borda */}
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Cores & Estilo
          </span>
          <div className="space-y-2">
            <div>
              <label className="text-[11px] text-slate-500 block mb-1">Cor do Texto</label>
              <div className="flex items-center space-x-1.5">
                <input
                  type="color"
                  value={elemento.cor_texto?.hex || '#1E293B'}
                  onChange={(e) => handleChange('cor_texto', { hex: e.target.value, opacidade: 1 })}
                  className="w-7 h-7 rounded border border-slate-200 cursor-pointer p-0.5"
                />
                <span className="font-mono text-[11px] text-slate-600 uppercase">
                  {elemento.cor_texto?.hex || '#1E293B'}
                </span>
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-500 block mb-1">Cor de Fundo</label>
              <div className="flex items-center space-x-1.5">
                <input
                  type="color"
                  value={elemento.cor_fundo?.hex || '#FFFFFF'}
                  onChange={(e) => handleChange('cor_fundo', { hex: e.target.value, opacidade: 1 })}
                  className="w-7 h-7 rounded border border-slate-200 cursor-pointer p-0.5"
                />
                <button
                  onClick={() => handleChange('cor_fundo', undefined)}
                  className="text-[10px] text-slate-500 hover:text-slate-800 underline ml-2"
                >
                  Transparente
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <label className="text-[11px] text-slate-500 block mb-0.5">Borda (mm)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={elemento.espessura_borda || 0}
                  onChange={(e) => handleChange('espessura_borda', Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-slate-800 font-mono text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-500 block mb-0.5">Raio / Canto (mm)</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={elemento.raio_borda || 0}
                  onChange={(e) => handleChange('raio_borda', Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-slate-800 font-mono text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Hyperlink de Navegação */}
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2 flex items-center space-x-1">
            <Link2 className="w-3 h-3 text-indigo-600" />
            <span>Destino de Hyperlink</span>
          </span>
          <select
            value={elemento.destino_link || ''}
            onChange={(e) => handleChange('destino_link', e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-800 text-xs focus:ring-1 focus:ring-indigo-500 outline-none bg-white"
          >
            <option value="">Nenhum (Sem link)</option>
            {todasPaginas
              .filter((p) => p.id_navegacao)
              .map((p) => (
                <option key={p.id} value={p.id_navegacao}>
                  {p.titulo || p.id_navegacao} (#{p.id_navegacao})
                </option>
              ))}
          </select>
        </div>
      </div>
    </aside>
  );
};


