import json
from datetime import date
from pacce.models.planner import ProjetoPlanner, ConfiguracaoProjeto, FormatoPagina, Paleta, Cor, DIMENSOES_FORMATO
from pacce.templates.generator import GeradorPlanner
from pacce.pdf.navigation import MotorNavegacao

def criar(dados):
    start=date.fromisoformat(dados['data_inicio'])
    end=date.fromisoformat(dados['data_fim'])
    if end < start or (end-start).days > 1096:
        raise ValueError('Escolha um período de até três anos, com fim após o início.')
    palette=Paleta(nome='Customizada', primaria=Cor(dados.get('cor_primaria','#535DEB')), secundaria=Cor(dados.get('cor_secundaria','#172B70')), fundo_claro=Cor(dados.get('cor_fundo_claro','#F0EEFF')), fundo_medio=Cor('#DDE2FF'), fundo=Cor('#FFFFFF'), texto=Cor(dados.get('cor_secundaria','#172B70')), texto_claro=Cor(dados.get('cor_primaria','#535DEB')), destaque=Cor(dados.get('cor_primaria','#535DEB')))
    fmt=FormatoPagina(dados.get('formato','a4_horizontal'))
    width,height=DIMENSOES_FORMATO[fmt]
    cfg=ConfiguracaoProjeto(formato=fmt, largura_mm=width, altura_mm=height, idioma='pt-BR', primeiro_dia_semana=dados.get('primeiro_dia_semana',0), incluir_feriados=dados.get('incluir_feriados',True), data_inicio=dados['data_inicio'], data_fim=dados['data_fim'], paleta=palette, secoes=dados.get('secoes',[]))
    project=ProjetoPlanner(nome=dados.get('nome','Meu Planner'), descricao=dados.get('descricao',''), configuracao=cfg)
    GeradorPlanner(project).gerar()
    return project.to_dict()

def dispatch(action,payload):
    if action=='create':
        return json.dumps(criar(payload),ensure_ascii=False)
    project=ProjetoPlanner.from_dict(payload) if payload else None
    if action=='validate':
        rel=MotorNavegacao(project).validar()
        return json.dumps(dict(aprovado=rel.aprovado,total_hyperlinks=rel.total_hyperlinks,total_validos=rel.total_validos,total_invalidos=rel.total_invalidos,problemas=[dict(tipo=p.tipo,severidade=p.severidade,descricao=p.descricao,pagina_origem=p.pagina_origem_id) for p in rel.problemas]),ensure_ascii=False)
    if action=='pdf':
        from pacce.pdf.renderer import RenderizadorPDF
        content=RenderizadorPDF(project).renderizar_para_bytes()
        with open('/tmp/export.pdf','wb') as f: f.write(content)
        return '/tmp/export.pdf'
    if action=='stickers':
        from pacce.stickers.engine import MotorAdesivos
        MotorAdesivos('/tmp/stickers').exportar_pacote_zip('/tmp/stickers.zip')
        return '/tmp/stickers.zip'
    raise ValueError('Ação desconhecida')
