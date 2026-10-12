import React from 'react';
import { ModeloPaginaDef } from './templateLibrary';
import { Paleta } from '../../types';

interface TemplateThumbnailProps {
  modelo: ModeloPaginaDef;
  paleta: Paleta;
  estilo: string;
  largura?: number;
  altura?: number;
  proporcaoHorizontal?: boolean;
}

export const TemplateThumbnail: React.FC<TemplateThumbnailProps> = ({
  modelo,
  paleta,
  estilo,
  largura = 220,
  altura = 150,
  proporcaoHorizontal = true,
}) => {
  // Simular página em mm (ex: A4 horizontal 297x210 ou vertical 210x297)
  const docW = proporcaoHorizontal ? 297 : 210;
  const docH = proporcaoHorizontal ? 210 : 297;

  // Gerar elementos do modelo
  const elementos = React.useMemo(() => {
    try {
      return modelo.gerarElementos(docW, docH, paleta, estilo);
    } catch {
      return [];
    }
  }, [modelo, docW, docH, paleta, estilo]);

  return (
    <div
      className="relative bg-white rounded-md overflow-hidden shadow-xs border border-slate-200/80 transition-transform duration-200 flex items-center justify-center select-none"
      style={{
        width: `${largura}px`,
        height: `${altura}px`,
      }}
    >
      <svg
        viewBox={`0 0 ${docW} ${docH}`}
        className="w-full h-full block"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Fundo da folha */}
        <rect x="0" y="0" width={docW} height={docH} fill="#FFFFFF" />

        {/* Renderização vetorial dos elementos do modelo */}
        {elementos.map((elem) => {
          if (!elem.visivel) return null;

          if (elem.tipo === 'texto') {
            return (
              <text
                key={elem.id}
                x={elem.x + (elem.alinhamento === 'center' ? elem.largura / 2 : elem.alinhamento === 'right' ? elem.largura - 1 : 1)}
                y={elem.y + elem.altura * 0.75}
                fill={elem.cor_texto?.hex || '#1E293B'}
                fontSize={elem.tamanho_fonte * 0.75}
                fontWeight={elem.negrito ? 'bold' : 'normal'}
                fontStyle={elem.italico ? 'italic' : 'normal'}
                textAnchor={elem.alinhamento === 'center' ? 'middle' : elem.alinhamento === 'right' ? 'end' : 'start'}
                className="select-none pointer-events-none"
                style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
              >
                {elem.texto}
              </text>
            );
          }

          if (elem.tipo === 'checkbox') {
            return (
              <g key={elem.id} className="pointer-events-none">
                <rect
                  x={elem.x}
                  y={elem.y + (elem.altura - 3.5) / 2}
                  width="3.5"
                  height="3.5"
                  rx="0.8"
                  fill="#FFFFFF"
                  stroke="#94A3B8"
                  strokeWidth="0.4"
                />
                {elem.texto && (
                  <text
                    x={elem.x + 5}
                    y={elem.y + (elem.altura - 3.5) / 2 + 2.8}
                    fill={elem.cor_texto?.hex || '#475569'}
                    fontSize={Math.max(elem.tamanho_fonte * 0.65, 3.5)}
                    style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
                  >
                    {elem.texto}
                  </text>
                )}
              </g>
            );
          }

          if (elem.tipo === 'forma') {
            if (elem.tipo_forma === 'circulo') {
              const r = Math.min(elem.largura, elem.altura) / 2;
              return (
                <circle
                  key={elem.id}
                  cx={elem.x + elem.largura / 2}
                  cy={elem.y + elem.altura / 2}
                  r={r}
                  fill={elem.cor_fundo?.hex || 'none'}
                  stroke={elem.cor_borda?.hex || elem.cor_texto?.hex || '#94A3B8'}
                  strokeWidth={elem.espessura_borda || 0.3}
                  opacity={elem.opacidade}
                />
              );
            }

            if (elem.tipo_forma === 'linha_horizontal') {
              return (
                <line
                  key={elem.id}
                  x1={elem.x}
                  y1={elem.y + elem.altura / 2}
                  x2={elem.x + elem.largura}
                  y2={elem.y + elem.altura / 2}
                  stroke={elem.cor_fundo?.hex || elem.cor_texto?.hex || '#CBD5E1'}
                  strokeWidth={elem.espessura_borda || 0.4}
                  opacity={elem.opacidade}
                />
              );
            }

            // Retângulo padrão
            return (
              <rect
                key={elem.id}
                x={elem.x}
                y={elem.y}
                width={elem.largura}
                height={elem.altura}
                rx={elem.raio_borda || 0}
                fill={elem.cor_fundo?.hex || 'none'}
                stroke={elem.cor_borda?.hex || 'none'}
                strokeWidth={elem.espessura_borda || 0}
                opacity={elem.opacidade}
              />
            );
          }

          return null;
        })}
      </svg>
    </div>
  );
};
