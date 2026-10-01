const fs = require('fs');
const path = require('path');

const enPath = path.resolve('src/lib/i18n/locales/en.json');
const ptPath = path.resolve('src/lib/i18n/locales/pt.json');

const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const pt = JSON.parse(fs.readFileSync(ptPath, 'utf8'));

const addKeys = (obj, path, value) => {
    const keys = path.split('.');
    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
};

const translations = {
    'routes.error.title': { en: 'Something went wrong', pt: 'Algo deu errado' },
    'routes.error.details': { en: 'Diagnostic Details', pt: 'Detalhes do Diagnóstico' },
    'routes.error.return': { en: 'Return to Planner', pt: 'Voltar ao Planner' },
    'routes.presets.top_planners': { en: 'Top Planners', pt: 'Planners Populares' },
    'routes.presets.essentials': { en: 'Essentials', pt: 'Essenciais' },
    'routes.presets.work': { en: 'Work', pt: 'Trabalho' },
    'routes.presets.academic': { en: 'Academic', pt: 'Acadêmico' },
    'routes.presets.lifestyle': { en: 'Lifestyle', pt: 'Estilo de Vida' },
    'routes.presets.wellness': { en: 'Wellness', pt: 'Bem-estar' },
    'routes.presets.hobbies': { en: 'Hobbies', pt: 'Passatempos' },
    'routes.privacy.title': { en: 'Privacy Policy', pt: 'Política de Privacidade' },
    'routes.terms.title': { en: 'Terms of Service', pt: 'Termos de Serviço' },
    'routes.404.title': { en: 'Page Not Found', pt: 'Página Não Encontrada' },
    'routes.404.text': { en: 'This page doesn\'t exist.', pt: 'Esta página não existe.' },
    'routes.404.back': { en: 'Back to Home', pt: 'Voltar ao Início' },

    'wizard.notes.year': { en: 'Year Notes', pt: 'Anotações Anuais' },
    'wizard.notes.quarter': { en: 'Quarter Notes', pt: 'Anotações Trimestrais' },
    'wizard.notes.month': { en: 'Month Notes', pt: 'Anotações Mensais' },
    'wizard.notes.week': { en: 'Week Notes', pt: 'Anotações Semanais' },
    'wizard.notes.day': { en: 'Day Notes', pt: 'Anotações Diárias' },
    'wizard.calendars.title': { en: 'Calendar Views', pt: 'Visualizações de Calendário' },
    'wizard.calendars.desc': { en: 'Select templates for each of your primary calendar spreads.', pt: 'Selecione templates para cada uma das páginas do seu calendário.' },

    'wizard.collections.new': { en: 'New Collection', pt: 'Nova Coleção' },
    'wizard.collections.name_placeholder': { en: 'Collection name...', pt: 'Nome da coleção...' },
    'wizard.collections.edit_title': { en: 'Edit collection name', pt: 'Editar nome da coleção' },
    'wizard.collections.delete_label': { en: 'Delete Collection', pt: 'Excluir Coleção' },
    'wizard.collections.remove': { en: 'Remove?', pt: 'Remover?' },
    'wizard.collections.empty': { en: 'No custom collections yet.', pt: 'Nenhuma coleção customizada ainda.' },
    'wizard.collections.title': { en: 'Custom Collections', pt: 'Coleções Customizadas' },
    'wizard.collections.desc': { en: 'Extend your planner with modular notebooks and custom sections.', pt: 'Expanda seu planner com cadernos modulares e seções customizadas.' },
    'wizard.collections.add': { en: '+ Add Collection', pt: '+ Adicionar Coleção' },
    'wizard.collections.cancel': { en: 'Cancel', pt: 'Cancelar' },
    'wizard.collections.btn_add': { en: 'Add', pt: 'Adicionar' },

    'wizard.cover.labels.none': { en: 'None', pt: 'Nenhum' },
    'wizard.cover.labels.mesh': { en: 'Mesh Gradient', pt: 'Gradiente de Malha' },
    'wizard.cover.labels.waves': { en: 'Topographic Waves', pt: 'Ondas Topográficas' },
    'wizard.cover.labels.bauhaus': { en: 'Bauhaus Art', pt: 'Arte Bauhaus' },
    'wizard.cover.labels.halftone': { en: 'Halftone Pattern', pt: 'Padrão Meio-tom' },
    'wizard.cover.labels.glassmorphism': { en: 'Glassmorphism', pt: 'Glassmorfismo' },
    'wizard.cover.labels.flower': { en: 'Flower of Life', pt: 'Flor da Vida' },
    'wizard.cover.labels.emoji': { en: 'Emoji Pattern', pt: 'Padrão Emoji' },
    'wizard.cover.labels.fractals': { en: 'Fractals', pt: 'Fractais' },
    'wizard.cover.labels.platonic': { en: 'Platonic Solids', pt: 'Sólidos Platônicos' },
    'wizard.cover.labels.pokerface': { en: 'Pokerface', pt: 'Pokerface' },
    'wizard.cover.labels.magician': { en: 'Magician', pt: 'Mágico' },
    'wizard.cover.title': { en: 'Cover Page', pt: 'Capa' },
    'wizard.cover.desc': { en: 'Personalize your planner with your name, title, and background.', pt: 'Personalize seu planner com seu nome, título e plano de fundo.' },
    'wizard.cover.enable': { en: 'Enable', pt: 'Habilitar' },
    'wizard.cover.dark_mode': { en: 'Dark Mode', pt: 'Modo Escuro' },
    'wizard.cover.collection_links': { en: 'Collection Links', pt: 'Links de Coleções' },
    'wizard.cover.fields.title': { en: 'Title', pt: 'Título' },
    'wizard.cover.fields.font': { en: 'Font', pt: 'Fonte' },
    'wizard.cover.fields.owner_name': { en: 'Owner Name', pt: 'Nome do Proprietário' },
    'wizard.cover.fields.contact': { en: 'Contact / Email', pt: 'Contato / Email' },
    'wizard.cover.fields.bg_style': { en: 'Background Style', pt: 'Estilo do Fundo' },
    'wizard.cover.fields.seed': { en: 'Seed', pt: 'Semente' },
    'wizard.cover.fields.complexity': { en: 'Complexity', pt: 'Complexidade' },
    'wizard.cover.placeholders.title': { en: 'Cover Page Title', pt: 'Título da Capa' },
    'wizard.cover.placeholders.name': { en: 'Your Name', pt: 'Seu Nome' },
    
    'wizard.design.fonts.body': { en: 'Body Font', pt: 'Fonte do Corpo' },
    'wizard.design.fonts.display': { en: 'Display Font', pt: 'Fonte de Exibição' },
    'wizard.design.fonts.cover': { en: 'Cover Font', pt: 'Fonte da Capa' },
    'wizard.design.fonts.topbar': { en: 'Topbar Font', pt: 'Fonte da Barra Superior' },
    'wizard.design.fonts.sidebar': { en: 'Sidebar Font', pt: 'Fonte da Barra Lateral' },
    'wizard.design.load_theme': { en: 'Load Theme', pt: 'Carregar Tema' },
    'wizard.design.title': { en: 'Design & Typography', pt: 'Design e Tipografia' },
    'wizard.design.theme_colors': { en: 'Theme Colors', pt: 'Cores do Tema' },
    'wizard.design.colors.bg': { en: 'Page Background', pt: 'Fundo da Página' },
    'wizard.design.colors.sidebar': { en: 'Sidebar', pt: 'Barra Lateral' },
    'wizard.design.colors.text': { en: 'Text', pt: 'Texto' },
    'wizard.design.colors.lines': { en: 'Lines', pt: 'Linhas' },
    'wizard.design.colors.dots': { en: 'Dots', pt: 'Pontos' },
    'wizard.design.lang.title': { en: 'Language / Idioma', pt: 'Language / Idioma' },
    'wizard.design.lang.label': { en: 'Application Language', pt: 'Idioma do Aplicativo' },

    'wizard.events.title': { en: 'Sync Calendar Events', pt: 'Sincronizar Eventos' },
    'wizard.events.add': { en: 'Add', pt: 'Adicionar' },
    'wizard.events.sync_label': { en: 'Sync Calendar', pt: 'Sincronizar Calendário' },
    'wizard.events.delete_label': { en: 'Delete Calendar', pt: 'Excluir Calendário' },

    'wizard.export.custom_preset_desc': { en: 'Custom preset created by you.', pt: 'Preset customizado criado por você.' },

    'wizard.presets.my_presets': { en: 'My Presets', pt: 'Meus Presets' },

    'wizard.spreads.title': { en: 'Spreads', pt: 'Páginas' },
    'wizard.spreads.desc': { en: 'Generate highly structured, interlinked chronological spreads.', pt: 'Gere páginas cronológicas altamente estruturadas e interligadas.' },
    'wizard.spreads.date_range': { en: 'Date Range', pt: 'Intervalo de Datas' },
    'wizard.spreads.start_date': { en: 'Start Date', pt: 'Data de Início' },
    'wizard.spreads.end_date': { en: 'End Date', pt: 'Data de Fim' },
    'wizard.spreads.enable': { en: 'Enable Spreads', pt: 'Habilitar Páginas' },
    'wizard.spreads.nav_layout': { en: 'Navigation & Layout', pt: 'Navegação e Layout' },

    'panels.calendar.use_24h': { en: 'Use 24-hour clock', pt: 'Usar relógio de 24 horas' },
    'panels.calendar.start_time': { en: 'Agenda Start Time', pt: 'Hora de Início da Agenda' },
    'panels.calendar.end_time': { en: 'Agenda End Time', pt: 'Hora de Fim da Agenda' },
    'panels.calendar.interval': { en: 'Agenda Interval', pt: 'Intervalo da Agenda' },
    'panels.calendar.1_hour': { en: '1 hour', pt: '1 hora' },
    'panels.calendar.30_min': { en: '30 minutes', pt: '30 minutos' },
    'panels.calendar.15_min': { en: '15 minutes', pt: '15 minutos' },
    'panels.calendar.start_sunday': { en: 'Start Week on Sunday', pt: 'Começar a semana no domingo' },
    'panels.calendar.add_notes': { en: 'Additional Note Pages', pt: 'Páginas de Notas Adicionais' },
    'panels.calendar.select_template': { en: 'Select Template from Gallery', pt: 'Selecionar Template da Galeria' },
    'panels.calendar.columns': { en: 'Columns', pt: 'Colunas' },
    'panels.calendar.goals_columns': { en: 'Goals Columns', pt: 'Colunas de Metas' },
    'panels.calendar.year_template': { en: 'Year Page Template', pt: 'Template do Ano' },
    'panels.calendar.quarter_template': { en: 'Quarter Page Template', pt: 'Template do Trimestre' },
    'panels.calendar.month_template': { en: 'Month Page Template', pt: 'Template do Mês' },
    'panels.calendar.week_template': { en: 'Week Page Template', pt: 'Template da Semana' },
    'panels.calendar.day_template': { en: 'Day Page Template', pt: 'Template do Dia' },
    'panels.calendar.notes_template': { en: 'Additional Note Pages Template', pt: 'Template das Notas Adicionais' },
    'panels.calendar.use_week_since_year': { en: 'Use week number from start of year', pt: 'Usar número da semana do início do ano' },
    'panels.calendar.align_day_text': { en: 'Align Day Text', pt: 'Alinhar Texto do Dia' },
    'panels.calendar.sidebar_display': { en: 'Sidebar Display', pt: 'Exibição da Barra Lateral' },
    'panels.calendar.show_week_numbers': { en: 'Show week numbers in side bar', pt: 'Mostrar número das semanas na barra lateral' },
    'panels.calendar.year': { en: 'Year', pt: 'Ano' },
    'panels.calendar.custom_date': { en: 'Custom Date Range', pt: 'Intervalo de Datas Customizado' },
    'panels.calendar.days_week': { en: 'Days of the Week', pt: 'Dias da Semana' },
    'panels.calendar.days_month': { en: 'Days of the Month', pt: 'Dias do Mês' },
    'panels.calendar.days_year': { en: 'Days of the Year', pt: 'Dias do Ano' },
    'panels.calendar.weeks_year': { en: 'Weeks of the Year', pt: 'Semanas do Ano' },
    'panels.calendar.weeks_month': { en: 'Weeks of the Month', pt: 'Semanas do Mês' },
    'panels.calendar.months': { en: 'Months', pt: 'Meses' },
    'panels.calendar.none': { en: 'None', pt: 'Nenhum' },

    'panels.design.placeholders.name': { en: 'Name', pt: 'Nome' },
    'panels.design.placeholders.dashboard': { en: 'Dashboard', pt: 'Dashboard' },

    'panels.extras.notes': { en: 'Notes', pt: 'Anotações' },
    'panels.extras.tip': { en: 'Tip:', pt: 'Dica:' },
    'panels.extras.move_up': { en: 'Move Up', pt: 'Mover para Cima' },
    'panels.extras.move_down': { en: 'Move Down', pt: 'Mover para Baixo' },
    'panels.extras.page_template': { en: 'Page Template', pt: 'Template da Página' },
    'panels.extras.index_columns': { en: 'Index Columns', pt: 'Colunas do Índice' },
    'panels.extras.index_columns_sub': { en: '(Leave blank for auto)', pt: '(Deixe em branco para auto)' },
    'panels.extras.num_index_pages': { en: 'Number of Index Pages', pt: 'Número de Páginas de Índice' },
    'panels.extras.num_items_per_page': { en: 'Number of Items Per Index Page', pt: 'Número de Itens por Página de Índice' },
    'panels.extras.num_pages_per_item': { en: 'Number of Pages Per Item', pt: 'Número de Páginas por Item' },
    'panels.extras.name': { en: 'Name', pt: 'Nome' },
    'panels.extras.url': { en: 'ICS URL', pt: 'URL do ICS' },

    'modals.gallery.clear': { en: 'Clear search', pt: 'Limpar busca' },
    'modals.gallery.close': { en: 'Close gallery', pt: 'Fechar galeria' },
    'modals.help.start_scratch': { en: 'Start from Scratch', pt: 'Começar do Zero' },

    'preview.alerts.collection_index': { en: 'Collection Index', pt: 'Índice de Coleção' },
    'preview.alerts.year_disabled': { en: 'Year view disabled', pt: 'Visão anual desabilitada' },
    'preview.alerts.quarter_disabled': { en: 'Quarter view disabled', pt: 'Visão trimestral desabilitada' },
    'preview.alerts.month_disabled': { en: 'Month view disabled', pt: 'Visão mensal desabilitada' },
    'preview.alerts.week_disabled': { en: 'Week view disabled', pt: 'Visão semanal desabilitada' },
    'preview.alerts.day_disabled': { en: 'Day view disabled', pt: 'Visão diária desabilitada' },
    'preview.alerts.collections_disabled': { en: 'Collections disabled', pt: 'Coleções desabilitadas' },
    'preview.alerts.unsupported': { en: 'Unsupported preview page', pt: 'Página de preview não suportada' },

    'toast.printed': { en: 'just printed a planner!', pt: 'acabou de imprimir um planner!' },
    'toast.undo': { en: 'Undo', pt: 'Desfazer' },

    'share.facebook': { en: 'Share on Facebook', pt: 'Compartilhar no Facebook' },
    'share.linkedin': { en: 'Share on LinkedIn', pt: 'Compartilhar no LinkedIn' },
    'share.x': { en: 'Share on X', pt: 'Compartilhar no X' },
    'share.copy': { en: 'Copy Link', pt: 'Copiar Link' },
    'share.generic': { en: 'Share', pt: 'Compartilhar' },

    'templates.download': { en: 'Download template image', pt: 'Baixar imagem do template' },
    'templates.checks.guest': { en: 'Guest list check', pt: 'Check da lista de convidados' },
    'templates.checks.todo': { en: 'To do check', pt: 'Check da tarefa' },
    'templates.checks.water': { en: 'Water check', pt: 'Check de água' },
    'templates.checks.kindness': { en: 'Acts of kindness check', pt: 'Check de atos de bondade' },
    'templates.checks.done': { en: 'Done', pt: 'Concluído' },
    'templates.checks.goal': { en: 'Goal check', pt: 'Check da meta' },
    'templates.checks.day': { en: 'Day check', pt: 'Check do dia' },
    'templates.checks.feeding': { en: 'Feeding schedule check', pt: 'Check de alimentação' },
    'templates.checks.complete': { en: 'Complete', pt: 'Completar' }
};

for (const [key, val] of Object.entries(translations)) {
    addKeys(en, key, val.en);
    addKeys(pt, key, val.pt);
}

fs.writeFileSync(enPath, JSON.stringify(en, null, '\t') + '\n', 'utf8');
fs.writeFileSync(ptPath, JSON.stringify(pt, null, '\t') + '\n', 'utf8');
console.log('Locales updated successfully');
