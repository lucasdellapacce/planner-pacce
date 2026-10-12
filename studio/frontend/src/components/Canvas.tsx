import React, { useState } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Move } from 'lucide-react';
import { Pagina, Elemento, ConfiguracaoProjeto } from '../types';

interface CanvasProps {
  pagina: Pagina | null;
  config: ConfiguracaoProjeto | null;
  elementoSelecionadoId: string | null;
  onSelecionarElemento: (id: string | null) => void;
}

export const Canvas: React.FC<CanvasProps> = ({
  pagina,
  config,
  elementoSelecionadoId,
  onSelecionarElemento,
}) => {
  const [zoom, setZoom] = useState<number>(100);

  if (!pagina || !config) {
    return (
      <main className="flex-1 bg-slate-100 flex items-center justify-center select-none">
        <div className="text-center p-8 bg-white/70 rounded-2xl border border-slate-200/80 shadow-sm max-w-sm">
          <p className="text-sm font-semibold text-slate-700">Nenhuma página aberta</p>
          <p className="text-xs text-slate-500 mt-1">Selecione uma página na barra lateral ou inicie um novo planner.</p>
        </div>
      </main>
    );
  }

  // Dimensões da folha em mm
  const larguraMm = config.largura_mm || 297;
  const alturaMm = config.altura_mm || 210;

  // Escala para exibição na tela: 1mm = ~3px no zoom 100%
  const escalaBase = 3.2 * (zoom / 100);
  const larguraPx = larguraMm * escalaBase;
  const alturaPx = alturaMm * escalaBase;

  return (
    <main 
      className="flex-1 bg-slate-100/90 overflow-auto flex flex-col items-center justify-start p-8 relative select-none"
      onClick={() => onSelecionarElemento(null)}
    >
      {/* Barra de Controles de Zoom Flutuante (Apple-style) */}
      <div 
        className="fixed bottom-6 right-80 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200/80 shadow-lg flex items-center space-x-2 text-xs font-semibold text-slate-700 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setZoom((z) => Math.max(50, z - 15))}
          className="p-1 hover:bg-slate-100 rounded-full text-slate-600 transition"
          title="Diminuir Zoom"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <span className="w-10 text-center text-[11px] font-mono">{zoom}%</span>
        <button
          onClick={() => setZoom((z) => Math.min(200, z + 15))}
          className="p-1 hover:bg-slate-100 rounded-full text-slate-600 transition"
          title="Aumentar Zoom"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <div className="h-3 w-px bg-slate-200" />
        <button
          onClick={() => setZoom(100)}
          className="p-1 hover:bg-slate-100 rounded-full text-slate-600 transition"
          title="Zoom 100%"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Identificador da Página Flutuante */}
      <div className="mb-4 flex items-center space-x-2 text-xs font-medium text-slate-500">
        <span className="bg-white px-2.5 py-1 rounded-full border border-slate-200 shadow-2xs">
          {pagina.titulo || 'Página Atual'}
        </span>
        <span>•</span>
        <span>{larguraMm} × {alturaMm} mm</span>
      </div>

      {/* A Folha de Papel (Canvas) */}
      <div
        className="relative bg-white shadow-2xl rounded-sm transition-all duration-75 overflow-hidden border border-slate-300/40"
        style={{
          width: `${larguraPx}px`,
          height: `${alturaPx}px`,
          backgroundColor: pagina.cor_fundo?.hex || '#FFFFFF',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Renderização dos Elementos Visuais */}
        {pagina.elementos.map((elem) => {
          const selecionado = elem.id === elementoSelecionadoId;
          const left = elem.x * escalaBase;
          const top = elem.y * escalaBase;
          const width = elem.largura * escalaBase;
          const height = elem.altura * escalaBase;

          return (
            <div
              key={elem.id}
              onClick={(e) => {
                e.stopPropagation();
                onSelecionarElemento(elem.id);
              }}
              className={`absolute cursor-pointer transition-all ${
                selecionado
                  ? 'ring-2 ring-indigo-500 ring-offset-1 z-10'
                  : 'hover:ring-1 hover:ring-indigo-300'
              }`}
              style={{
                left: `${left}px`,
                top: `${top}px`,
                width: `${width}px`,
                height: `${height}px`,
                opacity: elem.opacidade,
                backgroundColor: elem.cor_fundo?.hex || 'transparent',
                borderColor: elem.cor_borda?.hex || 'transparent',
                borderWidth: elem.espessura_borda ? `${elem.espessura_borda * escalaBase}px` : '0',
                borderRadius: elem.raio_borda ? `${elem.raio_borda * escalaBase}px` : '0',
              }}
            >
              {/* Elemento de Texto */}
              {(elem.tipo === 'texto' || elem.tipo === 'caixa_texto') && (
                <div
                  className="w-full h-full flex items-center overflow-hidden px-1"
                  style={{
                    color: elem.cor_texto?.hex || '#1E293B',
                    fontSize: `${elem.tamanho_fonte * (escalaBase / 3)}px`,
                    fontWeight: elem.negrito ? 700 : 400,
                    fontStyle: elem.italico ? 'italic' : 'normal',
                    justifyContent:
                      elem.alinhamento === 'center'
                        ? 'center'
                        : elem.alinhamento === 'right'
                        ? 'flex-end'
                        : 'flex-start',
                  }}
                >
                  <span className="truncate">{elem.texto}</span>
                </div>
              )}

              {/* Elemento de Checkbox */}
              {elem.tipo === 'checkbox' && (
                <div className="w-full h-full flex items-center space-x-1.5 px-1">
                  <div className="w-3.5 h-3.5 rounded border border-slate-400 bg-white" />
                  {elem.texto && (
                    <span 
                      className="text-slate-600 truncate"
                      style={{ fontSize: `${(elem.tamanho_fonte || 8) * (escalaBase / 3)}px` }}
                    >
                      {elem.texto}
                    </span>
                  )}
                </div>
              )}

              {/* Indicador de Hyperlink Ativo */}
              {elem.destino_link && (
                <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-indigo-500 ring-1 ring-white" />
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
};
