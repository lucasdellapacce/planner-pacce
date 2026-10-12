import React from 'react';
import { 
  Bold, 
  Italic, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Copy, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Type, 
  Palette, 
  Square,
  Lock,
  Unlock,
  Link2
} from 'lucide-react';
import { Elemento, Cor } from '../../types';

interface FloatingToolbarProps {
  elemento: Elemento;
  onAtualizarElemento: (atualizado: Elemento) => void;
  onDuplicarElemento: (elemento: Elemento) => void;
  onExcluirElemento: (id: string) => void;
}

export const FloatingToolbar: React.FC<FloatingToolbarProps> = ({
  elemento,
  onAtualizarElemento,
  onDuplicarElemento,
  onExcluirElemento,
}) => {
  const coresRapidas = [
    '#535DEB', // Índigo primário
    '#172B70', // Azul marinho
    '#1E293B', // Ardósia escuro
    '#64748B', // Cinza médio
    '#EF4444', // Vermelho
    '#10B981', // Verde esmeralda
    '#F59E0B', // Âmbar
    '#8B5CF6', // Roxo
    '#FFFFFF', // Branco
  ];

  const handleMudarCorTexto = (hex: string) => {
    onAtualizarElemento({
      ...elemento,
      cor_texto: { hex, opacidade: 1 },
    });
  };

  const handleMudarCorFundo = (hex: string) => {
    onAtualizarElemento({
      ...elemento,
      cor_fundo: { hex, opacidade: 1 },
    });
  };

  const handleCamada = (delta: number) => {
    onAtualizarElemento({
      ...elemento,
      camada: Math.max(0, elemento.camada + delta),
    });
  };

  return (
    <div 
      className="absolute -top-12 left-0 bg-white/95 backdrop-blur-md px-2 py-1.5 rounded-2xl border border-slate-200 shadow-xl flex items-center space-x-1 z-30 select-none animate-fadeIn"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Controles de Texto (se for elemento de texto ou checkbox) */}
      {(elemento.tipo === 'texto' || elemento.tipo === 'caixa_texto' || elemento.tipo === 'checkbox') && (
        <>
          <button
            onClick={() => onAtualizarElemento({ ...elemento, negrito: !elemento.negrito })}
            className={`p-1 rounded-lg transition ${
              elemento.negrito ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-600 hover:bg-slate-100'
            }`}
            title="Negrito"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onAtualizarElemento({ ...elemento, italico: !elemento.italico })}
            className={`p-1 rounded-lg transition ${
              elemento.italico ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-600 hover:bg-slate-100'
            }`}
            title="Itálico"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-px bg-slate-200 mx-0.5" />

          <button
            onClick={() => onAtualizarElemento({ ...elemento, alinhamento: 'left' })}
            className={`p-1 rounded-lg transition ${
              elemento.alinhamento === 'left' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'
            }`}
            title="Alinhar à Esquerda"
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onAtualizarElemento({ ...elemento, alinhamento: 'center' })}
            className={`p-1 rounded-lg transition ${
              elemento.alinhamento === 'center' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'
            }`}
            title="Alinhar ao Centro"
          >
            <AlignCenter className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onAtualizarElemento({ ...elemento, alinhamento: 'right' })}
            className={`p-1 rounded-lg transition ${
              elemento.alinhamento === 'right' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'
            }`}
            title="Alinhar à Direita"
          >
            <AlignRight className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-px bg-slate-200 mx-0.5" />
        </>
      )}

      {/* Seletor Rápido de Cor de Texto */}
      <div className="flex items-center space-x-0.5 px-1">
        {coresRapidas.slice(0, 5).map((hex) => (
          <button
            key={hex}
            onClick={() => handleMudarCorTexto(hex)}
            className="w-4 h-4 rounded-full border border-slate-300 hover:scale-110 transition-transform shadow-2xs"
            style={{ backgroundColor: hex }}
            title={`Cor: ${hex}`}
          />
        ))}
      </div>

      <div className="h-4 w-px bg-slate-200 mx-0.5" />

      {/* Camadas */}
      <button
        onClick={() => handleCamada(1)}
        className="p-1 rounded-lg text-slate-600 hover:bg-slate-100 transition"
        title="Trazer para Frente"
      >
        <ArrowUp className="w-3.5 h-3.5" />
      </button>

      <button
        onClick={() => handleCamada(-1)}
        className="p-1 rounded-lg text-slate-600 hover:bg-slate-100 transition"
        title="Enviar para Trás"
      >
        <ArrowDown className="w-3.5 h-3.5" />
      </button>

      {/* Duplicar */}
      <button
        onClick={() => onDuplicarElemento(elemento)}
        className="p-1 rounded-lg text-slate-600 hover:bg-slate-100 transition"
        title="Duplicar Objeto"
      >
        <Copy className="w-3.5 h-3.5" />
      </button>

      {/* Excluir */}
      <button
        onClick={() => onExcluirElemento(elemento.id)}
        className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
        title="Excluir Objeto"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
