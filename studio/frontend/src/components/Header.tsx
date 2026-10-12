import React from 'react';
import { 
  Save, 
  Download, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  LayoutTemplate,
  Home,
  RotateCcw,
  RotateCw,
  Image as ImageIcon
} from 'lucide-react';

interface HeaderProps {
  nomeProjeto: string;
  onSalvar: () => void;
  onAbrirWizard: () => void;
  onAbrirGaleriaModelos?: () => void;
  onAlternarDashboard?: () => void;
  visualizandoDashboard?: boolean;
  onDesfazer?: () => void;
  onRefazer?: () => void;
  podeDesfazer?: boolean;
  podeRefazer?: boolean;
  onValidar: () => void;
  onExportarPdf: () => void;
  onBaixarAdesivos: () => void;
  salvando: boolean;
  statusValidacao: 'none' | 'valid' | 'invalid';
  totalPaginas: number;
}

export const Header: React.FC<HeaderProps> = ({
  nomeProjeto,
  onSalvar,
  onAbrirWizard,
  onAbrirGaleriaModelos,
  onAlternarDashboard,
  visualizandoDashboard = false,
  onDesfazer,
  onRefazer,
  podeDesfazer = false,
  podeRefazer = false,
  onValidar,
  onExportarPdf,
  onBaixarAdesivos,
  salvando,
  statusValidacao,
  totalPaginas,
}) => {
  return (
    <header className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-6 flex items-center justify-between z-20 select-none">
      {/* Lado Esquerdo: Logo & Navegação Dashboard / Estúdio */}
      <div className="flex items-center space-x-4">
        <div 
          onClick={onAlternarDashboard}
          className="flex items-center space-x-2.5 cursor-pointer group"
          title="Ir para a Tela Inicial"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#172B70] to-[#535DEB] flex items-center justify-center text-white font-bold text-lg shadow-sm shadow-[#535DEB]/30 group-hover:scale-105 transition-transform">
            P
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-sm tracking-tight text-slate-900">PACCE</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100/80">Studio</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Digital Planner Studio</p>
          </div>
        </div>

        <div className="h-6 w-px bg-slate-200" />

        {/* Botão de Alternar Vista */}
        {onAlternarDashboard && (
          <button
            onClick={onAlternarDashboard}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              visualizandoDashboard
                ? 'bg-indigo-50 text-indigo-900 border border-indigo-200'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Home className="w-3.5 h-3.5 text-indigo-600" />
            <span>{visualizandoDashboard ? 'No Início' : 'Tela Inicial'}</span>
          </button>
        )}

        <div className="flex flex-col">
          <h1 className="text-sm font-semibold text-slate-800 leading-tight">
            {nomeProjeto || 'Carregando projeto...'}
          </h1>
          <span className="text-[11px] text-slate-400">
            {totalPaginas > 0 ? `${totalPaginas} páginas catalogadas` : 'Nenhum projeto selecionado'}
          </span>
        </div>
      </div>

      {/* Centro: Ações de Edição (Desfazer, Refazer, Salvar, Validar) */}
      <div className="flex items-center space-x-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
        <button 
          onClick={onDesfazer}
          disabled={!podeDesfazer}
          title="Desfazer (Ctrl+Z)" 
          className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white transition-all shadow-none hover:shadow-xs disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button 
          onClick={onRefazer}
          disabled={!podeRefazer}
          title="Refazer (Ctrl+Y)" 
          className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white transition-all shadow-none hover:shadow-xs disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <RotateCw className="w-4 h-4" />
        </button>
        <div className="h-4 w-px bg-slate-300 mx-1" />
        <button
          onClick={onSalvar}
          disabled={salvando}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-white transition-all shadow-none hover:shadow-xs"
        >
          <Save className="w-3.5 h-3.5 text-indigo-600" />
          <span>{salvando ? 'Salvando...' : 'Salvar'}</span>
        </button>
        <button
          onClick={onValidar}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-white transition-all shadow-none hover:shadow-xs"
        >
          {statusValidacao === 'valid' ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          ) : statusValidacao === 'invalid' ? (
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
          ) : (
            <Sparkles className="w-3.5 h-3.5 text-slate-400" />
          )}
          <span>Validar Links</span>
        </button>
      </div>

      {/* Lado Direito: Ações Principais & Exportação */}
      <div className="flex items-center space-x-2">
        {onAbrirGaleriaModelos && (
          <button
            onClick={onAbrirGaleriaModelos}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/60 shadow-2xs transition-all"
            title="Abrir Galeria de Modelos de Páginas"
          >
            <LayoutTemplate className="w-4 h-4 text-indigo-600" />
            <span>Modelos</span>
          </button>
        )}

        <button
          onClick={onAbrirWizard}
          className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs transition-all hover:border-slate-300"
        >
          <Plus className="w-4 h-4 text-indigo-600" />
          <span>Novo Planner</span>
        </button>

        <button
          onClick={onBaixarAdesivos}
          title="Baixar pacote oficial de adesivos Goodnotes"
          className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs transition-all"
        >
          <ImageIcon className="w-4 h-4 text-indigo-500" />
          <span>Stickers ZIP</span>
        </button>

        <button
          onClick={onExportarPdf}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#535DEB] to-[#172B70] hover:opacity-95 shadow-md shadow-indigo-500/25 active:scale-[0.98] transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Exportar PDF</span>
        </button>
      </div>
    </header>
  );
};

