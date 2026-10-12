import React, { useState } from 'react';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Calendar, 
  Layout, 
  Palette, 
  ListChecks, 
  Sparkles,
  Check
} from 'lucide-react';

interface WizardModalProps {
  aberto: boolean;
  onFechar: () => void;
  onCriar: (dados: any) => Promise<void>;
}

export const WizardModal: React.FC<WizardModalProps> = ({
  aberto,
  onFechar,
  onCriar,
}) => {
  const [etapa, setEtapa] = useState<number>(1);
  const [carregando, setCarregando] = useState<boolean>(false);

  // Estado do Formulário
  const [nome, setNome] = useState('Meu Planner 2026');
  const [descricao, setDescricao] = useState('Planner digital personalizado para Goodnotes');
  const [periodoTipo, setPeriodoTipo] = useState<'trimestre' | 'ano' | 'semestre' | 'personalizado'>('trimestre');
  const [dataInicio, setDataInicio] = useState('2026-10-01');
  const [dataFim, setDataFim] = useState('2026-12-31');
  const [formato, setFormato] = useState('a4_horizontal');
  const [corPrimaria, setCorPrimaria] = useState('#535DEB');
  const [corSecundaria, setCorSecundaria] = useState('#172B70');
  const [corFundoClaro, setCorFundoClaro] = useState('#F0EEFF');

  const secoesDisponiveis = [
    { id: 'capa', label: 'Capa Oficial', desc: 'Apresentação com título e período' },
    { id: 'indice', label: 'Índice Geral', desc: 'Navegação clicável para todas as seções' },
    { id: 'calendario_mensal', label: 'Calendários Mensais', desc: 'Visão de mês com feriados brasileiros' },
    { id: 'planejamento_semanal', label: 'Planejamento Semanal', desc: 'Grades semanais com time-blocking e notas' },
    { id: 'planejamento_diario', label: 'Planejamento Diário', desc: 'Páginas diárias completas para tarefas e rotinas' },
    { id: 'habitos', label: 'Rastreador de Hábitos', desc: 'Matriz mensal de tracking de hábitos' },
    { id: 'projetos', label: 'Planejamento de Projetos', desc: 'Blocos de gestão de entregas e metas' },
    { id: 'estudos', label: 'Cronograma de Estudos', desc: 'Tabela de acompanhamento de disciplinas' },
    { id: 'leitura', label: 'Rastreador de Leitura', desc: 'Cards de resenhas e livros concluídos' },
    { id: 'revisoes_mensais', label: 'Revisões Mensais', desc: 'Espaço para retrospectiva e metas futuras' },
    { id: 'paginas_livres', label: 'Páginas Livres', desc: 'Folhas pontilhadas padrão 5mm' },
  ];

  const [secoesSelecionadas, setSecoesSelecionadas] = useState<string[]>([
    'capa',
    'indice',
    'calendario_mensal',
    'planejamento_semanal',
    'planejamento_diario',
    'habitos',
    'projetos',
    'estudos',
    'leitura',
    'revisoes_mensais',
    'paginas_livres',
  ]);

  if (!aberto) return null;

  const toggleSecao = (id: string) => {
    setSecoesSelecionadas((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleSubmeter = async () => {
    setCarregando(true);
    try {
      await onCriar({
        nome,
        descricao,
        formato,
        idioma: 'pt-BR',
        primeiro_dia_semana: 0,
        incluir_feriados: true,
        data_inicio: dataInicio,
        data_fim: dataFim,
        cor_primaria: corPrimaria,
        cor_secundaria: corSecundaria,
        cor_fundo_claro: corFundoClaro,
        secoes: secoesSelecionadas,
      });
      onFechar();
    } catch (err) {
      alert('Erro ao gerar planner: ' + err);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Cabeçalho do Modal */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">
              Assistente de Criação • Etapa {etapa} de 4
            </span>
            <h2 className="text-lg font-bold text-slate-900 leading-tight">
              {etapa === 1 && 'Identificação do Planner'}
              {etapa === 2 && 'Período e Formato'}
              {etapa === 3 && 'Estilo Visual e Cores'}
              {etapa === 4 && 'Seções e Layouts'}
            </h2>
          </div>
          <button
            onClick={onFechar}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo da Etapa */}
        <div className="p-6 overflow-y-auto flex-1">
          {etapa === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nome do Planner
                </label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: PACCE Planner 2026"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Descrição ou Objetivo
                </label>
                <textarea
                  rows={3}
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Ex: Planner para estudos e trabalho no Goodnotes..."
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none resize-none"
                />
              </div>
            </div>
          )}

          {etapa === 2 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Formato da Folha
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setFormato('a4_horizontal')}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      formato === 'a4_horizontal'
                        ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="block font-bold text-xs text-slate-900">A4 Horizontal</span>
                    <span className="block text-[11px] text-slate-500 mt-0.5">297 × 210 mm (Ideal para iPad)</span>
                  </div>
                  <div
                    onClick={() => setFormato('a4_vertical')}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      formato === 'a4_vertical'
                        ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="block font-bold text-xs text-slate-900">A4 Vertical</span>
                    <span className="block text-[11px] text-slate-500 mt-0.5">210 × 297 mm (Retrato)</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Período Temporal
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Data Início</label>
                    <input
                      type="date"
                      value={dataInicio}
                      onChange={(e) => setDataInicio(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Data Fim</label>
                    <input
                      type="date"
                      value={dataFim}
                      onChange={(e) => setDataFim(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {etapa === 3 && (
            <div className="space-y-4">
              <span className="text-xs text-slate-500 block mb-2">
                Paleta Oficial Apple-like do PACCE Planner Studio:
              </span>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                  <div>
                    <span className="text-xs font-semibold text-slate-800 block">Cor Primária (Destaque)</span>
                    <span className="text-[11px] text-slate-500">{corPrimaria}</span>
                  </div>
                  <input
                    type="color"
                    value={corPrimaria}
                    onChange={(e) => setCorPrimaria(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border-0"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                  <div>
                    <span className="text-xs font-semibold text-slate-800 block">Azul Escuro (Títulos e Texto)</span>
                    <span className="text-[11px] text-slate-500">{corSecundaria}</span>
                  </div>
                  <input
                    type="color"
                    value={corSecundaria}
                    onChange={(e) => setCorSecundaria(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border-0"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                  <div>
                    <span className="text-xs font-semibold text-slate-800 block">Lavanda Clara (Fundos Suaves)</span>
                    <span className="text-[11px] text-slate-500">{corFundoClaro}</span>
                  </div>
                  <input
                    type="color"
                    value={corFundoClaro}
                    onChange={(e) => setCorFundoClaro(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border-0"
                  />
                </div>
              </div>
            </div>
          )}

          {etapa === 4 && (
            <div className="space-y-2">
              <span className="text-xs text-slate-500 block mb-2">
                Selecione as seções que farão parte do seu documento:
              </span>
              <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                {secoesDisponiveis.map((secao) => {
                  const ativa = secoesSelecionadas.includes(secao.id);
                  return (
                    <div
                      key={secao.id}
                      onClick={() => toggleSecao(secao.id)}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        ativa
                          ? 'border-indigo-500/80 bg-indigo-50/50'
                          : 'border-slate-200 hover:border-slate-300 opacity-60'
                      }`}
                    >
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">{secao.label}</span>
                        <span className="text-[11px] text-slate-500">{secao.desc}</span>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all ${
                          ativa
                            ? 'bg-indigo-600 border-indigo-600 text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {ativa && <Check className="w-3.5 h-3.5 stroke-3" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Rodapé e Botões de Navegação */}
        <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
          {etapa > 1 ? (
            <button
              onClick={() => setEtapa((e) => e - 1)}
              disabled={carregando}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-200/60 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar</span>
            </button>
          ) : <div />}

          {etapa < 4 ? (
            <button
              onClick={() => setEtapa((e) => e + 1)}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition"
            >
              <span>Avançar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleSubmeter}
              disabled={carregando}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#535DEB] to-[#172B70] shadow-md shadow-indigo-500/20 hover:opacity-95 transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>{carregando ? 'Gerando Páginas...' : 'Gerar Planner Completo'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
