import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { PageThumbnailsSidebar } from './features/navigation/PageThumbnailsSidebar';
import { InteractiveCanvas } from './features/editor/InteractiveCanvas';
import { PropertiesPanel } from './components/PropertiesPanel';
import { WizardModal } from './components/WizardModal';
import { ValidationModal } from './components/ValidationModal';
import { TemplateGalleryModal } from './features/templates/TemplateGalleryModal';
import { DashboardView } from './features/dashboard/DashboardView';
import { api, browserMode } from './services/api';
import { browserApi } from './services/browserApi';
import { ProjetoPlanner, ProjetoResumo, RelatorioValidacaoResponse, Elemento, Pagina } from './types';

export const App: React.FC = () => {
  const [projetos, setProjetos] = useState<ProjetoResumo[]>([]);
  const [projetoAtual, setProjetoAtual] = useState<ProjetoPlanner | null>(null);
  const [paginaSelecionadaId, setPaginaSelecionadaId] = useState<string>('');
  const [elementoSelecionadoId, setElementoSelecionadoId] = useState<string | null>(null);

  // Vistas e Modais
  const [visualizandoDashboard, setVisualizandoDashboard] = useState<boolean>(false);
  const [wizardAberto, setWizardAberto] = useState<boolean>(false);
  const [galeriaAberta, setGaleriaAberta] = useState<boolean>(false);
  const [validacaoAberta, setValidacaoAberta] = useState<boolean>(false);
  const [relatorioValidacao, setRelatorioValidacao] = useState<RelatorioValidacaoResponse | null>(null);
  const [salvando, setSalvando] = useState<boolean>(false);
  const [statusValidacao, setStatusValidacao] = useState<'none' | 'valid' | 'invalid'>('none');
  const [modoPrevia, setModoPrevia] = useState<boolean>(false);

  // Pilha de Histórico de Desfazer / Refazer (Undo / Redo)
  const [historicoDesfazer, setHistoricoDesfazer] = useState<ProjetoPlanner[]>([]);
  const [historicoRefazer, setHistoricoRefazer] = useState<ProjetoPlanner[]>([]);

  // Carregar lista inicial de projetos
  useEffect(() => {
    carregarListaProjetos();
  }, []);

  const carregarListaProjetos = async () => {
    try {
      const lista = await api.listarProjetos();
      setProjetos(lista);
      if (lista.length > 0 && !projetoAtual) {
        carregarProjeto(lista[0].id);
      } else if (lista.length === 0) {
        setVisualizandoDashboard(true);
      }
    } catch (err) {
      console.error('Falha ao listar projetos:', err);
    }
  };

  const carregarProjeto = async (id: string) => {
    try {
      const proj = await api.obterProjeto(id);
      setProjetoAtual(proj);
      if (proj.paginas.length > 0) {
        setPaginaSelecionadaId(proj.paginas[0].id);
      }
      setElementoSelecionadoId(null);
      setStatusValidacao('none');
      setHistoricoDesfazer([]);
      setHistoricoRefazer([]);
    } catch (err) {
      alert('Erro ao carregar projeto: ' + err);
    }
  };

  // Atualizador com registro de histórico para Undo / Redo
  const atualizarEstadoProjeto = useCallback((novoProjeto: ProjetoPlanner, registrarHistorico = true) => {
    if (!projetoAtual) return;
    if (registrarHistorico) {
      setHistoricoDesfazer((prev) => [projetoAtual, ...prev.slice(0, 20)]);
      setHistoricoRefazer([]);
    }
    setProjetoAtual(novoProjeto);
  }, [projetoAtual]);

  const handleDesfazer = () => {
    if (historicoDesfazer.length === 0 || !projetoAtual) return;
    const anterior = historicoDesfazer[0];
    setHistoricoDesfazer((prev) => prev.slice(1));
    setHistoricoRefazer((prev) => [projetoAtual, ...prev]);
    setProjetoAtual(anterior);
  };

  const handleRefazer = () => {
    if (historicoRefazer.length === 0 || !projetoAtual) return;
    const seguinte = historicoRefazer[0];
    setHistoricoRefazer((prev) => prev.slice(1));
    setHistoricoDesfazer((prev) => [projetoAtual, ...prev]);
    setProjetoAtual(seguinte);
  };

  const handleSalvar = async () => {
    if (!projetoAtual) return;
    setSalvando(true);
    try {
      await api.salvarProjeto(projetoAtual.id, projetoAtual);
      await carregarListaProjetos();
    } catch (err) {
      alert('Erro ao salvar projeto: ' + err);
    } finally {
      setSalvando(false);
    }
  };

  const handleValidar = async () => {
    if (!projetoAtual) return;
    try {
      await api.salvarProjeto(projetoAtual.id, projetoAtual);
      const rel = await api.validarProjeto(projetoAtual.id);
      setRelatorioValidacao(rel);
      setStatusValidacao(rel.aprovado ? 'valid' : 'invalid');
      setValidacaoAberta(true);
    } catch (err) {
      alert('Erro ao validar hyperlinks: ' + err);
    }
  };

  const handleExportarPdf = async (idProjeto?: string) => {
    const id = idProjeto || projetoAtual?.id;
    if (!id) return;
    setSalvando(true);
    try {
      if (projetoAtual?.id === id) await api.salvarProjeto(id, projetoAtual);
      await api.exportarPdf(id);
    } catch (err) {
      alert('Erro ao exportar PDF: ' + err);
    } finally { setSalvando(false); }
  };

  const handleBaixarAdesivos = async () => {
    setSalvando(true);
    try { await api.baixarAdesivos(); }
    catch (err) { alert('Erro ao baixar adesivos: ' + err); }
    finally { setSalvando(false); }
  };

  const handleCriarProjeto = async (dados: any) => {
    const novo = await api.criarProjeto(dados);
    await carregarListaProjetos();
    setProjetoAtual(novo);
    if (novo.paginas.length > 0) {
      setPaginaSelecionadaId(novo.paginas[0].id);
    }
    setVisualizandoDashboard(false);
  };

  const handleDuplicarProjeto = async (id: string) => {
    try {
      const copia = await api.duplicarProjeto(id);
      await carregarListaProjetos();
      setProjetoAtual(copia);
      if (copia.paginas.length > 0) {
        setPaginaSelecionadaId(copia.paginas[0].id);
      }
      setVisualizandoDashboard(false);
    } catch (err) {
      alert('Erro ao duplicar: ' + err);
    }
  };

  const handleExcluirProjeto = async (id: string) => {
    if (!confirm('Deseja realmente excluir este planner?')) return;
    try {
      await api.excluirProjeto(id);
      await carregarListaProjetos();
      if (projetoAtual?.id === id) {
        setProjetoAtual(null);
        setVisualizandoDashboard(true);
      }
    } catch (err) {
      alert('Erro ao excluir: ' + err);
    }
  };

  // Manipulação de Elementos
  const handleAtualizarElemento = (atualizado: Elemento) => {
    if (!projetoAtual) return;
    const paginasNovas = projetoAtual.paginas.map((p) => {
      if (p.id !== paginaSelecionadaId) return p;
      return {
        ...p,
        elementos: p.elementos.map((e) => (e.id === atualizado.id ? atualizado : e)),
      };
    });
    atualizarEstadoProjeto({
      ...projetoAtual,
      paginas: paginasNovas,
    });
  };

  const handleDuplicarElemento = (elemento: Elemento) => {
    if (!projetoAtual) return;
    const clone: Elemento = {
      ...elemento,
      id: 'elem_' + Math.random().toString(36).substring(2, 9),
      x: elemento.x + 5,
      y: elemento.y + 5,
      nome: `${elemento.nome || elemento.tipo} (Cópia)`,
    };
    const paginasNovas = projetoAtual.paginas.map((p) => {
      if (p.id !== paginaSelecionadaId) return p;
      return {
        ...p,
        elementos: [...p.elementos, clone],
      };
    });
    atualizarEstadoProjeto({
      ...projetoAtual,
      paginas: paginasNovas,
    });
    setElementoSelecionadoId(clone.id);
  };

  const handleExcluirElemento = (elemId: string) => {
    if (!projetoAtual) return;
    const paginasNovas = projetoAtual.paginas.map((p) => {
      if (p.id !== paginaSelecionadaId) return p;
      return {
        ...p,
        elementos: p.elementos.filter((e) => e.id !== elemId),
      };
    });
    atualizarEstadoProjeto({
      ...projetoAtual,
      paginas: paginasNovas,
    });
    setElementoSelecionadoId(null);
  };

  const handleAdicionarElemento = (tipo: 'texto' | 'retangulo' | 'circulo' | 'linha' | 'checkbox') => {
    if (!projetoAtual || !paginaSelecionadaId) return;
    const primary = projetoAtual.configuracao.paleta.primaria.hex;
    const sec = projetoAtual.configuracao.paleta.secundaria.hex;

    let novoElem: Elemento;
    const id = 'elem_' + Math.random().toString(36).substring(2, 9);

    switch (tipo) {
      case 'texto':
        novoElem = {
          id,
          tipo: 'texto',
          x: 30,
          y: 40,
          largura: 60,
          altura: 10,
          rotacao: 0,
          opacidade: 1,
          bloqueado: false,
          visivel: true,
          camada: 2,
          texto: 'Novo Bloco de Texto',
          cor_texto: { hex: sec, opacidade: 1 },
          espessura_borda: 0,
          raio_borda: 0,
          familia_fonte: 'Helvetica',
          tamanho_fonte: 12,
          negrito: false,
          italico: false,
          alinhamento: 'left',
          caminho_imagem: '',
          destino_link: '',
          filhos: [],
          nome: 'Texto',
          dados_extras: {},
        };
        break;
      case 'retangulo':
        novoElem = {
          id,
          tipo: 'forma',
          tipo_forma: 'retangulo',
          x: 30,
          y: 40,
          largura: 50,
          altura: 30,
          rotacao: 0,
          opacidade: 1,
          bloqueado: false,
          visivel: true,
          camada: 1,
          texto: '',
          cor_texto: { hex: sec, opacidade: 1 },
          cor_fundo: { hex: '#F0EEFF', opacidade: 1 },
          cor_borda: { hex: primary, opacidade: 1 },
          espessura_borda: 0.4,
          raio_borda: 3,
          familia_fonte: 'Helvetica',
          tamanho_fonte: 8,
          negrito: false,
          italico: false,
          alinhamento: 'center',
          caminho_imagem: '',
          destino_link: '',
          filhos: [],
          nome: 'Retângulo',
          dados_extras: {},
        };
        break;
      case 'circulo':
        novoElem = {
          id,
          tipo: 'forma',
          tipo_forma: 'circulo',
          x: 40,
          y: 40,
          largura: 25,
          altura: 25,
          rotacao: 0,
          opacidade: 1,
          bloqueado: false,
          visivel: true,
          camada: 1,
          texto: '',
          cor_texto: { hex: primary, opacidade: 1 },
          cor_fundo: { hex: '#FFFFFF', opacidade: 1 },
          cor_borda: { hex: primary, opacidade: 1 },
          espessura_borda: 0.5,
          raio_borda: 12.5,
          familia_fonte: 'Helvetica',
          tamanho_fonte: 8,
          negrito: false,
          italico: false,
          alinhamento: 'center',
          caminho_imagem: '',
          destino_link: '',
          filhos: [],
          nome: 'Círculo',
          dados_extras: {},
        };
        break;
      case 'linha':
        novoElem = {
          id,
          tipo: 'forma',
          tipo_forma: 'linha_horizontal',
          x: 20,
          y: 45,
          largura: 100,
          altura: 1,
          rotacao: 0,
          opacidade: 0.7,
          bloqueado: false,
          visivel: true,
          camada: 1,
          texto: '',
          cor_texto: { hex: '#CBD5E1', opacidade: 1 },
          cor_fundo: { hex: '#CBD5E1', opacidade: 1 },
          espessura_borda: 0.3,
          raio_borda: 0,
          familia_fonte: 'Helvetica',
          tamanho_fonte: 8,
          negrito: false,
          italico: false,
          alinhamento: 'left',
          caminho_imagem: '',
          destino_link: '',
          filhos: [],
          nome: 'Linha',
          dados_extras: {},
        };
        break;
      case 'checkbox':
        novoElem = {
          id,
          tipo: 'checkbox',
          x: 30,
          y: 40,
          largura: 65,
          altura: 7,
          rotacao: 0,
          opacidade: 1,
          bloqueado: false,
          visivel: true,
          camada: 2,
          texto: 'Nova tarefa a realizar',
          cor_texto: { hex: sec, opacidade: 1 },
          espessura_borda: 0,
          raio_borda: 0,
          familia_fonte: 'Helvetica',
          tamanho_fonte: 8.5,
          negrito: false,
          italico: false,
          alinhamento: 'left',
          caminho_imagem: '',
          destino_link: '',
          filhos: [],
          nome: 'Tarefa Checkbox',
          dados_extras: {},
        };
        break;
    }

    const paginasNovas = projetoAtual.paginas.map((p) => {
      if (p.id !== paginaSelecionadaId) return p;
      return {
        ...p,
        elementos: [...p.elementos, novoElem],
      };
    });
    atualizarEstadoProjeto({
      ...projetoAtual,
      paginas: paginasNovas,
    });
    setElementoSelecionadoId(novoElem.id);
  };

  // Manipulação de Páginas
  const handleMoverPagina = (id: string, direcao: 'cima' | 'baixo') => {
    if (!projetoAtual) return;
    const index = projetoAtual.paginas.findIndex((p) => p.id === id);
    if (index === -1) return;
    if (direcao === 'cima' && index === 0) return;
    if (direcao === 'baixo' && index === projetoAtual.paginas.length - 1) return;

    const novas = [...projetoAtual.paginas];
    const targetIdx = direcao === 'cima' ? index - 1 : index + 1;
    const temp = novas[index];
    novas[index] = novas[targetIdx];
    novas[targetIdx] = temp;

    novas.forEach((p, idx) => {
      p.ordem = idx;
    });

    atualizarEstadoProjeto({
      ...projetoAtual,
      paginas: novas,
    });
  };

  const handleDuplicarPagina = (id: string) => {
    if (!projetoAtual) return;
    const orig = projetoAtual.paginas.find((p) => p.id === id);
    if (!orig) return;

    const nova: Pagina = {
      ...orig,
      id: 'page_' + Math.random().toString(36).substring(2, 9),
      titulo: `${orig.titulo} (Cópia)`,
      id_navegacao: orig.id_navegacao ? `${orig.id_navegacao}_copia` : '',
      elementos: orig.elementos.map((e) => ({
        ...e,
        id: 'elem_' + Math.random().toString(36).substring(2, 9),
      })),
    };

    const index = projetoAtual.paginas.findIndex((p) => p.id === id);
    const novas = [...projetoAtual.paginas];
    novas.splice(index + 1, 0, nova);

    novas.forEach((p, idx) => {
      p.ordem = idx;
    });

    atualizarEstadoProjeto({
      ...projetoAtual,
      paginas: novas,
    });
    setPaginaSelecionadaId(nova.id);
  };

  const handleExcluirPagina = (id: string) => {
    if (!projetoAtual || projetoAtual.paginas.length <= 1) return;
    if (!confirm('Deseja excluir esta página?')) return;

    const novas = projetoAtual.paginas.filter((p) => p.id !== id);
    novas.forEach((p, idx) => {
      p.ordem = idx;
    });

    atualizarEstadoProjeto({
      ...projetoAtual,
      paginas: novas,
    });

    if (paginaSelecionadaId === id && novas.length > 0) {
      setPaginaSelecionadaId(novas[0].id);
    }
  };

  const handleRenomearPagina = (id: string, novoTitulo: string) => {
    if (!projetoAtual) return;
    const novas = projetoAtual.paginas.map((p) => (p.id === id ? { ...p, titulo: novoTitulo } : p));
    atualizarEstadoProjeto({
      ...projetoAtual,
      paginas: novas,
    });
  };

  const handleInserirPaginaModelo = (novaPagina: Pagina) => {
    if (!projetoAtual) return;
    novaPagina.ordem = projetoAtual.paginas.length;
    const novas = [...projetoAtual.paginas, novaPagina];

    atualizarEstadoProjeto({
      ...projetoAtual,
      paginas: novas,
    });
    setPaginaSelecionadaId(novaPagina.id);
  };

  const handleAdicionarPaginaBranco = () => {
    if (!projetoAtual) return;
    const nova: Pagina = {
      id: 'page_' + Math.random().toString(36).substring(2, 9),
      tipo: 'pagina_lisa',
      titulo: `Página Lisa ${projetoAtual.paginas.length + 1}`,
      subtitulo: '',
      elementos: [],
      template_id: 'pagina_lisa',
      data_referencia: '',
      mes_referencia: 0,
      ano_referencia: 0,
      semana_referencia: 0,
      id_navegacao: 'p_' + Math.random().toString(36).substring(2, 6),
      cor_fundo: { hex: '#FFFFFF', opacidade: 1 },
      margens: { topo: 10, base: 10, esquerda: 10, direita: 10 },
      ordem: projetoAtual.paginas.length,
      secao: 'livres',
    };
    const novas = [...projetoAtual.paginas, nova];
    atualizarEstadoProjeto({
      ...projetoAtual,
      paginas: novas,
    });
    setPaginaSelecionadaId(nova.id);
  };

  const handleNavegarParaId = (idNavegacao: string) => {
    if (!projetoAtual) return;
    const pag = projetoAtual.paginas.find((p) => p.id_navegacao === idNavegacao);
    if (pag) {
      setPaginaSelecionadaId(pag.id);
      setElementoSelecionadoId(null);
    }
  };

  const paginaAtual = projetoAtual?.paginas.find((p) => p.id === paginaSelecionadaId) || null;
  const elementoAtual = paginaAtual?.elementos.find((e) => e.id === elementoSelecionadoId) || null;

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-100 font-sans">
      {browserMode && <div className="flex items-center justify-between gap-3 bg-indigo-50 px-4 py-2 text-xs text-indigo-900">
        <span>Seus planners ficam neste navegador. A primeira geração pode levar alguns segundos.</span>
        <div className="flex gap-3 shrink-0">
          <button disabled={!projetoAtual} onClick={async () => {
            if (!projetoAtual) return;
            try { await api.salvarProjeto(projetoAtual.id, projetoAtual); await api.exportarBackup(projetoAtual.id); }
            catch (err) { alert(String(err)); }
          }}>Baixar projeto</button>
          <label className="cursor-pointer">Importar projeto<input type="file" accept=".json,application/json" className="hidden" onChange={async e => {
            const file=e.target.files?.[0]; if(!file) return;
            try { const project=await browserApi.importarBackup(file); await carregarListaProjetos(); await carregarProjeto(project.id); setVisualizandoDashboard(false); }
            catch (err) { alert(String(err)); } finally { e.target.value=''; }
          }} /></label>
        </div>
      </div>}
      {/* Header Superior */}
      <Header
        nomeProjeto={projetoAtual?.nome || ''}
        onSalvar={handleSalvar}
        onAbrirWizard={() => setWizardAberto(true)}
        onAbrirGaleriaModelos={() => setGaleriaAberta(true)}
        onAlternarDashboard={() => setVisualizandoDashboard(!visualizandoDashboard)}
        visualizandoDashboard={visualizandoDashboard}
        onDesfazer={handleDesfazer}
        onRefazer={handleRefazer}
        podeDesfazer={historicoDesfazer.length > 0}
        podeRefazer={historicoRefazer.length > 0}
        onValidar={handleValidar}
        onExportarPdf={() => handleExportarPdf()}
        onBaixarAdesivos={handleBaixarAdesivos}
        salvando={salvando}
        statusValidacao={statusValidacao}
        totalPaginas={projetoAtual?.paginas.length || 0}
      />

      {/* Área Central: Dashboard OU Estúdio (Sidebar + Canvas + PropertiesPanel) */}
      {visualizandoDashboard ? (
        <DashboardView
          projetos={projetos}
          projetoAtivoId={projetoAtual?.id || ''}
          onSelecionarProjeto={carregarProjeto}
          onAbrirWizard={() => setWizardAberto(true)}
          onAbrirGaleriaModelos={() => setGaleriaAberta(true)}
          onDuplicarProjeto={handleDuplicarProjeto}
          onExcluirProjeto={handleExcluirProjeto}
          onExportarPdf={handleExportarPdf}
          onEntrarEditor={() => setVisualizandoDashboard(false)}
          paletaPadrao={
            projetoAtual?.configuracao.paleta || {
              nome: 'Padrão',
              primaria: { hex: '#535DEB', opacidade: 1 },
              secundaria: { hex: '#172B70', opacidade: 1 },
              fundo_claro: { hex: '#F0EEFF', opacidade: 1 },
              fundo_medio: { hex: '#DDE2FF', opacidade: 1 },
              fundo: { hex: '#FFFFFF', opacidade: 1 },
              texto: { hex: '#172B70', opacidade: 1 },
              texto_claro: { hex: '#535DEB', opacidade: 1 },
              destaque: { hex: '#535DEB', opacidade: 1 },
            }
          }
        />
      ) : (
        <div className="flex flex-1 overflow-hidden">
          <PageThumbnailsSidebar
            paginas={projetoAtual?.paginas || []}
            paginaSelecionadaId={paginaSelecionadaId}
            onSelecionarPagina={(id) => {
              setPaginaSelecionadaId(id);
              setElementoSelecionadoId(null);
            }}
            onMoverPagina={handleMoverPagina}
            onDuplicarPagina={handleDuplicarPagina}
            onExcluirPagina={handleExcluirPagina}
            onRenomearPagina={handleRenomearPagina}
            onAbrirGaleriaModelos={() => setGaleriaAberta(true)}
            onAdicionarPaginaBranco={handleAdicionarPaginaBranco}
            projetos={projetos}
            projetoAtualId={projetoAtual?.id || ''}
            onCarregarProjeto={carregarProjeto}
            paleta={
              projetoAtual?.configuracao.paleta || {
                nome: 'Padrão',
                primaria: { hex: '#535DEB', opacidade: 1 },
                secundaria: { hex: '#172B70', opacidade: 1 },
                fundo_claro: { hex: '#F0EEFF', opacidade: 1 },
                fundo_medio: { hex: '#DDE2FF', opacidade: 1 },
                fundo: { hex: '#FFFFFF', opacidade: 1 },
                texto: { hex: '#172B70', opacidade: 1 },
                texto_claro: { hex: '#535DEB', opacidade: 1 },
                destaque: { hex: '#535DEB', opacidade: 1 },
              }
            }
          />

          <InteractiveCanvas
            pagina={paginaAtual}
            config={projetoAtual?.configuracao || null}
            elementoSelecionadoId={elementoSelecionadoId}
            onSelecionarElemento={setElementoSelecionadoId}
            onAtualizarElemento={handleAtualizarElemento}
            onDuplicarElemento={handleDuplicarElemento}
            onExcluirElemento={handleExcluirElemento}
            onAdicionarElemento={handleAdicionarElemento}
            modoPrevia={modoPrevia}
            onAlternarModoPrevia={() => setModoPrevia(!modoPrevia)}
            onNavegarParaId={handleNavegarParaId}
            onAbrirGaleriaModelos={() => setGaleriaAberta(true)}
          />

          <PropertiesPanel
            elemento={elementoAtual}
            pagina={paginaAtual}
            onAtualizarElemento={handleAtualizarElemento}
            onExcluirElemento={handleExcluirElemento}
            todasPaginas={projetoAtual?.paginas || []}
          />
        </div>
      )}

      {/* Modais */}
      <WizardModal
        aberto={wizardAberto}
        onFechar={() => setWizardAberto(false)}
        onCriar={handleCriarProjeto}
      />

      <TemplateGalleryModal
        aberto={galeriaAberta}
        onFechar={() => setGaleriaAberta(false)}
        paleta={
          projetoAtual?.configuracao.paleta || {
            nome: 'Padrão',
            primaria: { hex: '#535DEB', opacidade: 1 },
            secundaria: { hex: '#172B70', opacidade: 1 },
            fundo_claro: { hex: '#F0EEFF', opacidade: 1 },
            fundo_medio: { hex: '#DDE2FF', opacidade: 1 },
            fundo: { hex: '#FFFFFF', opacidade: 1 },
            texto: { hex: '#172B70', opacidade: 1 },
            texto_claro: { hex: '#535DEB', opacidade: 1 },
            destaque: { hex: '#535DEB', opacidade: 1 },
          }
        }
        larguraMm={projetoAtual?.configuracao.largura_mm || 297}
        alturaMm={projetoAtual?.configuracao.altura_mm || 210}
        onInserirPaginaModelo={handleInserirPaginaModelo}
      />

      <ValidationModal
        aberto={validacaoAberta}
        onFechar={() => setValidacaoAberta(false)}
        relatorio={relatorioValidacao}
      />
    </div>
  );
};

