import { Pagina, Elemento, Paleta, Cor } from '../../types';

export interface ModeloPaginaDef {
  id: string;
  nome: string;
  categoria: 'calendarios' | 'organizacao' | 'estudos' | 'leitura' | 'livres' | 'capas_indices';
  descricao: string;
  icone: string;
  estilosSuportados: string[];
  gerarElementos: (larg: number, alt: number, paleta: Paleta, estilo: string) => Elemento[];
}

// Helpers para criação rápida de cores
const corHex = (hex: string, opacidade = 1): Cor => ({ hex, opacidade });

export const ESTILOS_VISUAIS = [
  { id: 'apple', nome: 'Apple-like', desc: 'Minimalismo sofisticado, cinzas neutros e cantos suaves' },
  { id: 'minimalista', nome: 'Minimalista', desc: 'Linhas puras, muito respiro e contraste elegante' },
  { id: 'editorial', nome: 'Editorial', desc: 'Tipografia expressiva e títulos marcantes de revista' },
  { id: 'executivo', nome: 'Executivo', desc: 'Azul-marinho sério, dados claros e blocos sóbrios' },
  { id: 'pastel', nome: 'Pastel Lavanda', desc: 'Tons acolhedores de lavanda, lilás e creme' },
  { id: 'elegante', nome: 'Elegante', desc: 'Dourado suave, grafite e detalhes refinados' },
  { id: 'dark', nome: 'Dark Mode', desc: 'Fundo escuro ardósia com tipografia nítida e luminosa' },
  { id: 'moderno', nome: 'Geométrico', desc: 'Formas dinâmicas, cores contemporâneas e blocos visuais' },
];

export const CATEGORIAS_MODELOS = [
  { id: 'todos', nome: 'Todos os Modelos' },
  { id: 'calendarios', nome: 'Calendários' },
  { id: 'organizacao', nome: 'Organização' },
  { id: 'estudos', nome: 'Estudos' },
  { id: 'leitura', nome: 'Leitura' },
  { id: 'livres', nome: 'Páginas Livres' },
  { id: 'capas_indices', nome: 'Capas & Índices' },
];

// Helper para gerar ID único local
const novoId = () => 'elem_' + Math.random().toString(36).substring(2, 9);

export const BIBLIOTECA_MODELOS: ModeloPaginaDef[] = [
  // ── 1. CALENDÁRIOS ─────────────────────────────────────────────
  {
    id: 'mensal_classico',
    nome: 'Mensal Clássico',
    categoria: 'calendarios',
    descricao: 'Grade mensal completa de 7 colunas com área lateral para metas e prioridades.',
    icone: 'Calendar',
    estilosSuportados: ['apple', 'minimalista', 'executivo', 'pastel'],
    gerarElementos: (w, h, paleta, estilo) => {
      const elems: Elemento[] = [];
      const primary = paleta.primaria.hex;
      const sec = paleta.secundaria.hex;
      const bgLight = paleta.fundo_claro.hex;

      // Cabeçalho
      elems.push({
        id: novoId(),
        tipo: 'texto',
        x: 15,
        y: 12,
        largura: 100,
        altura: 12,
        rotacao: 0,
        opacidade: 1,
        bloqueado: false,
        visivel: true,
        camada: 1,
        texto: 'PLANEJAMENTO MENSAL',
        cor_texto: corHex(sec),
        espessura_borda: 0,
        raio_borda: 0,
        familia_fonte: 'Helvetica',
        tamanho_fonte: 16,
        negrito: true,
        italico: false,
        alinhamento: 'left',
        caminho_imagem: '',
        destino_link: '',
        filhos: [],
        nome: 'Título do Mês',
        dados_extras: {},
      });

      // Grade dos dias da semana
      const dias = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB', 'DOM'];
      const gridW = w * 0.7;
      const colW = gridW / 7;
      const startX = 15;
      const startY = 28;

      dias.forEach((dia, i) => {
        elems.push({
          id: novoId(),
          tipo: 'forma',
          tipo_forma: 'retangulo',
          x: startX + i * colW,
          y: startY,
          largura: colW - 1,
          altura: 7,
          rotacao: 0,
          opacidade: 1,
          bloqueado: false,
          visivel: true,
          camada: 0,
          texto: '',
          cor_texto: corHex('#FFFFFF'),
          cor_fundo: corHex(primary),
          espessura_borda: 0,
          raio_borda: 1.5,
          familia_fonte: 'Helvetica',
          tamanho_fonte: 8,
          negrito: true,
          italico: false,
          alinhamento: 'center',
          caminho_imagem: '',
          destino_link: '',
          filhos: [],
          nome: `Dia Sem Header ${dia}`,
          dados_extras: {},
        });
        elems.push({
          id: novoId(),
          tipo: 'texto',
          x: startX + i * colW,
          y: startY + 1,
          largura: colW - 1,
          altura: 5,
          rotacao: 0,
          opacidade: 1,
          bloqueado: false,
          visivel: true,
          camada: 1,
          texto: dia,
          cor_texto: corHex('#FFFFFF'),
          espessura_borda: 0,
          raio_borda: 0,
          familia_fonte: 'Helvetica',
          tamanho_fonte: 7,
          negrito: true,
          italico: false,
          alinhamento: 'center',
          caminho_imagem: '',
          destino_link: '',
          filhos: [],
          nome: `Texto Header ${dia}`,
          dados_extras: {},
        });
      });

      // Células da grade (5 semanas x 7 dias)
      const cellH = (h - 45) / 5;
      for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 7; col++) {
          elems.push({
            id: novoId(),
            tipo: 'forma',
            tipo_forma: 'retangulo',
            x: startX + col * colW,
            y: startY + 8 + row * cellH,
            largura: colW - 1,
            altura: cellH - 1.5,
            rotacao: 0,
            opacidade: 1,
            bloqueado: false,
            visivel: true,
            camada: 0,
            texto: '',
            cor_texto: corHex(sec),
            cor_fundo: corHex('#FFFFFF'),
            cor_borda: corHex('#CBD5E1'),
            espessura_borda: 0.25,
            raio_borda: 1.5,
            familia_fonte: 'Helvetica',
            tamanho_fonte: 8,
            negrito: false,
            italico: false,
            alinhamento: 'left',
            caminho_imagem: '',
            destino_link: '',
            filhos: [],
            nome: `Célula Dia ${row}-${col}`,
            dados_extras: {},
          });
        }
      }

      // Painel lateral: Metas do Mês
      const sideX = startX + gridW + 4;
      const sideW = w - sideX - 15;

      elems.push({
        id: novoId(),
        tipo: 'forma',
        tipo_forma: 'retangulo',
        x: sideX,
        y: startY,
        largura: sideW,
        altura: h - startY - 12,
        rotacao: 0,
        opacidade: 1,
        bloqueado: false,
        visivel: true,
        camada: 0,
        texto: '',
        cor_texto: corHex(sec),
        cor_fundo: corHex(bgLight),
        cor_borda: corHex('#CBD5E1'),
        espessura_borda: 0.3,
        raio_borda: 2.5,
        familia_fonte: 'Helvetica',
        tamanho_fonte: 9,
        negrito: false,
        italico: false,
        alinhamento: 'left',
        caminho_imagem: '',
        destino_link: '',
        filhos: [],
        nome: 'Painel Lateral',
        dados_extras: {},
      });

      elems.push({
        id: novoId(),
        tipo: 'texto',
        x: sideX + 4,
        y: startY + 4,
        largura: sideW - 8,
        altura: 7,
        rotacao: 0,
        opacidade: 1,
        bloqueado: false,
        visivel: true,
        camada: 1,
        texto: '🎯 METAS & PRIORIDADES',
        cor_texto: corHex(primary),
        espessura_borda: 0,
        raio_borda: 0,
        familia_fonte: 'Helvetica',
        tamanho_fonte: 9,
        negrito: true,
        italico: false,
        alinhamento: 'left',
        caminho_imagem: '',
        destino_link: '',
        filhos: [],
        nome: 'Título Metas',
        dados_extras: {},
      });

      // 6 Checkboxes de Metas
      for (let k = 0; k < 6; k++) {
        elems.push({
          id: novoId(),
          tipo: 'checkbox',
          x: sideX + 4,
          y: startY + 16 + k * 10,
          largura: sideW - 8,
          altura: 7,
          rotacao: 0,
          opacidade: 1,
          bloqueado: false,
          visivel: true,
          camada: 1,
          texto: `Meta ${k + 1}`,
          cor_texto: corHex(sec),
          espessura_borda: 0,
          raio_borda: 0,
          familia_fonte: 'Helvetica',
          tamanho_fonte: 8,
          negrito: false,
          italico: false,
          alinhamento: 'left',
          caminho_imagem: '',
          destino_link: '',
          filhos: [],
          nome: `Meta Check ${k + 1}`,
          dados_extras: {},
        });
      }

      return elems;
    },
  },

  {
    id: 'mensal_minimalista',
    nome: 'Mensal Minimalista',
    categoria: 'calendarios',
    descricao: 'Design limpo, respiro visual focado em tipografia refinada e linhas discretas.',
    icone: 'CalendarRange',
    estilosSuportados: ['minimalista', 'apple', 'editorial'],
    gerarElementos: (w, h, paleta, estilo) => {
      const elems: Elemento[] = [];
      const sec = paleta.secundaria.hex;

      elems.push({
        id: novoId(),
        tipo: 'texto',
        x: 20,
        y: 16,
        largura: 140,
        altura: 14,
        rotacao: 0,
        opacidade: 1,
        bloqueado: false,
        visivel: true,
        camada: 1,
        texto: 'VISÃO DO MÊS',
        cor_texto: corHex(sec),
        espessura_borda: 0,
        raio_borda: 0,
        familia_fonte: 'Helvetica',
        tamanho_fonte: 18,
        negrito: true,
        italico: false,
        alinhamento: 'left',
        caminho_imagem: '',
        destino_link: '',
        filhos: [],
        nome: 'Título Minimalista',
        dados_extras: {},
      });

      // Divisória sutil
      elems.push({
        id: novoId(),
        tipo: 'forma',
        tipo_forma: 'linha_horizontal',
        x: 20,
        y: 32,
        largura: w - 40,
        altura: 1,
        rotacao: 0,
        opacidade: 0.6,
        bloqueado: false,
        visivel: true,
        camada: 0,
        texto: '',
        cor_texto: corHex('#CBD5E1'),
        cor_fundo: corHex('#CBD5E1'),
        espessura_borda: 0.4,
        raio_borda: 0,
        familia_fonte: 'Helvetica',
        tamanho_fonte: 8,
        negrito: false,
        italico: false,
        alinhamento: 'left',
        caminho_imagem: '',
        destino_link: '',
        filhos: [],
        nome: 'Linha Divisoria',
        dados_extras: {},
      });

      // Grade leve 7 colunas x 5 linhas
      const gridW = w - 40;
      const colW = gridW / 7;
      const cellH = (h - 48) / 5;
      const startX = 20;
      const startY = 38;

      for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 7; c++) {
          elems.push({
            id: novoId(),
            tipo: 'forma',
            tipo_forma: 'retangulo',
            x: startX + c * colW,
            y: startY + r * cellH,
            largura: colW,
            altura: cellH,
            rotacao: 0,
            opacidade: 1,
            bloqueado: false,
            visivel: true,
            camada: 0,
            texto: '',
            cor_texto: corHex(sec),
            cor_fundo: corHex('#FFFFFF'),
            cor_borda: corHex('#E2E8F0'),
            espessura_borda: 0.2,
            raio_borda: 0,
            familia_fonte: 'Helvetica',
            tamanho_fonte: 7,
            negrito: false,
            italico: false,
            alinhamento: 'left',
            caminho_imagem: '',
            destino_link: '',
            filhos: [],
            nome: `Cell Min ${r}-${c}`,
            dados_extras: {},
          });
        }
      }

      return elems;
    },
  },

  {
    id: 'semanal_vertical',
    nome: 'Semanal Vertical em Colunas',
    categoria: 'calendarios',
    descricao: 'Layout de 7 colunas verticais com horários de 07:00 às 21:00 para planejamento detalhado.',
    icone: 'Clock',
    estilosSuportados: ['apple', 'executivo', 'minimalista'],
    gerarElementos: (w, h, paleta, estilo) => {
      const elems: Elemento[] = [];
      const primary = paleta.primaria.hex;
      const sec = paleta.secundaria.hex;

      elems.push({
        id: novoId(),
        tipo: 'texto',
        x: 15,
        y: 10,
        largura: 80,
        altura: 10,
        rotacao: 0,
        opacidade: 1,
        bloqueado: false,
        visivel: true,
        camada: 1,
        texto: 'PLANEJAMENTO SEMANAL',
        cor_texto: corHex(sec),
        espessura_borda: 0,
        raio_borda: 0,
        familia_fonte: 'Helvetica',
        tamanho_fonte: 14,
        negrito: true,
        italico: false,
        alinhamento: 'left',
        caminho_imagem: '',
        destino_link: '',
        filhos: [],
        nome: 'Título Semanal',
        dados_extras: {},
      });

      const dias = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
      const colW = (w - 30) / 7;
      const startY = 24;
      const colH = h - startY - 12;

      dias.forEach((dia, i) => {
        const x = 15 + i * colW;
        // Cabeçalho do dia
        elems.push({
          id: novoId(),
          tipo: 'forma',
          tipo_forma: 'retangulo',
          x,
          y: startY,
          largura: colW - 1.5,
          altura: 8,
          rotacao: 0,
          opacidade: 1,
          bloqueado: false,
          visivel: true,
          camada: 0,
          texto: '',
          cor_texto: corHex('#FFFFFF'),
          cor_fundo: corHex(i < 5 ? primary : sec),
          espessura_borda: 0,
          raio_borda: 2,
          familia_fonte: 'Helvetica',
          tamanho_fonte: 7,
          negrito: true,
          italico: false,
          alinhamento: 'center',
          caminho_imagem: '',
          destino_link: '',
          filhos: [],
          nome: `Header ${dia}`,
          dados_extras: {},
        });
        elems.push({
          id: novoId(),
          tipo: 'texto',
          x,
          y: startY + 1.5,
          largura: colW - 1.5,
          altura: 5,
          rotacao: 0,
          opacidade: 1,
          bloqueado: false,
          visivel: true,
          camada: 1,
          texto: dia,
          cor_texto: corHex('#FFFFFF'),
          espessura_borda: 0,
          raio_borda: 0,
          familia_fonte: 'Helvetica',
          tamanho_fonte: 7.5,
          negrito: true,
          italico: false,
          alinhamento: 'center',
          caminho_imagem: '',
          destino_link: '',
          filhos: [],
          nome: `Txt ${dia}`,
          dados_extras: {},
        });

        // Coluna do dia
        elems.push({
          id: novoId(),
          tipo: 'forma',
          tipo_forma: 'retangulo',
          x,
          y: startY + 9,
          largura: colW - 1.5,
          altura: colH - 9,
          rotacao: 0,
          opacidade: 1,
          bloqueado: false,
          visivel: true,
          camada: 0,
          texto: '',
          cor_texto: corHex(sec),
          cor_fundo: corHex('#FFFFFF'),
          cor_borda: corHex('#E2E8F0'),
          espessura_borda: 0.3,
          raio_borda: 2,
          familia_fonte: 'Helvetica',
          tamanho_fonte: 7,
          negrito: false,
          italico: false,
          alinhamento: 'left',
          caminho_imagem: '',
          destino_link: '',
          filhos: [],
          nome: `Col ${dia}`,
          dados_extras: {},
        });
      });

      return elems;
    },
  },

  {
    id: 'diario_blocos',
    nome: 'Diário em Blocos de Tempo',
    categoria: 'calendarios',
    descricao: 'Página diária completa: lista de prioridades Top 3, cronograma em blocos e reflexão noturna.',
    icone: 'CheckSquare',
    estilosSuportados: ['apple', 'minimalista', 'pastel', 'editorial'],
    gerarElementos: (w, h, paleta, estilo) => {
      const elems: Elemento[] = [];
      const primary = paleta.primaria.hex;
      const sec = paleta.secundaria.hex;
      const bgLight = paleta.fundo_claro.hex;

      // Header Diário
      elems.push({
        id: novoId(),
        tipo: 'texto',
        x: 18,
        y: 12,
        largura: 100,
        altura: 12,
        rotacao: 0,
        opacidade: 1,
        bloqueado: false,
        visivel: true,
        camada: 1,
        texto: 'FOCO DIÁRIO',
        cor_texto: corHex(sec),
        espessura_borda: 0,
        raio_borda: 0,
        familia_fonte: 'Helvetica',
        tamanho_fonte: 16,
        negrito: true,
        italico: false,
        alinhamento: 'left',
        caminho_imagem: '',
        destino_link: '',
        filhos: [],
        nome: 'Título Diário',
        dados_extras: {},
      });

      // Coluna Esquerda: Horários / Cronograma (07h às 21h)
      const colLeftW = (w - 42) * 0.55;
      elems.push({
        id: novoId(),
        tipo: 'forma',
        tipo_forma: 'retangulo',
        x: 18,
        y: 28,
        largura: colLeftW,
        altura: h - 40,
        rotacao: 0,
        opacidade: 1,
        bloqueado: false,
        visivel: true,
        camada: 0,
        texto: '',
        cor_texto: corHex(sec),
        cor_fundo: corHex('#FFFFFF'),
        cor_borda: corHex('#CBD5E1'),
        espessura_borda: 0.3,
        raio_borda: 3,
        familia_fonte: 'Helvetica',
        tamanho_fonte: 8,
        negrito: false,
        italico: false,
        alinhamento: 'left',
        caminho_imagem: '',
        destino_link: '',
        filhos: [],
        nome: 'Quadro Cronograma',
        dados_extras: {},
      });

      elems.push({
        id: novoId(),
        tipo: 'texto',
        x: 22,
        y: 31,
        largura: 50,
        altura: 6,
        rotacao: 0,
        opacidade: 1,
        bloqueado: false,
        visivel: true,
        camada: 1,
        texto: '⏰ CRONOGRAMA & COMPROMISSOS',
        cor_texto: corHex(primary),
        espessura_borda: 0,
        raio_borda: 0,
        familia_fonte: 'Helvetica',
        tamanho_fonte: 8.5,
        negrito: true,
        italico: false,
        alinhamento: 'left',
        caminho_imagem: '',
        destino_link: '',
        filhos: [],
        nome: 'Header Cronograma',
        dados_extras: {},
      });

      // Linhas com horários
      const horas = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];
      const slotH = (h - 80) / horas.length;
      horas.forEach((hora, idx) => {
        const ySlot = 40 + idx * slotH;
        elems.push({
          id: novoId(),
          tipo: 'texto',
          x: 22,
          y: ySlot,
          largura: 15,
          altura: 5,
          rotacao: 0,
          opacidade: 1,
          bloqueado: false,
          visivel: true,
          camada: 1,
          texto: hora,
          cor_texto: corHex('#64748B'),
          espessura_borda: 0,
          raio_borda: 0,
          familia_fonte: 'Helvetica',
          tamanho_fonte: 7,
          negrito: true,
          italico: false,
          alinhamento: 'left',
          caminho_imagem: '',
          destino_link: '',
          filhos: [],
          nome: `Hora ${hora}`,
          dados_extras: {},
        });
        elems.push({
          id: novoId(),
          tipo: 'forma',
          tipo_forma: 'linha_horizontal',
          x: 36,
          y: ySlot + 3,
          largura: colLeftW - 22,
          altura: 1,
          rotacao: 0,
          opacidade: 0.6,
          bloqueado: false,
          visivel: true,
          camada: 0,
          texto: '',
          cor_texto: corHex('#E2E8F0'),
          cor_fundo: corHex('#E2E8F0'),
          espessura_borda: 0.2,
          raio_borda: 0,
          familia_fonte: 'Helvetica',
          tamanho_fonte: 7,
          negrito: false,
          italico: false,
          alinhamento: 'left',
          caminho_imagem: '',
          destino_link: '',
          filhos: [],
          nome: `Linha ${hora}`,
          dados_extras: {},
        });
      });

      // Coluna Direita: Top 3 Prioridades & Tarefas
      const colRightX = 18 + colLeftW + 6;
      const colRightW = w - colRightX - 18;

      // Card Top 3
      elems.push({
        id: novoId(),
        tipo: 'forma',
        tipo_forma: 'retangulo',
        x: colRightX,
        y: 28,
        largura: colRightW,
        altura: 45,
        rotacao: 0,
        opacidade: 1,
        bloqueado: false,
        visivel: true,
        camada: 0,
        texto: '',
        cor_texto: corHex(sec),
        cor_fundo: corHex(bgLight),
        cor_borda: corHex(paleta.fundo_medio.hex),
        espessura_borda: 0.4,
        raio_borda: 3,
        familia_fonte: 'Helvetica',
        tamanho_fonte: 8,
        negrito: false,
        italico: false,
        alinhamento: 'left',
        caminho_imagem: '',
        destino_link: '',
        filhos: [],
        nome: 'Card Top 3',
        dados_extras: {},
      });

      elems.push({
        id: novoId(),
        tipo: 'texto',
        x: colRightX + 4,
        y: 31,
        largura: colRightW - 8,
        altura: 6,
        rotacao: 0,
        opacidade: 1,
        bloqueado: false,
        visivel: true,
        camada: 1,
        texto: '⭐ TOP 3 PRIORIDADES INEGOCIÁVEIS',
        cor_texto: corHex(primary),
        espessura_borda: 0,
        raio_borda: 0,
        familia_fonte: 'Helvetica',
        tamanho_fonte: 8.5,
        negrito: true,
        italico: false,
        alinhamento: 'left',
        caminho_imagem: '',
        destino_link: '',
        filhos: [],
        nome: 'Header Top 3',
        dados_extras: {},
      });

      for (let p = 0; p < 3; p++) {
        elems.push({
          id: novoId(),
          tipo: 'checkbox',
          x: colRightX + 4,
          y: 40 + p * 10,
          largura: colRightW - 8,
          altura: 7,
          rotacao: 0,
          opacidade: 1,
          bloqueado: false,
          visivel: true,
          camada: 1,
          texto: `Prioridade #${p + 1}`,
          cor_texto: corHex(sec),
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
          nome: `Prioridade ${p + 1}`,
          dados_extras: {},
        });
      }

      return elems;
    },
  },

  // ── 2. ORGANIZAÇÃO ─────────────────────────────────────────────
  {
    id: 'matriz_eisenhower',
    nome: 'Matriz de Eisenhower',
    categoria: 'organizacao',
    descricao: 'Os 4 quadrantes da produtividade: Urgente & Importante, Decidir, Delegar e Eliminar.',
    icone: 'Grid',
    estilosSuportados: ['apple', 'executivo', 'minimalista'],
    gerarElementos: (w, h, paleta, estilo) => {
      const elems: Elemento[] = [];
      const primary = paleta.primaria.hex;
      const sec = paleta.secundaria.hex;

      elems.push({
        id: novoId(),
        tipo: 'texto',
        x: 18,
        y: 12,
        largura: 120,
        altura: 12,
        rotacao: 0,
        opacidade: 1,
        bloqueado: false,
        visivel: true,
        camada: 1,
        texto: 'MATRIZ DE EISENHOWER',
        cor_texto: corHex(sec),
        espessura_borda: 0,
        raio_borda: 0,
        familia_fonte: 'Helvetica',
        tamanho_fonte: 16,
        negrito: true,
        italico: false,
        alinhamento: 'left',
        caminho_imagem: '',
        destino_link: '',
        filhos: [],
        nome: 'Título Eisenhower',
        dados_extras: {},
      });

      const padX = 18;
      const padY = 28;
      const quadW = (w - padX * 2 - 6) / 2;
      const quadH = (h - padY - 14) / 2;

      const quadrantes = [
        { nome: '1. FAZER AGORA (Urgente & Importante)', corBg: '#FEE2E2', corTxt: '#991B1B', x: padX, y: padY },
        { nome: '2. AGENDAR (Não Urgente, Importante)', corBg: '#E0E7FF', corTxt: '#3730A3', x: padX + quadW + 6, y: padY },
        { nome: '3. DELEGAR (Urgente, Não Importante)', corBg: '#FEF3C7', corTxt: '#92400E', x: padX, y: padY + quadH + 4 },
        { nome: '4. ELIMINAR (Não Urgente, Não Importante)', corBg: '#F1F5F9', corTxt: '#475569', x: padX + quadW + 6, y: padY + quadH + 4 },
      ];

      quadrantes.forEach((q) => {
        elems.push({
          id: novoId(),
          tipo: 'forma',
          tipo_forma: 'retangulo',
          x: q.x,
          y: q.y,
          largura: quadW,
          altura: quadH,
          rotacao: 0,
          opacidade: 1,
          bloqueado: false,
          visivel: true,
          camada: 0,
          texto: '',
          cor_texto: corHex(q.corTxt),
          cor_fundo: corHex(q.corBg),
          cor_borda: corHex(q.corTxt),
          espessura_borda: 0.3,
          raio_borda: 3,
          familia_fonte: 'Helvetica',
          tamanho_fonte: 8,
          negrito: false,
          italico: false,
          alinhamento: 'left',
          caminho_imagem: '',
          destino_link: '',
          filhos: [],
          nome: `Box ${q.nome}`,
          dados_extras: {},
        });
        elems.push({
          id: novoId(),
          tipo: 'texto',
          x: q.x + 4,
          y: q.y + 4,
          largura: quadW - 8,
          altura: 7,
          rotacao: 0,
          opacidade: 1,
          bloqueado: false,
          visivel: true,
          camada: 1,
          texto: q.nome,
          cor_texto: corHex(q.corTxt),
          espessura_borda: 0,
          raio_borda: 0,
          familia_fonte: 'Helvetica',
          tamanho_fonte: 8.5,
          negrito: true,
          italico: false,
          alinhamento: 'left',
          caminho_imagem: '',
          destino_link: '',
          filhos: [],
          nome: `Txt ${q.nome}`,
          dados_extras: {},
        });

        // 4 Checkboxes por quadrante
        for (let idx = 0; idx < 4; idx++) {
          elems.push({
            id: novoId(),
            tipo: 'checkbox',
            x: q.x + 5,
            y: q.y + 14 + idx * 9,
            largura: quadW - 10,
            altura: 7,
            rotacao: 0,
            opacidade: 1,
            bloqueado: false,
            visivel: true,
            camada: 1,
            texto: `Item de ação ${idx + 1}`,
            cor_texto: corHex(q.corTxt),
            espessura_borda: 0,
            raio_borda: 0,
            familia_fonte: 'Helvetica',
            tamanho_fonte: 8,
            negrito: false,
            italico: false,
            alinhamento: 'left',
            caminho_imagem: '',
            destino_link: '',
            filhos: [],
            nome: `Action Item ${idx + 1}`,
            dados_extras: {},
          });
        }
      });

      return elems;
    },
  },

  {
    id: 'kanban_board',
    nome: 'Quadro Kanban Visual',
    categoria: 'organizacao',
    descricao: 'Colunas de fluxo de trabalho: A Fazer (Backlog), Em Andamento, Revisão e Concluído.',
    icone: 'Columns',
    estilosSuportados: ['apple', 'moderno', 'executivo'],
    gerarElementos: (w, h, paleta, estilo) => {
      const elems: Elemento[] = [];
      const primary = paleta.primaria.hex;
      const sec = paleta.secundaria.hex;

      elems.push({
        id: novoId(),
        tipo: 'texto',
        x: 18,
        y: 12,
        largura: 100,
        altura: 12,
        rotacao: 0,
        opacidade: 1,
        bloqueado: false,
        visivel: true,
        camada: 1,
        texto: 'FLUXO KANBAN',
        cor_texto: corHex(sec),
        espessura_borda: 0,
        raio_borda: 0,
        familia_fonte: 'Helvetica',
        tamanho_fonte: 16,
        negrito: true,
        italico: false,
        alinhamento: 'left',
        caminho_imagem: '',
        destino_link: '',
        filhos: [],
        nome: 'Título Kanban',
        dados_extras: {},
      });

      const colunas = [
        { titulo: 'A FAZER', bg: '#F8FAFC', borda: '#CBD5E1' },
        { titulo: 'EM PROGRESSO', bg: '#EFF6FF', borda: '#93C5FD' },
        { titulo: 'EM REVISÃO', bg: '#FAF5FF', borda: '#D8B4FE' },
        { titulo: 'CONCLUÍDO', bg: '#ECFDF5', borda: '#6EE7B7' },
      ];

      const colW = (w - 36 - 15) / 4;
      const colH = h - 42;

      colunas.forEach((col, i) => {
        const x = 18 + i * (colW + 5);
        elems.push({
          id: novoId(),
          tipo: 'forma',
          tipo_forma: 'retangulo',
          x,
          y: 28,
          largura: colW,
          altura: colH,
          rotacao: 0,
          opacidade: 1,
          bloqueado: false,
          visivel: true,
          camada: 0,
          texto: '',
          cor_texto: corHex(sec),
          cor_fundo: corHex(col.bg),
          cor_borda: corHex(col.borda),
          espessura_borda: 0.4,
          raio_borda: 3,
          familia_fonte: 'Helvetica',
          tamanho_fonte: 8,
          negrito: false,
          italico: false,
          alinhamento: 'left',
          caminho_imagem: '',
          destino_link: '',
          filhos: [],
          nome: `Coluna ${col.titulo}`,
          dados_extras: {},
        });

        elems.push({
          id: novoId(),
          tipo: 'texto',
          x: x + 4,
          y: 32,
          largura: colW - 8,
          altura: 6,
          rotacao: 0,
          opacidade: 1,
          bloqueado: false,
          visivel: true,
          camada: 1,
          texto: col.titulo,
          cor_texto: corHex(sec),
          espessura_borda: 0,
          raio_borda: 0,
          familia_fonte: 'Helvetica',
          tamanho_fonte: 8.5,
          negrito: true,
          italico: false,
          alinhamento: 'center',
          caminho_imagem: '',
          destino_link: '',
          filhos: [],
          nome: `Txt Coluna ${col.titulo}`,
          dados_extras: {},
        });
      });

      return elems;
    },
  },

  {
    id: 'rastreador_habitos',
    nome: 'Rastreador de Hábitos (31 Dias)',
    categoria: 'organizacao',
    descricao: 'Tabela de acompanhamento com 31 marcações diárias para até 8 hábitos simultâneos.',
    icone: 'Activity',
    estilosSuportados: ['apple', 'pastel', 'minimalista'],
    gerarElementos: (w, h, paleta, estilo) => {
      const elems: Elemento[] = [];
      const primary = paleta.primaria.hex;
      const sec = paleta.secundaria.hex;

      elems.push({
        id: novoId(),
        tipo: 'texto',
        x: 18,
        y: 12,
        largura: 140,
        altura: 12,
        rotacao: 0,
        opacidade: 1,
        bloqueado: false,
        visivel: true,
        camada: 1,
        texto: 'RASTREADOR DE HÁBITOS',
        cor_texto: corHex(sec),
        espessura_borda: 0,
        raio_borda: 0,
        familia_fonte: 'Helvetica',
        tamanho_fonte: 16,
        negrito: true,
        italico: false,
        alinhamento: 'left',
        caminho_imagem: '',
        destino_link: '',
        filhos: [],
        nome: 'Título Hábitos',
        dados_extras: {},
      });

      // Tabela de hábitos
      const startX = 18;
      const startY = 30;
      const tableW = w - 36;
      const habitColW = 55;
      const dayColW = (tableW - habitColW) / 31;
      const rowH = (h - 55) / 8;

      for (let hIndex = 0; hIndex < 8; hIndex++) {
        const y = startY + hIndex * rowH;
        // Nome do hábito
        elems.push({
          id: novoId(),
          tipo: 'forma',
          tipo_forma: 'retangulo',
          x: startX,
          y,
          largura: habitColW - 1,
          altura: rowH - 1.5,
          rotacao: 0,
          opacidade: 1,
          bloqueado: false,
          visivel: true,
          camada: 0,
          texto: '',
          cor_texto: corHex(sec),
          cor_fundo: corHex('#F8FAFC'),
          cor_borda: corHex('#E2E8F0'),
          espessura_borda: 0.3,
          raio_borda: 1.5,
          familia_fonte: 'Helvetica',
          tamanho_fonte: 8,
          negrito: false,
          italico: false,
          alinhamento: 'left',
          caminho_imagem: '',
          destino_link: '',
          filhos: [],
          nome: `Hábito Nome Box ${hIndex + 1}`,
          dados_extras: {},
        });
        elems.push({
          id: novoId(),
          tipo: 'texto',
          x: startX + 3,
          y: y + 2,
          largura: habitColW - 7,
          altura: rowH - 4,
          rotacao: 0,
          opacidade: 1,
          bloqueado: false,
          visivel: true,
          camada: 1,
          texto: `Hábito #${hIndex + 1}`,
          cor_texto: corHex(sec),
          espessura_borda: 0,
          raio_borda: 0,
          familia_fonte: 'Helvetica',
          tamanho_fonte: 8,
          negrito: true,
          italico: false,
          alinhamento: 'left',
          caminho_imagem: '',
          destino_link: '',
          filhos: [],
          nome: `Txt Hábito ${hIndex + 1}`,
          dados_extras: {},
        });

        // 31 Células de marcação
        for (let d = 0; d < 31; d++) {
          elems.push({
            id: novoId(),
            tipo: 'forma',
            tipo_forma: 'retangulo',
            x: startX + habitColW + d * dayColW,
            y,
            largura: dayColW - 0.5,
            altura: rowH - 1.5,
            rotacao: 0,
            opacidade: 1,
            bloqueado: false,
            visivel: true,
            camada: 0,
            texto: '',
            cor_texto: corHex(sec),
            cor_fundo: corHex('#FFFFFF'),
            cor_borda: corHex('#CBD5E1'),
            espessura_borda: 0.2,
            raio_borda: 1,
            familia_fonte: 'Helvetica',
            tamanho_fonte: 6,
            negrito: false,
            italico: false,
            alinhamento: 'center',
            caminho_imagem: '',
            destino_link: '',
            filhos: [],
            nome: `Hab Cell ${hIndex}-${d + 1}`,
            dados_extras: {},
          });
        }
      }

      return elems;
    },
  },

  // ── 3. ESTUDOS ─────────────────────────────────────────────────
  {
    id: 'cornell_notes',
    nome: 'Método Cornell Notes',
    categoria: 'estudos',
    descricao: 'Layout canônico: Coluna de tópicos e palavras-chave, área de anotações e sumário na base.',
    icone: 'FileSpreadsheet',
    estilosSuportados: ['academico', 'apple', 'minimalista'],
    gerarElementos: (w, h, paleta, estilo) => {
      const elems: Elemento[] = [];
      const primary = paleta.primaria.hex;
      const sec = paleta.secundaria.hex;

      // Header de disciplina e data
      elems.push({
        id: novoId(),
        tipo: 'texto',
        x: 18,
        y: 12,
        largura: 80,
        altura: 10,
        rotacao: 0,
        opacidade: 1,
        bloqueado: false,
        visivel: true,
        camada: 1,
        texto: 'CORNELL NOTES',
        cor_texto: corHex(sec),
        espessura_borda: 0,
        raio_borda: 0,
        familia_fonte: 'Helvetica',
        tamanho_fonte: 14,
        negrito: true,
        italico: false,
        alinhamento: 'left',
        caminho_imagem: '',
        destino_link: '',
        filhos: [],
        nome: 'Título Cornell',
        dados_extras: {},
      });

      const bodyTop = 26;
      const summaryH = 35;
      const bodyH = h - bodyTop - summaryH - 12;
      const cueColW = (w - 36) * 0.3;
      const notesColW = (w - 36) - cueColW - 4;

      // Coluna Esquerda: Palavras-Chave e Questões
      elems.push({
        id: novoId(),
        tipo: 'forma',
        tipo_forma: 'retangulo',
        x: 18,
        y: bodyTop,
        largura: cueColW,
        altura: bodyH,
        rotacao: 0,
        opacidade: 1,
        bloqueado: false,
        visivel: true,
        camada: 0,
        texto: '',
        cor_texto: corHex(sec),
        cor_fundo: corHex('#F8FAFC'),
        cor_borda: corHex('#CBD5E1'),
        espessura_borda: 0.3,
        raio_borda: 2,
        familia_fonte: 'Helvetica',
        tamanho_fonte: 8,
        negrito: false,
        italico: false,
        alinhamento: 'left',
        caminho_imagem: '',
        destino_link: '',
        filhos: [],
        nome: 'Box Cue Column',
        dados_extras: {},
      });

      elems.push({
        id: novoId(),
        tipo: 'texto',
        x: 22,
        y: bodyTop + 3,
        largura: cueColW - 8,
        altura: 6,
        rotacao: 0,
        opacidade: 1,
        bloqueado: false,
        visivel: true,
        camada: 1,
        texto: '💡 TÓPICOS & DÚVIDAS',
        cor_texto: corHex(primary),
        espessura_borda: 0,
        raio_borda: 0,
        familia_fonte: 'Helvetica',
        tamanho_fonte: 8,
        negrito: true,
        italico: false,
        alinhamento: 'left',
        caminho_imagem: '',
        destino_link: '',
        filhos: [],
        nome: 'Txt Cue Header',
        dados_extras: {},
      });

      // Coluna Direita: Anotações da Aula
      elems.push({
        id: novoId(),
        tipo: 'forma',
        tipo_forma: 'retangulo',
        x: 18 + cueColW + 4,
        y: bodyTop,
        largura: notesColW,
        altura: bodyH,
        rotacao: 0,
        opacidade: 1,
        bloqueado: false,
        visivel: true,
        camada: 0,
        texto: '',
        cor_texto: corHex(sec),
        cor_fundo: corHex('#FFFFFF'),
        cor_borda: corHex('#CBD5E1'),
        espessura_borda: 0.3,
        raio_borda: 2,
        familia_fonte: 'Helvetica',
        tamanho_fonte: 8,
        negrito: false,
        italico: false,
        alinhamento: 'left',
        caminho_imagem: '',
        destino_link: '',
        filhos: [],
        nome: 'Box Notes Column',
        dados_extras: {},
      });

      elems.push({
        id: novoId(),
        tipo: 'texto',
        x: 18 + cueColW + 8,
        y: bodyTop + 3,
        largura: notesColW - 8,
        altura: 6,
        rotacao: 0,
        opacidade: 1,
        bloqueado: false,
        visivel: true,
        camada: 1,
        texto: '📝 ANOTAÇÕES DETALHADAS',
        cor_texto: corHex(primary),
        espessura_borda: 0,
        raio_borda: 0,
        familia_fonte: 'Helvetica',
        tamanho_fonte: 8,
        negrito: true,
        italico: false,
        alinhamento: 'left',
        caminho_imagem: '',
        destino_link: '',
        filhos: [],
        nome: 'Txt Notes Header',
        dados_extras: {},
      });

      // Caixa Inferior: Resumo / Sumário
      elems.push({
        id: novoId(),
        tipo: 'forma',
        tipo_forma: 'retangulo',
        x: 18,
        y: bodyTop + bodyH + 4,
        largura: w - 36,
        altura: summaryH,
        rotacao: 0,
        opacidade: 1,
        bloqueado: false,
        visivel: true,
        camada: 0,
        texto: '',
        cor_texto: corHex(sec),
        cor_fundo: corHex(paleta.fundo_claro.hex),
        cor_borda: corHex(paleta.fundo_medio.hex),
        espessura_borda: 0.4,
        raio_borda: 3,
        familia_fonte: 'Helvetica',
        tamanho_fonte: 8,
        negrito: false,
        italico: false,
        alinhamento: 'left',
        caminho_imagem: '',
        destino_link: '',
        filhos: [],
        nome: 'Box Summary',
        dados_extras: {},
      });

      elems.push({
        id: novoId(),
        tipo: 'texto',
        x: 22,
        y: bodyTop + bodyH + 7,
        largura: w - 44,
        altura: 6,
        rotacao: 0,
        opacidade: 1,
        bloqueado: false,
        visivel: true,
        camada: 1,
        texto: '📌 RESUMO & CONCLUSÕES DA SESSÃO',
        cor_texto: corHex(primary),
        espessura_borda: 0,
        raio_borda: 0,
        familia_fonte: 'Helvetica',
        tamanho_fonte: 8.5,
        negrito: true,
        italico: false,
        alinhamento: 'left',
        caminho_imagem: '',
        destino_link: '',
        filhos: [],
        nome: 'Txt Summary Header',
        dados_extras: {},
      });

      return elems;
    },
  },

  {
    id: 'cronograma_estudos',
    nome: 'Cronograma de Disciplinas',
    categoria: 'estudos',
    descricao: 'Tabela para gerenciar matérias, créditos, avaliações, leituras e notas.',
    icone: 'GraduationCap',
    estilosSuportados: ['academico', 'apple', 'executivo'],
    gerarElementos: (w, h, paleta, estilo) => {
      const elems: Elemento[] = [];
      const primary = paleta.primaria.hex;
      const sec = paleta.secundaria.hex;

      elems.push({
        id: novoId(),
        tipo: 'texto',
        x: 18,
        y: 12,
        largura: 140,
        altura: 12,
        rotacao: 0,
        opacidade: 1,
        bloqueado: false,
        visivel: true,
        camada: 1,
        texto: 'CRONOGRAMA DE DISCIPLINAS',
        cor_texto: corHex(sec),
        espessura_borda: 0,
        raio_borda: 0,
        familia_fonte: 'Helvetica',
        tamanho_fonte: 16,
        negrito: true,
        italico: false,
        alinhamento: 'left',
        caminho_imagem: '',
        destino_link: '',
        filhos: [],
        nome: 'Título Estudos',
        dados_extras: {},
      });

      const startY = 30;
      const tableW = w - 36;
      const rowH = (h - 50) / 6;

      for (let i = 0; i < 6; i++) {
        const y = startY + i * rowH;
        elems.push({
          id: novoId(),
          tipo: 'forma',
          tipo_forma: 'retangulo',
          x: 18,
          y,
          largura: tableW,
          altura: rowH - 2,
          rotacao: 0,
          opacidade: 1,
          bloqueado: false,
          visivel: true,
          camada: 0,
          texto: '',
          cor_texto: corHex(sec),
          cor_fundo: corHex(i % 2 === 0 ? '#FFFFFF' : '#F8FAFC'),
          cor_borda: corHex('#CBD5E1'),
          espessura_borda: 0.3,
          raio_borda: 2,
          familia_fonte: 'Helvetica',
          tamanho_fonte: 8,
          negrito: false,
          italico: false,
          alinhamento: 'left',
          caminho_imagem: '',
          destino_link: '',
          filhos: [],
          nome: `Row Disciplina ${i + 1}`,
          dados_extras: {},
        });

        elems.push({
          id: novoId(),
          tipo: 'texto',
          x: 22,
          y: y + 3,
          largura: 60,
          altura: 6,
          rotacao: 0,
          opacidade: 1,
          bloqueado: false,
          visivel: true,
          camada: 1,
          texto: `Disciplina #${i + 1}`,
          cor_texto: corHex(primary),
          espessura_borda: 0,
          raio_borda: 0,
          familia_fonte: 'Helvetica',
          tamanho_fonte: 9,
          negrito: true,
          italico: false,
          alinhamento: 'left',
          caminho_imagem: '',
          destino_link: '',
          filhos: [],
          nome: `Txt Disc ${i + 1}`,
          dados_extras: {},
        });
      }

      return elems;
    },
  },

  // ── 4. LEITURA ─────────────────────────────────────────────────
  {
    id: 'estante_leitura',
    nome: 'Estante & Biblioteca Pessoal',
    categoria: 'leitura',
    descricao: 'Estante visual com prateleiras e lombadas para catalogar leituras do ano.',
    icone: 'BookOpen',
    estilosSuportados: ['editorial', 'apple', 'pastel'],
    gerarElementos: (w, h, paleta, estilo) => {
      const elems: Elemento[] = [];
      const primary = paleta.primaria.hex;
      const sec = paleta.secundaria.hex;

      elems.push({
        id: novoId(),
        tipo: 'texto',
        x: 18,
        y: 12,
        largura: 140,
        altura: 12,
        rotacao: 0,
        opacidade: 1,
        bloqueado: false,
        visivel: true,
        camada: 1,
        texto: 'MINHA BIBLIOTECA PESSOAL',
        cor_texto: corHex(sec),
        espessura_borda: 0,
        raio_borda: 0,
        familia_fonte: 'Helvetica',
        tamanho_fonte: 16,
        negrito: true,
        italico: false,
        alinhamento: 'left',
        caminho_imagem: '',
        destino_link: '',
        filhos: [],
        nome: 'Título Biblioteca',
        dados_extras: {},
      });

      // 3 Prateleiras horizontais com livros
      const shelfY0 = 40;
      const shelfSpacing = (h - shelfY0 - 20) / 3;

      for (let s = 0; s < 3; s++) {
        const shelfY = shelfY0 + s * shelfSpacing;
        // Livros na prateleira
        const bookCount = 7;
        const bookW = (w - 36) / (bookCount + 1);

        for (let b = 0; b < bookCount; b++) {
          const bx = 22 + b * (bookW + 3);
          const bh = shelfSpacing * 0.75;
          const by = shelfY + shelfSpacing - bh - 4;

          elems.push({
            id: novoId(),
            tipo: 'forma',
            tipo_forma: 'retangulo',
            x: bx,
            y: by,
            largura: bookW,
            altura: bh,
            rotacao: 0,
            opacidade: 1,
            bloqueado: false,
            visivel: true,
            camada: 0,
            texto: '',
            cor_texto: corHex('#FFFFFF'),
            cor_fundo: corHex(b % 2 === 0 ? primary : paleta.fundo_medio.hex),
            cor_borda: corHex(sec),
            espessura_borda: 0.3,
            raio_borda: 1.5,
            familia_fonte: 'Helvetica',
            tamanho_fonte: 6,
            negrito: false,
            italico: false,
            alinhamento: 'center',
            caminho_imagem: '',
            destino_link: '',
            filhos: [],
            nome: `Lombada Livro ${s}-${b}`,
            dados_extras: {},
          });
        }

        // Prateleira de madeira / apoio
        elems.push({
          id: novoId(),
          tipo: 'forma',
          tipo_forma: 'retangulo',
          x: 18,
          y: shelfY + shelfSpacing - 3,
          largura: w - 36,
          altura: 3.5,
          rotacao: 0,
          opacidade: 1,
          bloqueado: false,
          visivel: true,
          camada: 1,
          texto: '',
          cor_texto: corHex(sec),
          cor_fundo: corHex(sec),
          espessura_borda: 0,
          raio_borda: 1,
          familia_fonte: 'Helvetica',
          tamanho_fonte: 7,
          negrito: false,
          italico: false,
          alinhamento: 'center',
          caminho_imagem: '',
          destino_link: '',
          filhos: [],
          nome: `Prateleira ${s + 1}`,
          dados_extras: {},
        });
      }

      return elems;
    },
  },

  {
    id: 'resenha_livro',
    nome: 'Ficha de Resenha de Livros',
    categoria: 'leitura',
    descricao: 'Página estruturada com capa, autor, avaliação por estrelas, citações e resumo crítico.',
    icone: 'Bookmark',
    estilosSuportados: ['editorial', 'apple', 'pastel'],
    gerarElementos: (w, h, paleta, estilo) => {
      const elems: Elemento[] = [];
      const primary = paleta.primaria.hex;
      const sec = paleta.secundaria.hex;

      elems.push({
        id: novoId(),
        tipo: 'texto',
        x: 18,
        y: 12,
        largura: 140,
        altura: 12,
        rotacao: 0,
        opacidade: 1,
        bloqueado: false,
        visivel: true,
        camada: 1,
        texto: 'RESENHA LITERÁRIA',
        cor_texto: corHex(sec),
        espessura_borda: 0,
        raio_borda: 0,
        familia_fonte: 'Helvetica',
        tamanho_fonte: 16,
        negrito: true,
        italico: false,
        alinhamento: 'left',
        caminho_imagem: '',
        destino_link: '',
        filhos: [],
        nome: 'Título Resenha',
        dados_extras: {},
      });

      // Box de Capa e Dados Básicos
      const coverW = 45;
      const coverH = 65;
      elems.push({
        id: novoId(),
        tipo: 'forma',
        tipo_forma: 'retangulo',
        x: 18,
        y: 28,
        largura: coverW,
        altura: coverH,
        rotacao: 0,
        opacidade: 1,
        bloqueado: false,
        visivel: true,
        camada: 0,
        texto: '',
        cor_texto: corHex(sec),
        cor_fundo: corHex(paleta.fundo_claro.hex),
        cor_borda: corHex(primary),
        espessura_borda: 0.4,
        raio_borda: 2,
        familia_fonte: 'Helvetica',
        tamanho_fonte: 8,
        negrito: false,
        italico: false,
        alinhamento: 'center',
        caminho_imagem: '',
        destino_link: '',
        filhos: [],
        nome: 'Espaço Capa',
        dados_extras: {},
      });

      elems.push({
        id: novoId(),
        tipo: 'texto',
        x: 18,
        y: 28 + coverH / 2 - 4,
        largura: coverW,
        altura: 8,
        rotacao: 0,
        opacidade: 1,
        bloqueado: false,
        visivel: true,
        camada: 1,
        texto: '[ CAPA DO LIVRO ]',
        cor_texto: corHex(primary),
        espessura_borda: 0,
        raio_borda: 0,
        familia_fonte: 'Helvetica',
        tamanho_fonte: 7,
        negrito: true,
        italico: false,
        alinhamento: 'center',
        caminho_imagem: '',
        destino_link: '',
        filhos: [],
        nome: 'Txt Espaço Capa',
        dados_extras: {},
      });

      // Metadados ao lado da capa
      const metaX = 18 + coverW + 8;
      const metaW = w - metaX - 18;

      const campos = ['Título do Livro:', 'Autor(a):', 'Gênero / Páginas:', 'Data Início / Fim:', 'Avaliação: ★ ★ ★ ★ ★'];
      campos.forEach((campo, i) => {
        elems.push({
          id: novoId(),
          tipo: 'texto',
          x: metaX,
          y: 28 + i * 13,
          largura: metaW,
          altura: 7,
          rotacao: 0,
          opacidade: 1,
          bloqueado: false,
          visivel: true,
          camada: 1,
          texto: campo,
          cor_texto: corHex(sec),
          espessura_borda: 0,
          raio_borda: 0,
          familia_fonte: 'Helvetica',
          tamanho_fonte: 9,
          negrito: true,
          italico: false,
          alinhamento: 'left',
          caminho_imagem: '',
          destino_link: '',
          filhos: [],
          nome: `Meta Campo ${i}`,
          dados_extras: {},
        });
      });

      // Bloco de Citações e Resumo
      const notesY = 28 + coverH + 6;
      const notesH = h - notesY - 14;

      elems.push({
        id: novoId(),
        tipo: 'forma',
        tipo_forma: 'retangulo',
        x: 18,
        y: notesY,
        largura: w - 36,
        altura: notesH,
        rotacao: 0,
        opacidade: 1,
        bloqueado: false,
        visivel: true,
        camada: 0,
        texto: '',
        cor_texto: corHex(sec),
        cor_fundo: corHex('#FFFFFF'),
        cor_borda: corHex('#CBD5E1'),
        espessura_borda: 0.3,
        raio_borda: 3,
        familia_fonte: 'Helvetica',
        tamanho_fonte: 8,
        negrito: false,
        italico: false,
        alinhamento: 'left',
        caminho_imagem: '',
        destino_link: '',
        filhos: [],
        nome: 'Quadro de Citações',
        dados_extras: {},
      });

      elems.push({
        id: novoId(),
        tipo: 'texto',
        x: 24,
        y: notesY + 4,
        largura: w - 48,
        altura: 7,
        rotacao: 0,
        opacidade: 1,
        bloqueado: false,
        visivel: true,
        camada: 1,
        texto: '💬 CITAÇÕES MEMORÁVEIS E PRINCIPAIS APRENDIZADOS',
        cor_texto: corHex(primary),
        espessura_borda: 0,
        raio_borda: 0,
        familia_fonte: 'Helvetica',
        tamanho_fonte: 8.5,
        negrito: true,
        italico: false,
        alinhamento: 'left',
        caminho_imagem: '',
        destino_link: '',
        filhos: [],
        nome: 'Header Citações',
        dados_extras: {},
      });

      return elems;
    },
  },

  // ── 5. PÁGINAS LIVRES ──────────────────────────────────────────
  {
    id: 'folha_pontilhada_5mm',
    nome: 'Página Pontilhada (5 mm)',
    categoria: 'livres',
    descricao: 'Grade pontilhada clássica com espaçamento milimétrico ideal para bullet journal e escrita manual.',
    icone: 'MoreHorizontal',
    estilosSuportados: ['minimalista', 'apple', 'pastel'],
    gerarElementos: (w, h, paleta, estilo) => {
      const elems: Elemento[] = [];
      const sec = paleta.secundaria.hex;

      elems.push({
        id: novoId(),
        tipo: 'texto',
        x: 20,
        y: 12,
        largura: 80,
        altura: 8,
        rotacao: 0,
        opacidade: 0.7,
        bloqueado: false,
        visivel: true,
        camada: 1,
        texto: 'ANOTAÇÕES LIVRES',
        cor_texto: corHex(sec),
        espessura_borda: 0,
        raio_borda: 0,
        familia_fonte: 'Helvetica',
        tamanho_fonte: 10,
        negrito: true,
        italico: false,
        alinhamento: 'left',
        caminho_imagem: '',
        destino_link: '',
        filhos: [],
        nome: 'Header Pontilhada',
        dados_extras: {},
      });

      // Grade de pequenos pontos usando círculos de 0.8mm a cada 5mm
      const startX = 20;
      const startY = 24;
      const endX = w - 20;
      const endY = h - 16;
      const step = 7; // passo visual confortável

      for (let x = startX; x <= endX; x += step) {
        for (let y = startY; y <= endY; y += step) {
          elems.push({
            id: novoId(),
            tipo: 'forma',
            tipo_forma: 'circulo',
            x: x - 0.5,
            y: y - 0.5,
            largura: 1,
            altura: 1,
            rotacao: 0,
            opacidade: 0.35,
            bloqueado: true,
            visivel: true,
            camada: 0,
            texto: '',
            cor_texto: corHex('#94A3B8'),
            cor_fundo: corHex('#94A3B8'),
            cor_borda: corHex('#94A3B8'),
            espessura_borda: 0.1,
            raio_borda: 0.5,
            familia_fonte: 'Helvetica',
            tamanho_fonte: 6,
            negrito: false,
            italico: false,
            alinhamento: 'center',
            caminho_imagem: '',
            destino_link: '',
            filhos: [],
            nome: `Dot ${x}-${y}`,
            dados_extras: {},
          });
        }
      }

      return elems;
    },
  },

  {
    id: 'folha_pautada_elegante',
    nome: 'Página Pautada Elegante',
    categoria: 'livres',
    descricao: 'Linhas finas com margem esquerda e numeração de tópicos para anotações corridas.',
    icone: 'AlignLeft',
    estilosSuportados: ['apple', 'minimalista', 'editorial'],
    gerarElementos: (w, h, paleta, estilo) => {
      const elems: Elemento[] = [];
      const primary = paleta.primaria.hex;
      const sec = paleta.secundaria.hex;

      elems.push({
        id: novoId(),
        tipo: 'texto',
        x: 20,
        y: 12,
        largura: 80,
        altura: 8,
        rotacao: 0,
        opacidade: 1,
        bloqueado: false,
        visivel: true,
        camada: 1,
        texto: 'NOTAS & REFLEXÕES',
        cor_texto: corHex(sec),
        espessura_borda: 0,
        raio_borda: 0,
        familia_fonte: 'Helvetica',
        tamanho_fonte: 12,
        negrito: true,
        italico: false,
        alinhamento: 'left',
        caminho_imagem: '',
        destino_link: '',
        filhos: [],
        nome: 'Header Pautada',
        dados_extras: {},
      });

      // Linhas pautadas espaçadas a 8mm
      const startY = 28;
      const lineSpacing = 8.5;
      const lineW = w - 40;

      for (let y = startY; y < h - 16; y += lineSpacing) {
        elems.push({
          id: novoId(),
          tipo: 'forma',
          tipo_forma: 'linha_horizontal',
          x: 20,
          y,
          largura: lineW,
          altura: 1,
          rotacao: 0,
          opacidade: 0.5,
          bloqueado: false,
          visivel: true,
          camada: 0,
          texto: '',
          cor_texto: corHex('#CBD5E1'),
          cor_fundo: corHex('#CBD5E1'),
          espessura_borda: 0.25,
          raio_borda: 0,
          familia_fonte: 'Helvetica',
          tamanho_fonte: 6,
          negrito: false,
          italico: false,
          alinhamento: 'left',
          caminho_imagem: '',
          destino_link: '',
          filhos: [],
          nome: `Linha Pauta ${y}`,
          dados_extras: {},
        });
      }

      return elems;
    },
  },

  // ── 6. CAPAS E ÍNDICES ─────────────────────────────────────────
  {
    id: 'capa_editorial',
    nome: 'Capa Editorial Contemporânea',
    categoria: 'capas_indices',
    descricao: 'Tipografia com grande impacto visual, layout de revista e paleta sofisticada.',
    icone: 'Layout',
    estilosSuportados: ['editorial', 'apple', 'moderno'],
    gerarElementos: (w, h, paleta, estilo) => {
      const elems: Elemento[] = [];
      const primary = paleta.primaria.hex;
      const sec = paleta.secundaria.hex;

      // Moldura geométrica elegante
      elems.push({
        id: novoId(),
        tipo: 'forma',
        tipo_forma: 'retangulo',
        x: 15,
        y: 15,
        largura: w - 30,
        altura: h - 30,
        rotacao: 0,
        opacidade: 1,
        bloqueado: false,
        visivel: true,
        camada: 0,
        texto: '',
        cor_texto: corHex(primary),
        cor_fundo: corHex('#FFFFFF'),
        cor_borda: corHex(primary),
        espessura_borda: 0.8,
        raio_borda: 4,
        familia_fonte: 'Helvetica',
        tamanho_fonte: 8,
        negrito: false,
        italico: false,
        alinhamento: 'center',
        caminho_imagem: '',
        destino_link: '',
        filhos: [],
        nome: 'Moldura Capa',
        dados_extras: {},
      });

      // Título Editorial Imponente
      elems.push({
        id: novoId(),
        tipo: 'texto',
        x: 25,
        y: h * 0.35,
        largura: w - 50,
        altura: 24,
        rotacao: 0,
        opacidade: 1,
        bloqueado: false,
        visivel: true,
        camada: 1,
        texto: 'PACCE PLANNER',
        cor_texto: corHex(sec),
        espessura_borda: 0,
        raio_borda: 0,
        familia_fonte: 'Helvetica',
        tamanho_fonte: 32,
        negrito: true,
        italico: false,
        alinhamento: 'center',
        caminho_imagem: '',
        destino_link: '',
        filhos: [],
        nome: 'Título Principal',
        dados_extras: {},
      });

      // Subtítulo
      elems.push({
        id: novoId(),
        tipo: 'texto',
        x: 25,
        y: h * 0.48,
        largura: w - 50,
        altura: 12,
        rotacao: 0,
        opacidade: 1,
        bloqueado: false,
        visivel: true,
        camada: 1,
        texto: 'DIGITAL EDITION • GOODNOTES',
        cor_texto: corHex(primary),
        espessura_borda: 0,
        raio_borda: 0,
        familia_fonte: 'Helvetica',
        tamanho_fonte: 12,
        negrito: true,
        italico: false,
        alinhamento: 'center',
        caminho_imagem: '',
        destino_link: '',
        filhos: [],
        nome: 'Subtítulo Capa',
        dados_extras: {},
      });

      // Linha de Respiro Central
      elems.push({
        id: novoId(),
        tipo: 'forma',
        tipo_forma: 'linha_horizontal',
        x: w * 0.35,
        y: h * 0.58,
        largura: w * 0.3,
        altura: 1.5,
        rotacao: 0,
        opacidade: 1,
        bloqueado: false,
        visivel: true,
        camada: 1,
        texto: '',
        cor_texto: corHex(primary),
        cor_fundo: corHex(primary),
        espessura_borda: 0.6,
        raio_borda: 0,
        familia_fonte: 'Helvetica',
        tamanho_fonte: 8,
        negrito: false,
        italico: false,
        alinhamento: 'center',
        caminho_imagem: '',
        destino_link: '',
        filhos: [],
        nome: 'Linha Central',
        dados_extras: {},
      });

      return elems;
    },
  },

  {
    id: 'capa_geometrica',
    nome: 'Capa Geométrica Contemporânea',
    categoria: 'capas_indices',
    descricao: 'Composição com blocos e formas dinâmicas nas cores oficiais da identidade visual.',
    icone: 'Shapes',
    estilosSuportados: ['moderno', 'apple', 'minimalista'],
    gerarElementos: (w, h, paleta, estilo) => {
      const elems: Elemento[] = [];
      const primary = paleta.primaria.hex;
      const sec = paleta.secundaria.hex;
      const bgLight = paleta.fundo_claro.hex;

      // Bloco geométrico de fundo superior
      elems.push({
        id: novoId(),
        tipo: 'forma',
        tipo_forma: 'retangulo',
        x: 0,
        y: 0,
        largura: w * 0.45,
        altura: h,
        rotacao: 0,
        opacidade: 1,
        bloqueado: false,
        visivel: true,
        camada: 0,
        texto: '',
        cor_texto: corHex('#FFFFFF'),
        cor_fundo: corHex(primary),
        espessura_borda: 0,
        raio_borda: 0,
        familia_fonte: 'Helvetica',
        tamanho_fonte: 8,
        negrito: false,
        italico: false,
        alinhamento: 'left',
        caminho_imagem: '',
        destino_link: '',
        filhos: [],
        nome: 'Bloco Primario Lateral',
        dados_extras: {},
      });

      // Título na área clara
      elems.push({
        id: novoId(),
        tipo: 'texto',
        x: w * 0.5,
        y: h * 0.35,
        largura: w * 0.45,
        altura: 20,
        rotacao: 0,
        opacidade: 1,
        bloqueado: false,
        visivel: true,
        camada: 1,
        texto: 'MEU PLANNER',
        cor_texto: corHex(sec),
        espessura_borda: 0,
        raio_borda: 0,
        familia_fonte: 'Helvetica',
        tamanho_fonte: 28,
        negrito: true,
        italico: false,
        alinhamento: 'left',
        caminho_imagem: '',
        destino_link: '',
        filhos: [],
        nome: 'Txt Meu Planner',
        dados_extras: {},
      });

      elems.push({
        id: novoId(),
        tipo: 'texto',
        x: w * 0.5,
        y: h * 0.48,
        largura: w * 0.45,
        altura: 10,
        rotacao: 0,
        opacidade: 1,
        bloqueado: false,
        visivel: true,
        camada: 1,
        texto: 'Edição Studio • 2026',
        cor_texto: corHex(primary),
        espessura_borda: 0,
        raio_borda: 0,
        familia_fonte: 'Helvetica',
        tamanho_fonte: 12,
        negrito: true,
        italico: false,
        alinhamento: 'left',
        caminho_imagem: '',
        destino_link: '',
        filhos: [],
        nome: 'Txt Ano Edicao',
        dados_extras: {},
      });

      return elems;
    },
  },

  {
    id: 'indice_interativo',
    nome: 'Índice Interativo com Abas',
    categoria: 'capas_indices',
    descricao: 'Grade organizada de botões e abas clicáveis com links diretos para cada seção.',
    icone: 'Layers',
    estilosSuportados: ['apple', 'executivo', 'minimalista'],
    gerarElementos: (w, h, paleta, estilo) => {
      const elems: Elemento[] = [];
      const primary = paleta.primaria.hex;
      const sec = paleta.secundaria.hex;

      elems.push({
        id: novoId(),
        tipo: 'texto',
        x: 18,
        y: 12,
        largura: 140,
        altura: 12,
        rotacao: 0,
        opacidade: 1,
        bloqueado: false,
        visivel: true,
        camada: 1,
        texto: 'ÍNDICE GERAL DO PLANNER',
        cor_texto: corHex(sec),
        espessura_borda: 0,
        raio_borda: 0,
        familia_fonte: 'Helvetica',
        tamanho_fonte: 16,
        negrito: true,
        italico: false,
        alinhamento: 'left',
        caminho_imagem: '',
        destino_link: '',
        filhos: [],
        nome: 'Título Índice',
        dados_extras: {},
      });

      // Grid de seções (3 colunas x 4 linhas)
      const secoesExemplo = [
        { nome: 'Calendário Mensal', link: 'mes_2026_10', icone: '📅' },
        { nome: 'Planejamento Semanal', link: 'sem_2026_40', icone: '⏰' },
        { nome: 'Planejamento Diário', link: 'dia_2026_10_01', icone: '📋' },
        { nome: 'Rastreador de Hábitos', link: 'habitos', icone: '📈' },
        { nome: 'Gestão de Projetos', link: 'projetos', icone: '🚀' },
        { nome: 'Cronograma de Estudos', link: 'estudos', icone: '🎓' },
        { nome: 'Biblioteca de Leitura', link: 'leitura', icone: '📚' },
        { nome: 'Revisões Mensais', link: 'revisoes', icone: '🔄' },
        { nome: 'Anotações Livres', link: 'livres', icone: '📝' },
      ];

      const startX = 18;
      const startY = 32;
      const colW = (w - 36 - 16) / 3;
      const rowH = (h - startY - 16) / 3;

      secoesExemplo.forEach((s, idx) => {
        const c = idx % 3;
        const r = Math.floor(idx / 3);
        const x = startX + c * (colW + 8);
        const y = startY + r * (rowH + 8);

        elems.push({
          id: novoId(),
          tipo: 'forma',
          tipo_forma: 'retangulo',
          x,
          y,
          largura: colW,
          altura: rowH,
          rotacao: 0,
          opacidade: 1,
          bloqueado: false,
          visivel: true,
          camada: 0,
          texto: '',
          cor_texto: corHex(sec),
          cor_fundo: corHex('#FFFFFF'),
          cor_borda: corHex('#CBD5E1'),
          espessura_borda: 0.4,
          raio_borda: 3,
          familia_fonte: 'Helvetica',
          tamanho_fonte: 8,
          negrito: false,
          italico: false,
          alinhamento: 'center',
          caminho_imagem: '',
          destino_link: s.link,
          filhos: [],
          nome: `Card ${s.nome}`,
          dados_extras: {},
        });

        elems.push({
          id: novoId(),
          tipo: 'texto',
          x: x + 4,
          y: y + rowH * 0.35,
          largura: colW - 8,
          altura: 10,
          rotacao: 0,
          opacidade: 1,
          bloqueado: false,
          visivel: true,
          camada: 1,
          texto: `${s.icone}  ${s.nome}`,
          cor_texto: corHex(sec),
          espessura_borda: 0,
          raio_borda: 0,
          familia_fonte: 'Helvetica',
          tamanho_fonte: 9.5,
          negrito: true,
          italico: false,
          alinhamento: 'center',
          caminho_imagem: '',
          destino_link: s.link,
          filhos: [],
          nome: `Txt ${s.nome}`,
          dados_extras: {},
        });
      });

      return elems;
    },
  },
];
