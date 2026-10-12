import React, { useState, useRef, useEffect } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Move, 
  Plus, 
  Type, 
  Square, 
  Circle, 
  Minus, 
  CheckSquare,
  Eye,
  EyeOff,
  Link2,
  Sparkles,
  LayoutTemplate
} from 'lucide-react';
import { Pagina, Elemento, ConfiguracaoProjeto } from '../../types';
import { FloatingToolbar } from './FloatingToolbar';

interface InteractiveCanvasProps {
  pagina: Pagina | null;
  config: ConfiguracaoProjeto | null;
  elementoSelecionadoId: string | null;
  onSelecionarElemento: (id: string | null) => void;
  onAtualizarElemento: (atualizado: Elemento) => void;
  onDuplicarElemento: (elemento: Elemento) => void;
  onExcluirElemento: (id: string) => void;
  onAdicionarElemento: (tipo: 'texto' | 'retangulo' | 'circulo' | 'linha' | 'checkbox') => void;
  modoPrevia: boolean;
  onAlternarModoPrevia: () => void;
  onNavegarParaId: (idNavegacao: string) => void;
  onAbrirGaleriaModelos: () => void;
}

export const InteractiveCanvas: React.FC<InteractiveCanvasProps> = ({
  pagina,
  config,
  elementoSelecionadoId,
  onSelecionarElemento,
  onAtualizarElemento,
  onDuplicarElemento,
  onExcluirElemento,
  onAdicionarElemento,
  modoPrevia,
  onAlternarModoPrevia,
  onNavegarParaId,
  onAbrirGaleriaModelos,
}) => {
  const [zoom, setZoom] = useState<number>(100);
  const [editandoTextoId, setEditandoTextoId] = useState<string | null>(null);

  // Estados para Drag & Resize
  const [arrastandoId, setArrastandoId] = useState<string | null>(null);
  const [redimensionandoId, setRedimensionandoId] = useState<string | null>(null);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; elemX: number; elemY: number; elemW: number; elemH: number }>({
    mouseX: 0,
    mouseY: 0,
    elemX: 0,
    elemY: 0,
    elemW: 0,
    elemH: 0,
  });

  const canvasRef = useRef<HTMLDivElement>(null);

  // Dimensões da folha em mm
  const larguraMm = config?.largura_mm || 297;
  const alturaMm = config?.altura_mm || 210;

  // Escala para exibição na tela: 1mm = 3.2px no zoom 100%
  const escalaBase = 3.2 * (zoom / 100);
  const larguraPx = larguraMm * escalaBase;
  const alturaPx = alturaMm * escalaBase;

  // Handlers de Drag & Drop do Elemento
  const handleMouseDownElem = (e: React.MouseEvent, elem: Elemento) => {
    if (modoPrevia) {
      // Se estiver no modo prévia e o elemento tiver link, navega!
      if (elem.destino_link) {
        onNavegarParaId(elem.destino_link);
      }
      return;
    }

    e.stopPropagation();
    onSelecionarElemento(elem.id);

    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      elemX: elem.x,
      elemY: elem.y,
      elemW: elem.largura,
      elemH: elem.altura,
    };
    setArrastandoId(elem.id);
  };

  // Handler de Redimensionamento (Alça canto inferior direito)
  const handleMouseDownResize = (e: React.MouseEvent, elem: Elemento) => {
    e.stopPropagation();
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      elemX: elem.x,
      elemY: elem.y,
      elemW: elem.largura,
      elemH: elem.altura,
    };
    setRedimensionandoId(elem.id);
  };

  // Movimento global do mouse para arraste / resize
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!pagina || (!arrastandoId && !redimensionandoId)) return;

      const deltaXpx = e.clientX - dragStartRef.current.mouseX;
      const deltaYpx = e.clientY - dragStartRef.current.mouseY;

      // Converter pixels de deslocamento para milímetros
      const deltaXmm = deltaXpx / escalaBase;
      const deltaYmm = deltaYpx / escalaBase;

      if (arrastandoId) {
        const elem = pagina.elementos.find((el) => el.id === arrastandoId);
        if (!elem) return;

        const novoX = Math.max(0, Math.min(larguraMm - elem.largura, dragStartRef.current.elemX + deltaXmm));
        const novoY = Math.max(0, Math.min(alturaMm - elem.altura, dragStartRef.current.elemY + deltaYmm));

        onAtualizarElemento({
          ...elem,
          x: Math.round(novoX * 10) / 10,
          y: Math.round(novoY * 10) / 10,
        });
      } else if (redimensionandoId) {
        const elem = pagina.elementos.find((el) => el.id === redimensionandoId);
        if (!elem) return;

        const novaLarg = Math.max(5, dragStartRef.current.elemW + deltaXmm);
        const novaAlt = Math.max(4, dragStartRef.current.elemH + deltaYmm);

        onAtualizarElemento({
          ...elem,
          largura: Math.round(novaLarg * 10) / 10,
          altura: Math.round(novaAlt * 10) / 10,
        });
      }
    };

    const handleMouseUp = () => {
      setArrastandoId(null);
      setRedimensionandoId(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [arrastandoId, redimensionandoId, escalaBase, pagina, larguraMm, alturaMm]);

  if (!pagina || !config) {
    return (
      <main className="flex-1 bg-slate-100 flex items-center justify-center select-none p-6">
        <div className="text-center p-8 bg-white rounded-3xl border border-slate-200 shadow-sm max-w-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto">
            <LayoutTemplate className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">Nenhuma página selecionada</h3>
          <p className="text-xs text-slate-500">
            Selecione uma página na lista lateral ou adicione um novo modelo da galeria.
          </p>
          <button
            onClick={onAbrirGaleriaModelos}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition"
          >
            Adicionar Página
          </button>
        </div>
      </main>
    );
  }

  const elementoSelecionado = pagina.elementos.find((e) => e.id === elementoSelecionadoId) || null;

  return (
    <main
      className="flex-1 bg-slate-100/90 overflow-auto flex flex-col items-center justify-start p-8 relative select-none"
      onClick={() => {
        onSelecionarElemento(null);
        setEditandoTextoId(null);
      }}
    >
      {/* Barra Superior Flutuante: Ferramentas Rápidas de Inserção */}
      {!modoPrevia && (
        <div
          className="fixed top-20 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-slate-200/80 shadow-lg flex items-center space-x-1.5 z-20 text-xs text-slate-700 animate-fadeIn"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Inserir:</span>
          <button
            onClick={() => onAdicionarElemento('texto')}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-xl hover:bg-slate-100 transition font-medium"
            title="Adicionar Caixa de Texto"
          >
            <Type className="w-3.5 h-3.5 text-indigo-600" />
            <span>Texto</span>
          </button>
          <button
            onClick={() => onAdicionarElemento('retangulo')}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-xl hover:bg-slate-100 transition font-medium"
            title="Adicionar Retângulo"
          >
            <Square className="w-3.5 h-3.5 text-indigo-600" />
            <span>Retângulo</span>
          </button>
          <button
            onClick={() => onAdicionarElemento('circulo')}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-xl hover:bg-slate-100 transition font-medium"
            title="Adicionar Círculo"
          >
            <Circle className="w-3.5 h-3.5 text-indigo-600" />
            <span>Círculo</span>
          </button>
          <button
            onClick={() => onAdicionarElemento('linha')}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-xl hover:bg-slate-100 transition font-medium"
            title="Adicionar Linha Divisória"
          >
            <Minus className="w-3.5 h-3.5 text-indigo-600" />
            <span>Linha</span>
          </button>
          <button
            onClick={() => onAdicionarElemento('checkbox')}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-xl hover:bg-slate-100 transition font-medium"
            title="Adicionar Tarefa com Checkbox"
          >
            <CheckSquare className="w-3.5 h-3.5 text-indigo-600" />
            <span>Tarefa</span>
          </button>

          <div className="h-4 w-px bg-slate-200 mx-1" />

          <button
            onClick={onAbrirGaleriaModelos}
            className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Modelos Prontos</span>
          </button>
        </div>
      )}

      {/* Controles de Zoom & Modo Prévia Flutuantes no Canto Inferior Direito */}
      <div
        className="fixed bottom-6 right-84 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200/80 shadow-lg flex items-center space-x-2 text-xs font-semibold text-slate-700 z-20"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onAlternarModoPrevia}
          className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition flex items-center space-x-1 ${
            modoPrevia
              ? 'bg-indigo-600 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
          title="Alternar Modo Prévia (Testar hyperlinks clicáveis)"
        >
          {modoPrevia ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          <span>{modoPrevia ? 'Modo Prévia Ativo' : 'Prévia'}</span>
        </button>

        <div className="h-3.5 w-px bg-slate-200" />

        <button
          onClick={() => setZoom((z) => Math.max(40, z - 15))}
          className="p-1 hover:bg-slate-100 rounded-full text-slate-600 transition"
          title="Diminuir Zoom"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <span className="w-10 text-center text-[11px] font-mono">{zoom}%</span>
        <button
          onClick={() => setZoom((z) => Math.min(220, z + 15))}
          className="p-1 hover:bg-slate-100 rounded-full text-slate-600 transition"
          title="Aumentar Zoom"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setZoom(100)}
          className="p-1 hover:bg-slate-100 rounded-full text-slate-600 transition"
          title="Zoom 100%"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Identificador Flutuante da Página Atual */}
      <div className="mb-4 flex items-center space-x-2 text-xs font-medium text-slate-500">
        <span className="bg-white px-3 py-1 rounded-full border border-slate-200 shadow-2xs font-semibold text-slate-700">
          {pagina.titulo || 'Página Atual'}
        </span>
        {pagina.id_navegacao && (
          <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-mono text-[10px]">
            #{pagina.id_navegacao}
          </span>
        )}
        <span>•</span>
        <span>{larguraMm} × {alturaMm} mm</span>
        {modoPrevia && (
          <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[10px] font-bold">
            Cliques em Hyperlinks Habilitados
          </span>
        )}
      </div>

      {/* A Folha de Papel (Canvas com Dimensões Milimétricas Reais) */}
      <div
        ref={canvasRef}
        className="relative bg-white shadow-2xl rounded-xs transition-all duration-75 overflow-visible border border-slate-300/40"
        style={{
          width: `${larguraPx}px`,
          height: `${alturaPx}px`,
          backgroundColor: pagina.cor_fundo?.hex || '#FFFFFF',
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelecionarElemento(null);
          setEditandoTextoId(null);
        }}
      >
        {/* Renderização dos Elementos Visuais */}
        {pagina.elementos.map((elem) => {
          const selecionado = !modoPrevia && elem.id === elementoSelecionadoId;
          const left = elem.x * escalaBase;
          const top = elem.y * escalaBase;
          const width = elem.largura * escalaBase;
          const height = elem.altura * escalaBase;

          return (
            <div
              key={elem.id}
              onMouseDown={(e) => handleMouseDownElem(e, elem)}
              onDoubleClick={(e) => {
                e.stopPropagation();
                if (elem.tipo === 'texto' || elem.tipo === 'caixa_texto' || elem.tipo === 'checkbox') {
                  setEditandoTextoId(elem.id);
                }
              }}
              className={`absolute select-none transition-shadow ${
                modoPrevia
                  ? elem.destino_link
                    ? 'cursor-pointer hover:ring-2 hover:ring-indigo-400'
                    : 'cursor-default'
                  : selecionado
                  ? 'ring-2 ring-indigo-600 ring-offset-1 z-20 cursor-move'
                  : 'hover:ring-1 hover:ring-indigo-300 cursor-pointer'
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
                zIndex: elem.camada || 1,
              }}
            >
              {/* Barra Contextual Flutuante para o Elemento Selecionado */}
              {selecionado && (
                <FloatingToolbar
                  elemento={elem}
                  onAtualizarElemento={onAtualizarElemento}
                  onDuplicarElemento={onDuplicarElemento}
                  onExcluirElemento={onExcluirElemento}
                />
              )}

              {/* Alça de Redimensionamento no Canto Inferior Direito */}
              {selecionado && (
                <div
                  onMouseDown={(e) => handleMouseDownResize(e, elem)}
                  className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-indigo-600 border-2 border-white rounded-full shadow-sm cursor-nwse-resize z-30 hover:scale-125 transition-transform"
                />
              )}

              {/* Renderização: Texto e Caixa de Texto */}
              {(elem.tipo === 'texto' || elem.tipo === 'caixa_texto') && (
                <div
                  className="w-full h-full flex items-center overflow-hidden px-1 leading-tight"
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
                  {editandoTextoId === elem.id ? (
                    <input
                      type="text"
                      autoFocus
                      value={elem.texto}
                      onChange={(e) => onAtualizarElemento({ ...elem, texto: e.target.value })}
                      onBlur={() => setEditandoTextoId(null)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') setEditandoTextoId(null);
                      }}
                      className="w-full bg-white border border-indigo-400 outline-none px-1 text-slate-900 rounded font-sans"
                    />
                  ) : (
                    <span className="truncate">{elem.texto}</span>
                  )}
                </div>
              )}

              {/* Renderização: Checkbox / Tarefa */}
              {elem.tipo === 'checkbox' && (
                <div className="w-full h-full flex items-center space-x-1.5 px-1">
                  <div className="w-3.5 h-3.5 rounded border border-slate-400 bg-white shrink-0 flex items-center justify-center" />
                  <span
                    className="text-slate-700 truncate"
                    style={{ fontSize: `${(elem.tamanho_fonte || 8) * (escalaBase / 3)}px` }}
                  >
                    {elem.texto}
                  </span>
                </div>
              )}

              {/* Renderização: Forma Círculo */}
              {elem.tipo === 'forma' && elem.tipo_forma === 'circulo' && (
                <div
                  className="w-full h-full rounded-full"
                  style={{
                    backgroundColor: elem.cor_fundo?.hex || 'transparent',
                    borderColor: elem.cor_borda?.hex || '#94A3B8',
                    borderWidth: `${(elem.espessura_borda || 0.3) * escalaBase}px`,
                  }}
                />
              )}

              {/* Renderização: Linha Horizontal */}
              {elem.tipo === 'forma' && elem.tipo_forma === 'linha_horizontal' && (
                <div
                  className="w-full my-auto"
                  style={{
                    height: `${Math.max(1, (elem.espessura_borda || 0.4) * escalaBase)}px`,
                    backgroundColor: elem.cor_fundo?.hex || elem.cor_texto?.hex || '#CBD5E1',
                  }}
                />
              )}

              {/* Badge de Hyperlink Ativo */}
              {elem.destino_link && (
                <div
                  className={`absolute top-0 right-0 rounded-full flex items-center justify-center transition-all ${
                    modoPrevia
                      ? 'w-3 h-3 bg-indigo-600 text-white shadow-xs'
                      : 'w-2 h-2 bg-indigo-500 ring-1 ring-white'
                  }`}
                  title={`Hyperlink para: #${elem.destino_link}`}
                >
                  {modoPrevia && <Link2 className="w-2 h-2" />}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
};
