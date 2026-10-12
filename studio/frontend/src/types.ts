export interface Cor {
  hex: string;
  opacidade: number;
}

export interface Paleta {
  nome: string;
  primaria: Cor;
  secundaria: Cor;
  fundo_claro: Cor;
  fundo_medio: Cor;
  fundo: Cor;
  texto: Cor;
  texto_claro: Cor;
  destaque: Cor;
}

export interface Tipografia {
  familia_titulo: string;
  familia_corpo: string;
  tamanho_titulo: number;
  tamanho_subtitulo: number;
  tamanho_corpo: number;
  tamanho_pequeno: number;
  tamanho_rodape: number;
}

export interface ConfiguracaoProjeto {
  formato: string;
  largura_mm: number;
  altura_mm: number;
  idioma: string;
  primeiro_dia_semana: number;
  incluir_feriados: boolean;
  data_inicio: string;
  data_fim: string;
  paleta: Paleta;
  tipografia: Tipografia;
  secoes: string[];
}

export interface Elemento {
  id: string;
  tipo: string;
  x: number;
  y: number;
  largura: number;
  altura: number;
  rotacao: number;
  opacidade: number;
  bloqueado: boolean;
  visivel: boolean;
  camada: number;
  texto: string;
  cor_texto: Cor;
  cor_fundo?: Cor;
  cor_borda?: Cor;
  espessura_borda: number;
  raio_borda: number;
  familia_fonte: string;
  tamanho_fonte: number;
  negrito: boolean;
  italico: boolean;
  alinhamento: string;
  caminho_imagem: string;
  tipo_forma?: string;
  destino_link: string;
  filhos: string[];
  nome: string;
  dados_extras: Record<string, any>;
}

export interface Pagina {
  id: string;
  tipo: string;
  titulo: string;
  subtitulo: string;
  elementos: Elemento[];
  template_id: string;
  data_referencia: string;
  mes_referencia: number;
  ano_referencia: number;
  semana_referencia: number;
  id_navegacao: string;
  cor_fundo: Cor;
  margens: {
    topo: number;
    base: number;
    esquerda: number;
    direita: number;
  };
  ordem: number;
  secao: string;
}

export interface Hyperlink {
  id: string;
  pagina_origem_id: string;
  elemento_id: string;
  pagina_destino_id: string;
  tipo: string;
  x: number;
  y: number;
  largura: number;
  altura: number;
  numero_pagina_destino: number;
  valido: boolean;
  mensagem_erro: string;
}

export interface ProjetoPlanner {
  id: string;
  nome: string;
  descricao: string;
  schema_version: string;
  configuracao: ConfiguracaoProjeto;
  paginas: Pagina[];
  hyperlinks: Hyperlink[];
  criado_em: string;
  atualizado_em: string;
  versao: number;
}

export interface ProjetoResumo {
  id: string;
  nome: string;
  descricao: string;
  criado_em: string;
  atualizado_em: string;
  total_paginas: number;
}

export interface RelatorioValidacaoResponse {
  aprovado: boolean;
  total_hyperlinks: number;
  total_validos: number;
  total_invalidos: number;
  problemas: Array<{
    tipo: string;
    severidade: string;
    descricao: string;
    pagina_origem: string;
  }>;
}
