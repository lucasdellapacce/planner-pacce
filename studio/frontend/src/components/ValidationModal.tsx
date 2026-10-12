import React from 'react';
import { X, CheckCircle2, AlertTriangle, Link2 } from 'lucide-react';
import { RelatorioValidacaoResponse } from '../types';

interface ValidationModalProps {
  aberto: boolean;
  onFechar: () => void;
  relatorio: RelatorioValidacaoResponse | null;
}

export const ValidationModal: React.FC<ValidationModalProps> = ({
  aberto,
  onFechar,
  relatorio,
}) => {
  if (!aberto || !relatorio) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 w-full max-w-lg overflow-hidden flex flex-col max-h-[80vh]">
        {/* Cabeçalho */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            {relatorio.aprovado ? (
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            ) : (
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                <AlertTriangle className="w-5 h-5" />
              </div>
            )}
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                {relatorio.aprovado ? 'Navegação 100% Aprovada' : 'Problemas de Navegação Encontrados'}
              </h2>
              <p className="text-xs text-slate-500">
                {relatorio.total_validos} de {relatorio.total_hyperlinks} hyperlinks verificados com sucesso.
              </p>
            </div>
          </div>
          <button
            onClick={onFechar}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Estatísticas Rápidas */}
        <div className="grid grid-cols-3 gap-2 p-4 bg-slate-50 border-b border-slate-100 text-center">
          <div className="p-2.5 bg-white rounded-xl border border-slate-200/60">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Total</span>
            <span className="text-base font-extrabold text-slate-800">{relatorio.total_hyperlinks}</span>
          </div>
          <div className="p-2.5 bg-white rounded-xl border border-slate-200/60">
            <span className="text-[10px] text-emerald-600 font-bold uppercase block">Válidos</span>
            <span className="text-base font-extrabold text-emerald-600">{relatorio.total_validos}</span>
          </div>
          <div className="p-2.5 bg-white rounded-xl border border-slate-200/60">
            <span className="text-[10px] text-red-500 font-bold uppercase block">Inválidos</span>
            <span className="text-base font-extrabold text-red-500">{relatorio.total_invalidos}</span>
          </div>
        </div>

        {/* Lista de Problemas (se houver) */}
        <div className="p-5 overflow-y-auto flex-1 space-y-2">
          {relatorio.problemas.length === 0 ? (
            <div className="text-center py-6">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700">Todos os hyperlinks estão intactos!</p>
              <p className="text-[11px] text-slate-500 mt-1 max-w-xs mx-auto">
                Todos os destinos de meses, semanas, dias e índices foram resolvidos para páginas físicas válidas.
              </p>
            </div>
          ) : (
            relatorio.problemas.map((prob, i) => (
              <div
                key={i}
                className="p-3 rounded-xl border border-amber-200/80 bg-amber-50/50 text-xs flex items-start space-x-2.5"
              >
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-amber-900 block capitalize">
                    {prob.tipo.replace('_', ' ')}
                  </span>
                  <p className="text-[11px] text-amber-700 mt-0.5">{prob.descricao}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Rodapé */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onFechar}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition"
          >
            Fechar Relatório
          </button>
        </div>
      </div>
    </div>
  );
};
