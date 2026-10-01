const fs = require('fs');
const path = require('path');

const enPath = path.resolve('src/lib/locales/en-US.json');
const ptPath = path.resolve('src/lib/locales/pt-BR.json');

const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const pt = JSON.parse(fs.readFileSync(ptPath, 'utf8'));

const addKeys = (obj, pathStr, value) => {
    const keys = pathStr.split('.');
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

// Now we define the exact text replacements mapping.
const replacements = [
    // ROUTES
    { file: 'src/routes/+error.svelte', search: '<h2>Something went wrong</h2>', replace: '<h2>{i18n.t(\'routes.error.title\')}</h2>' },
    { file: 'src/routes/+error.svelte', search: '<summary>Diagnostic Details</summary>', replace: '<summary>{i18n.t(\'routes.error.details\')}</summary>' },
    { file: 'src/routes/+error.svelte', search: '>Return to Planner<', replace: '>{i18n.t(\'routes.error.return\')}<' },
    { file: 'src/routes/[...404]/+page.svelte', search: '<title>Page Not Found | Remarkably Organized</title>', replace: '<title>{i18n.t(\'routes.404.title\')} | Remarkably Organized</title>' },
    { file: 'src/routes/[...404]/+page.svelte', search: '<p>This page doesn\'t exist.</p>', replace: '<p>{i18n.t(\'routes.404.text\')}</p>' },
    { file: 'src/routes/[...404]/+page.svelte', search: '>Back to Home<', replace: '>{i18n.t(\'routes.404.back\')}<' },
    
    // Privacy and Terms
    { file: 'src/routes/privacy/+page.svelte', search: '<title>Privacy Policy \u2014 Remarkably Organized</title>', replace: '<title>{i18n.t(\'routes.privacy.title\')} \u2014 Remarkably Organized</title>' },
    { file: 'src/routes/privacy/+page.svelte', search: '<h1>Privacy Policy</h1>', replace: '<h1>{i18n.t(\'routes.privacy.title\')}</h1>' },
    { file: 'src/routes/terms/+page.svelte', search: '<title>Terms of Service \u2014 Remarkably Organized</title>', replace: '<title>{i18n.t(\'routes.terms.title\')} \u2014 Remarkably Organized</title>' },
    { file: 'src/routes/terms/+page.svelte', search: '<h1>Terms of Service</h1>', replace: '<h1>{i18n.t(\'routes.terms.title\')}</h1>' },
    { file: 'src/routes/privacy/+page.svelte', search: '>\\u2190 Back to Home<', replace: '>\\u2190 {i18n.t(\'routes.404.back\')}<' },
    { file: 'src/routes/terms/+page.svelte', search: '>\\u2190 Back to Home<', replace: '>\\u2190 {i18n.t(\'routes.404.back\')}<' },

    // PRESETS
    { file: 'src/routes/presets/[[category]]/+page.svelte', search: 'name: \'Top Planners\'', replace: 'name: i18n.t(\'routes.presets.top_planners\')' },
    { file: 'src/routes/presets/[[category]]/+page.svelte', search: 'name: \'Essentials\'', replace: 'name: i18n.t(\'routes.presets.essentials\')' },
    { file: 'src/routes/presets/[[category]]/+page.svelte', search: 'name: \'Work\'', replace: 'name: i18n.t(\'routes.presets.work\')' },
    { file: 'src/routes/presets/[[category]]/+page.svelte', search: 'name: \'Academic\'', replace: 'name: i18n.t(\'routes.presets.academic\')' },
    { file: 'src/routes/presets/[[category]]/+page.svelte', search: 'name: \'Lifestyle\'', replace: 'name: i18n.t(\'routes.presets.lifestyle\')' },
    { file: 'src/routes/presets/[[category]]/+page.svelte', search: 'name: \'Wellness\'', replace: 'name: i18n.t(\'routes.presets.wellness\')' },
    { file: 'src/routes/presets/[[category]]/+page.svelte', search: 'name: \'Hobbies\'', replace: 'name: i18n.t(\'routes.presets.hobbies\')' },

    { file: 'src/lib/components/organisms/wizard/WizardPresets.organism.svelte', search: 'name: \'Essentials\'', replace: 'name: i18n.t(\'routes.presets.essentials\')' },
    { file: 'src/lib/components/organisms/wizard/WizardPresets.organism.svelte', search: 'name: \'Work\'', replace: 'name: i18n.t(\'routes.presets.work\')' },
    { file: 'src/lib/components/organisms/wizard/WizardPresets.organism.svelte', search: 'name: \'Academic\'', replace: 'name: i18n.t(\'routes.presets.academic\')' },
    { file: 'src/lib/components/organisms/wizard/WizardPresets.organism.svelte', search: 'name: \'Lifestyle\'', replace: 'name: i18n.t(\'routes.presets.lifestyle\')' },
    { file: 'src/lib/components/organisms/wizard/WizardPresets.organism.svelte', search: 'name: \'Wellness\'', replace: 'name: i18n.t(\'routes.presets.wellness\')' },
    { file: 'src/lib/components/organisms/wizard/WizardPresets.organism.svelte', search: 'name: \'Hobbies\'', replace: 'name: i18n.t(\'routes.presets.hobbies\')' },
    { file: 'src/lib/components/organisms/wizard/WizardPresets.organism.svelte', search: 'name: \'My Presets\'', replace: 'name: i18n.t(\'wizard.presets.my_presets\')' },

    { file: 'src/lib/components/organisms/PresetsModal.organism.svelte', search: 'name: \'Essentials\'', replace: 'name: i18n.t(\'routes.presets.essentials\')' },
    { file: 'src/lib/components/organisms/PresetsModal.organism.svelte', search: 'name: \'Work\'', replace: 'name: i18n.t(\'routes.presets.work\')' },
    { file: 'src/lib/components/organisms/PresetsModal.organism.svelte', search: 'name: \'Academic\'', replace: 'name: i18n.t(\'routes.presets.academic\')' },
    { file: 'src/lib/components/organisms/PresetsModal.organism.svelte', search: 'name: \'Lifestyle\'', replace: 'name: i18n.t(\'routes.presets.lifestyle\')' },
    { file: 'src/lib/components/organisms/PresetsModal.organism.svelte', search: 'name: \'Wellness\'', replace: 'name: i18n.t(\'routes.presets.wellness\')' },
    { file: 'src/lib/components/organisms/PresetsModal.organism.svelte', search: 'name: \'Hobbies\'', replace: 'name: i18n.t(\'routes.presets.hobbies\')' },

    // WIZARD CALENDAR NOTES
    { file: 'src/lib/components/organisms/wizard/WizardCalendarNotes.organism.svelte', search: '>Calendar Notes<', replace: '>{i18n.t(\'wizard.notes.title\')}<' },
    { file: 'src/lib/components/organisms/wizard/WizardCalendarNotes.organism.svelte', search: '>Year Notes<', replace: '>{i18n.t(\'wizard.notes.year\')}<' },
    { file: 'src/lib/components/organisms/wizard/WizardCalendarNotes.organism.svelte', search: '>Quarter Notes<', replace: '>{i18n.t(\'wizard.notes.quarter\')}<' },
    { file: 'src/lib/components/organisms/wizard/WizardCalendarNotes.organism.svelte', search: '>Month Notes<', replace: '>{i18n.t(\'wizard.notes.month\')}<' },
    { file: 'src/lib/components/organisms/wizard/WizardCalendarNotes.organism.svelte', search: '>Week Notes<', replace: '>{i18n.t(\'wizard.notes.week\')}<' },
    { file: 'src/lib/components/organisms/wizard/WizardCalendarNotes.organism.svelte', search: '>Day Notes<', replace: '>{i18n.t(\'wizard.notes.day\')}<' },

    // WIZARD CALENDARS
    { file: 'src/lib/components/organisms/wizard/WizardCalendars.organism.svelte', search: '>Calendar Views<', replace: '>{i18n.t(\'wizard.calendars.title\')}<' },
    { file: 'src/lib/components/organisms/wizard/WizardCalendars.organism.svelte', search: '>Select templates for each of your primary calendar spreads.<', replace: '>{i18n.t(\'wizard.calendars.desc\')}<' },

    // WIZARD COLLECTIONS
    { file: 'src/lib/components/organisms/wizard/WizardCollections.organism.svelte', search: '>New Collection<', replace: '>{i18n.t(\'wizard.collections.new\')}<' },
    { file: 'src/lib/components/organisms/wizard/WizardCollections.organism.svelte', search: 'placeholder="Collection name..."', replace: 'placeholder={i18n.t(\'wizard.collections.name_placeholder\')}' },
    { file: 'src/lib/components/organisms/wizard/WizardCollections.organism.svelte', search: 'title="Edit collection name"', replace: 'title={i18n.t(\'wizard.collections.edit_title\')}' },
    { file: 'src/lib/components/organisms/wizard/WizardCollections.organism.svelte', search: 'aria-label="Delete Collection"', replace: 'aria-label={i18n.t(\'wizard.collections.delete_label\')}' },
    { file: 'src/lib/components/organisms/wizard/WizardCollections.organism.svelte', search: 'title="Delete Collection"', replace: 'title={i18n.t(\'wizard.collections.delete_label\')}' },
    { file: 'src/lib/components/organisms/wizard/WizardCollections.organism.svelte', search: '>Remove?<', replace: '>{i18n.t(\'wizard.collections.remove\')}<' },
    { file: 'src/lib/components/organisms/wizard/WizardCollections.organism.svelte', search: '>No custom collections yet.<', replace: '>{i18n.t(\'wizard.collections.empty\')}<' },
    { file: 'src/lib/components/organisms/wizard/WizardCollections.organism.svelte', search: 'Custom Collections\n', replace: '{i18n.t(\'wizard.collections.title\')}\n' },
    { file: 'src/lib/components/organisms/wizard/WizardCollections.organism.svelte', search: 'Extend your planner with modular notebooks and custom sections.', replace: '{i18n.t(\'wizard.collections.desc\')}' },
    { file: 'src/lib/components/organisms/wizard/WizardCollections.organism.svelte', search: '>+ Add Collection<', replace: '>{i18n.t(\'wizard.collections.add\')}<' },
    { file: 'src/lib/components/organisms/wizard/WizardCollections.organism.svelte', search: '>Cancel<', replace: '>{i18n.t(\'wizard.collections.cancel\')}<' },
    { file: 'src/lib/components/organisms/wizard/WizardCollections.organism.svelte', search: '>Add<', replace: '>{i18n.t(\'wizard.collections.btn_add\')}<' },

    // WIZARD COVER
    { file: 'src/lib/components/organisms/wizard/WizardCover.organism.svelte', search: 'label: \'None\'', replace: 'label: i18n.t(\'wizard.cover.labels.none\')' },
    { file: 'src/lib/components/organisms/wizard/WizardCover.organism.svelte', search: 'label: \'Mesh Gradient\'', replace: 'label: i18n.t(\'wizard.cover.labels.mesh\')' },
    { file: 'src/lib/components/organisms/wizard/WizardCover.organism.svelte', search: 'label: \'Topographic Waves\'', replace: 'label: i18n.t(\'wizard.cover.labels.waves\')' },
    { file: 'src/lib/components/organisms/wizard/WizardCover.organism.svelte', search: 'label: \'Bauhaus Art\'', replace: 'label: i18n.t(\'wizard.cover.labels.bauhaus\')' },
    { file: 'src/lib/components/organisms/wizard/WizardCover.organism.svelte', search: 'label: \'Halftone Pattern\'', replace: 'label: i18n.t(\'wizard.cover.labels.halftone\')' },
    { file: 'src/lib/components/organisms/wizard/WizardCover.organism.svelte', search: 'label: \'Glassmorphism\'', replace: 'label: i18n.t(\'wizard.cover.labels.glassmorphism\')' },
    { file: 'src/lib/components/organisms/wizard/WizardCover.organism.svelte', search: 'label: \'Flower of Life\'', replace: 'label: i18n.t(\'wizard.cover.labels.flower\')' },
    { file: 'src/lib/components/organisms/wizard/WizardCover.organism.svelte', search: 'label: \'Emoji Pattern\'', replace: 'label: i18n.t(\'wizard.cover.labels.emoji\')' },
    { file: 'src/lib/components/organisms/wizard/WizardCover.organism.svelte', search: 'label: \'Fractals\'', replace: 'label: i18n.t(\'wizard.cover.labels.fractals\')' },
    { file: 'src/lib/components/organisms/wizard/WizardCover.organism.svelte', search: 'label: \'Platonic Solids\'', replace: 'label: i18n.t(\'wizard.cover.labels.platonic\')' },
    { file: 'src/lib/components/organisms/wizard/WizardCover.organism.svelte', search: 'label: \'Pokerface\'', replace: 'label: i18n.t(\'wizard.cover.labels.pokerface\')' },
    { file: 'src/lib/components/organisms/wizard/WizardCover.organism.svelte', search: 'label: \'Magician\'', replace: 'label: i18n.t(\'wizard.cover.labels.magician\')' },
    { file: 'src/lib/components/organisms/wizard/WizardCover.organism.svelte', search: '>Cover Page<', replace: '>{i18n.t(\'wizard.cover.title\')}<' },
    { file: 'src/lib/components/organisms/wizard/WizardCover.organism.svelte', search: '>Personalize your planner with your name, title, and background.<', replace: '>{i18n.t(\'wizard.cover.desc\')}<' },
    { file: 'src/lib/components/organisms/wizard/WizardCover.organism.svelte', search: '>Enable<', replace: '>{i18n.t(\'wizard.cover.enable\')}<' },
    { file: 'src/lib/components/organisms/wizard/WizardCover.organism.svelte', search: '>Dark Mode<', replace: '>{i18n.t(\'wizard.cover.dark_mode\')}<' },
    { file: 'src/lib/components/organisms/wizard/WizardCover.organism.svelte', search: '>Collection Links<', replace: '>{i18n.t(\'wizard.cover.collection_links\')}<' },
    { file: 'src/lib/components/organisms/wizard/WizardCover.organism.svelte', search: '>Title<', replace: '>{i18n.t(\'wizard.cover.fields.title\')}<' },
    { file: 'src/lib/components/organisms/wizard/WizardCover.organism.svelte', search: '>Font<', replace: '>{i18n.t(\'wizard.cover.fields.font\')}<' },
    { file: 'src/lib/components/organisms/wizard/WizardCover.organism.svelte', search: '>Owner Name<', replace: '>{i18n.t(\'wizard.cover.fields.owner_name\')}<' },
    { file: 'src/lib/components/organisms/wizard/WizardCover.organism.svelte', search: '>Contact / Email<', replace: '>{i18n.t(\'wizard.cover.fields.contact\')}<' },
    { file: 'src/lib/components/organisms/wizard/WizardCover.organism.svelte', search: '>Background Style<', replace: '>{i18n.t(\'wizard.cover.fields.bg_style\')}<' },
    { file: 'src/lib/components/organisms/wizard/WizardCover.organism.svelte', search: '>Seed<', replace: '>{i18n.t(\'wizard.cover.fields.seed\')}<' },
    { file: 'src/lib/components/organisms/wizard/WizardCover.organism.svelte', search: '>Complexity<', replace: '>{i18n.t(\'wizard.cover.fields.complexity\')}<' },
    { file: 'src/lib/components/organisms/wizard/WizardCover.organism.svelte', search: 'placeholder="Cover Page Title"', replace: 'placeholder={i18n.t(\'wizard.cover.placeholders.title\')}' },
    { file: 'src/lib/components/organisms/wizard/WizardCover.organism.svelte', search: 'placeholder="Your Name"', replace: 'placeholder={i18n.t(\'wizard.cover.placeholders.name\')}' },

    // WIZARD DESIGN
    { file: 'src/lib/components/organisms/wizard/WizardDesign.organism.svelte', search: 'return \'Body Font\';', replace: 'return i18n.t(\'wizard.design.fonts.body\');' },
    { file: 'src/lib/components/organisms/wizard/WizardDesign.organism.svelte', search: 'return \'Display Font\';', replace: 'return i18n.t(\'wizard.design.fonts.display\');' },
    { file: 'src/lib/components/organisms/wizard/WizardDesign.organism.svelte', search: 'return \'Cover Font\';', replace: 'return i18n.t(\'wizard.design.fonts.cover\');' },
    { file: 'src/lib/components/organisms/wizard/WizardDesign.organism.svelte', search: 'return \'Topbar Font\';', replace: 'return i18n.t(\'wizard.design.fonts.topbar\');' },
    { file: 'src/lib/components/organisms/wizard/WizardDesign.organism.svelte', search: 'return \'Sidebar Font\';', replace: 'return i18n.t(\'wizard.design.fonts.sidebar\');' },
    { file: 'src/lib/components/organisms/wizard/WizardDesign.organism.svelte', search: '>Load Theme<', replace: '>{i18n.t(\'wizard.design.load_theme\')}<' },
    { file: 'src/lib/components/organisms/wizard/WizardDesign.organism.svelte', search: '>Design & Typography<', replace: '>{i18n.t(\'wizard.design.title\')}<' },
    { file: 'src/lib/components/organisms/wizard/WizardDesign.organism.svelte', search: '>Theme Colors<', replace: '>{i18n.t(\'wizard.design.theme_colors\')}<' },
    { file: 'src/lib/components/organisms/wizard/WizardDesign.organism.svelte', search: '>Page Background<', replace: '>{i18n.t(\'wizard.design.colors.bg\')}<' },
    { file: 'src/lib/components/organisms/wizard/WizardDesign.organism.svelte', search: '>Sidebar<', replace: '>{i18n.t(\'wizard.design.colors.sidebar\')}<' },
    { file: 'src/lib/components/organisms/wizard/WizardDesign.organism.svelte', search: '>Text<', replace: '>{i18n.t(\'wizard.design.colors.text\')}<' },
    { file: 'src/lib/components/organisms/wizard/WizardDesign.organism.svelte', search: '>Lines<', replace: '>{i18n.t(\'wizard.design.colors.lines\')}<' },
    { file: 'src/lib/components/organisms/wizard/WizardDesign.organism.svelte', search: '>Dots<', replace: '>{i18n.t(\'wizard.design.colors.dots\')}<' },
    { file: 'src/lib/components/organisms/wizard/WizardDesign.organism.svelte', search: '>Language / Idioma<', replace: '>{i18n.t(\'wizard.design.lang.title\')}<' },
    { file: 'src/lib/components/organisms/wizard/WizardDesign.organism.svelte', search: '>Application Language<', replace: '>{i18n.t(\'wizard.design.lang.label\')}<' },

    // WIZARD EVENTS
    { file: 'src/lib/components/organisms/wizard/WizardEvents.organism.svelte', search: '>Sync Calendar Events<', replace: '>{i18n.t(\'wizard.events.title\')}<' },
    { file: 'src/lib/components/organisms/wizard/WizardEvents.organism.svelte', search: '>Add<', replace: '>{i18n.t(\'wizard.events.add\')}<' },
    { file: 'src/lib/components/organisms/wizard/WizardEvents.organism.svelte', search: 'aria-label="Sync Calendar"', replace: 'aria-label={i18n.t(\'wizard.events.sync_label\')}' },
    { file: 'src/lib/components/organisms/wizard/WizardEvents.organism.svelte', search: 'aria-label="Delete Calendar"', replace: 'aria-label={i18n.t(\'wizard.events.delete_label\')}' },

    // WIZARD EXPORT
    { file: 'src/lib/components/organisms/wizard/WizardExport.organism.svelte', search: 'description: \'Custom preset created by you.\'', replace: 'description: i18n.t(\'wizard.export.custom_preset_desc\')' },

    // WIZARD SPREADS
    { file: 'src/lib/components/organisms/wizard/WizardSpreads.organism.svelte', search: '>Spreads<', replace: '>{i18n.t(\'wizard.spreads.title\')}<' },
    { file: 'src/lib/components/organisms/wizard/WizardSpreads.organism.svelte', search: '>Generate highly structured, interlinked chronological spreads.<', replace: '>{i18n.t(\'wizard.spreads.desc\')}<' },
    { file: 'src/lib/components/organisms/wizard/WizardSpreads.organism.svelte', search: '>Date Range<', replace: '>{i18n.t(\'wizard.spreads.date_range\')}<' },
    { file: 'src/lib/components/organisms/wizard/WizardSpreads.organism.svelte', search: '>Start Date<', replace: '>{i18n.t(\'wizard.spreads.start_date\')}<' },
    { file: 'src/lib/components/organisms/wizard/WizardSpreads.organism.svelte', search: '>End Date<', replace: '>{i18n.t(\'wizard.spreads.end_date\')}<' },
    { file: 'src/lib/components/organisms/wizard/WizardSpreads.organism.svelte', search: '>Enable Spreads<', replace: '>{i18n.t(\'wizard.spreads.enable\')}<' },
    { file: 'src/lib/components/organisms/wizard/WizardSpreads.organism.svelte', search: '>Navigation & Layout<', replace: '>{i18n.t(\'wizard.spreads.nav_layout\')}<' },

    // PANELS & MODALS
    { file: 'src/lib/components/organisms/DesignPanel.organism.svelte', search: 'placeholder="Cover Page Title"', replace: 'placeholder={i18n.t(\'wizard.cover.placeholders.title\')}' },
    { file: 'src/lib/components/organisms/DesignPanel.organism.svelte', search: 'placeholder="Name"', replace: 'placeholder={i18n.t(\'panels.design.placeholders.name\')}' },
    { file: 'src/lib/components/organisms/DesignPanel.organism.svelte', search: 'placeholder="Dashboard"', replace: 'placeholder={i18n.t(\'panels.design.placeholders.dashboard\')}' },

    { file: 'src/lib/components/organisms/ExtrasPanel.organism.svelte', search: 'name: \'Notes\'', replace: 'name: i18n.t(\'panels.extras.notes\')' },
    { file: 'src/lib/components/organisms/ExtrasPanel.organism.svelte', search: '>Tip:<', replace: '>{i18n.t(\'panels.extras.tip\')}<' },
    { file: 'src/lib/components/organisms/ExtrasPanel.organism.svelte', search: 'title="Move Up"', replace: 'title={i18n.t(\'panels.extras.move_up\')}' },
    { file: 'src/lib/components/organisms/ExtrasPanel.organism.svelte', search: 'title="Move Down"', replace: 'title={i18n.t(\'panels.extras.move_down\')}' },
    { file: 'src/lib/components/organisms/ExtrasPanel.organism.svelte', search: 'placeholder="Name"', replace: 'placeholder={i18n.t(\'panels.extras.name\')}' },
    { file: 'src/lib/components/organisms/ExtrasPanel.organism.svelte', search: '>Page Template<', replace: '>{i18n.t(\'panels.extras.page_template\')}<' },
    { file: 'src/lib/components/organisms/ExtrasPanel.organism.svelte', search: '>Columns<', replace: '>{i18n.t(\'panels.calendar.columns\')}<' },
    { file: 'src/lib/components/organisms/ExtrasPanel.organism.svelte', search: 'placeholder="Columns"', replace: 'placeholder={i18n.t(\'panels.calendar.columns\')}' },
    { file: 'src/lib/components/organisms/ExtrasPanel.organism.svelte', search: '>Index Columns <', replace: '>{i18n.t(\'panels.extras.index_columns\')} <' },
    { file: 'src/lib/components/organisms/ExtrasPanel.organism.svelte', search: '>(Leave blank for auto)<', replace: '>{i18n.t(\'panels.extras.index_columns_sub\')}<' },
    { file: 'src/lib/components/organisms/ExtrasPanel.organism.svelte', search: 'placeholder="Number of Index Pages"', replace: 'placeholder={i18n.t(\'panels.extras.num_index_pages\')}' },
    { file: 'src/lib/components/organisms/ExtrasPanel.organism.svelte', search: 'placeholder="Number of Items Per Index Page"', replace: 'placeholder={i18n.t(\'panels.extras.num_items_per_page\')}' },
    { file: 'src/lib/components/organisms/ExtrasPanel.organism.svelte', search: 'placeholder="Number of Pages Per Item"', replace: 'placeholder={i18n.t(\'panels.extras.num_pages_per_item\')}' },
    { file: 'src/lib/components/organisms/ExtrasPanel.organism.svelte', search: '>Sync Calendar Events<', replace: '>{i18n.t(\'wizard.events.title\')}<' },
    { file: 'src/lib/components/organisms/ExtrasPanel.organism.svelte', search: '>Name<', replace: '>{i18n.t(\'panels.extras.name\')}<' },
    { file: 'src/lib/components/organisms/ExtrasPanel.organism.svelte', search: '>ICS URL<', replace: '>{i18n.t(\'panels.extras.url\')}<' },

    { file: 'src/lib/components/organisms/GalleryModal.organism.svelte', search: 'aria-label="Clear search"', replace: 'aria-label={i18n.t(\'modals.gallery.clear\')}' },
    { file: 'src/lib/components/organisms/GalleryModal.organism.svelte', search: 'aria-label="Close gallery"', replace: 'aria-label={i18n.t(\'modals.gallery.close\')}' },

    { file: 'src/lib/components/organisms/HelpModal.organism.svelte', search: 'preset_name: \'Start from Scratch\'', replace: 'preset_name: i18n.t(\'modals.help.start_scratch\')' },
    
    // TEMPLATES
    { file: 'src/lib/components/templates/EventPlanner.template.svelte', search: 'aria-label="Guest list check"', replace: 'aria-label={i18n.t(\'templates.checks.guest\')}' },
    { file: 'src/lib/components/templates/EventPlanner.template.svelte', search: 'aria-label="To do check"', replace: 'aria-label={i18n.t(\'templates.checks.todo\')}' },
    { file: 'src/lib/components/templates/GardenPlanner.template.svelte', search: 'aria-label="Water check"', replace: 'aria-label={i18n.t(\'templates.checks.water\')}' },
    { file: 'src/lib/components/templates/GratitudePage.template.svelte', search: 'aria-label="Acts of kindness check"', replace: 'aria-label={i18n.t(\'templates.checks.kindness\')}' },
    { file: 'src/lib/components/templates/LearningTracker.template.svelte', search: 'aria-label="Done"', replace: 'aria-label={i18n.t(\'templates.checks.done\')}' },
    { file: 'src/lib/components/templates/MeditationLog.template.svelte', search: 'aria-label="Goal check"', replace: 'aria-label={i18n.t(\'templates.checks.goal\')}' },
    { file: 'src/lib/components/templates/MeditationLog.template.svelte', search: 'aria-label="Day check"', replace: 'aria-label={i18n.t(\'templates.checks.day\')}' },
    { file: 'src/lib/components/templates/PetCare.template.svelte', search: 'aria-label="Feeding schedule check"', replace: 'aria-label={i18n.t(\'templates.checks.feeding\')}' },
    { file: 'src/lib/components/templates/SideQuestTracker.template.svelte', search: 'aria-label="Complete"', replace: 'aria-label={i18n.t(\'templates.checks.complete\')}' },

    // MOLECULES
    { file: 'src/lib/components/molecules/PrintToast.molecule.svelte', search: '>just printed a planner!<', replace: '>{i18n.t(\'toast.printed\')}<' },
    { file: 'src/lib/components/molecules/Toast.molecule.svelte', search: '>Undo<', replace: '>{i18n.t(\'toast.undo\')}<' },
    { file: 'src/lib/components/molecules/TemplateThumbnail.molecule.svelte', search: 'aria-label="Download template image"', replace: 'aria-label={i18n.t(\'templates.download\')}' },

    { file: 'src/lib/components/molecules/ShareFab.molecule.svelte', search: 'aria-label="Share on Facebook"', replace: 'aria-label={i18n.t(\'share.facebook\')}' },
    { file: 'src/lib/components/molecules/ShareFab.molecule.svelte', search: 'aria-label="Share on LinkedIn"', replace: 'aria-label={i18n.t(\'share.linkedin\')}' },
    { file: 'src/lib/components/molecules/ShareFab.molecule.svelte', search: 'aria-label="Share on X"', replace: 'aria-label={i18n.t(\'share.x\')}' },
    { file: 'src/lib/components/molecules/ShareFab.molecule.svelte', search: 'aria-label="Copy Link"', replace: 'aria-label={i18n.t(\'share.copy\')}' },
    { file: 'src/lib/components/molecules/ShareFab.molecule.svelte', search: 'aria-label="Share"', replace: 'aria-label={i18n.t(\'share.generic\')}' },

    { file: 'src/lib/components/molecules/InteractivePlannerPreview.molecule.svelte', search: 'return \'Collection Index\'', replace: 'return i18n.t(\'preview.alerts.collection_index\')' },
    { file: 'src/lib/components/molecules/InteractivePlannerPreview.molecule.svelte', search: '>Year view disabled<', replace: '>{i18n.t(\'preview.alerts.year_disabled\')}<' },
    { file: 'src/lib/components/molecules/InteractivePlannerPreview.molecule.svelte', search: '>Quarter view disabled<', replace: '>{i18n.t(\'preview.alerts.quarter_disabled\')}<' },
    { file: 'src/lib/components/molecules/InteractivePlannerPreview.molecule.svelte', search: '>Month view disabled<', replace: '>{i18n.t(\'preview.alerts.month_disabled\')}<' },
    { file: 'src/lib/components/molecules/InteractivePlannerPreview.molecule.svelte', search: '>Week view disabled<', replace: '>{i18n.t(\'preview.alerts.week_disabled\')}<' },
    { file: 'src/lib/components/molecules/InteractivePlannerPreview.molecule.svelte', search: '>Day view disabled<', replace: '>{i18n.t(\'preview.alerts.day_disabled\')}<' },
    { file: 'src/lib/components/molecules/InteractivePlannerPreview.molecule.svelte', search: '>Collections disabled<', replace: '>{i18n.t(\'preview.alerts.collections_disabled\')}<' },
    { file: 'src/lib/components/molecules/InteractivePlannerPreview.molecule.svelte', search: '>Unsupported preview page<', replace: '>{i18n.t(\'preview.alerts.unsupported\')}<' },

    // CALENDAR PANEL
    { file: 'src/lib/components/organisms/CalendarPanel.organism.svelte', search: '>Use 24-hour clock<', replace: '>{i18n.t(\'panels.calendar.use_24h\')}<' },
    { file: 'src/lib/components/organisms/CalendarPanel.organism.svelte', search: '>Agenda Start Time<', replace: '>{i18n.t(\'panels.calendar.start_time\')}<' },
    { file: 'src/lib/components/organisms/CalendarPanel.organism.svelte', search: '>Agenda End Time<', replace: '>{i18n.t(\'panels.calendar.end_time\')}<' },
    { file: 'src/lib/components/organisms/CalendarPanel.organism.svelte', search: '>Agenda Interval<', replace: '>{i18n.t(\'panels.calendar.interval\')}<' },
    { file: 'src/lib/components/organisms/CalendarPanel.organism.svelte', search: '>1 hour<', replace: '>{i18n.t(\'panels.calendar.1_hour\')}<' },
    { file: 'src/lib/components/organisms/CalendarPanel.organism.svelte', search: '>30 minutes<', replace: '>{i18n.t(\'panels.calendar.30_min\')}<' },
    { file: 'src/lib/components/organisms/CalendarPanel.organism.svelte', search: '>15 minutes<', replace: '>{i18n.t(\'panels.calendar.15_min\')}<' },
    { file: 'src/lib/components/organisms/CalendarPanel.organism.svelte', search: '>Start Week on Sunday<', replace: '>{i18n.t(\'panels.calendar.start_sunday\')}<' },
    { file: 'src/lib/components/organisms/CalendarPanel.organism.svelte', search: '>Additional Note Pages<', replace: '>{i18n.t(\'panels.calendar.add_notes\')}<' },
    { file: 'src/lib/components/organisms/CalendarPanel.organism.svelte', search: 'placeholder="Additional Note Pages"', replace: 'placeholder={i18n.t(\'panels.calendar.add_notes\')}' },
    { file: 'src/lib/components/organisms/CalendarPanel.organism.svelte', search: 'aria-label="Select Template from Gallery"', replace: 'aria-label={i18n.t(\'panels.calendar.select_template\')}' },
    { file: 'src/lib/components/organisms/CalendarPanel.organism.svelte', search: '>Columns<', replace: '>{i18n.t(\'panels.calendar.columns\')}<' },
    { file: 'src/lib/components/organisms/CalendarPanel.organism.svelte', search: '>Goals Columns<', replace: '>{i18n.t(\'panels.calendar.goals_columns\')}<' },
    { file: 'src/lib/components/organisms/CalendarPanel.organism.svelte', search: '>Year Page Template<', replace: '>{i18n.t(\'panels.calendar.year_template\')}<' },
    { file: 'src/lib/components/organisms/CalendarPanel.organism.svelte', search: '>Quarter Page Template<', replace: '>{i18n.t(\'panels.calendar.quarter_template\')}<' },
    { file: 'src/lib/components/organisms/CalendarPanel.organism.svelte', search: '>Month Page Template<', replace: '>{i18n.t(\'panels.calendar.month_template\')}<' },
    { file: 'src/lib/components/organisms/CalendarPanel.organism.svelte', search: '>Week Page Template<', replace: '>{i18n.t(\'panels.calendar.week_template\')}<' },
    { file: 'src/lib/components/organisms/CalendarPanel.organism.svelte', search: '>Day Page Template<', replace: '>{i18n.t(\'panels.calendar.day_template\')}<' },
    { file: 'src/lib/components/organisms/CalendarPanel.organism.svelte', search: '>Additional Note Pages Template<', replace: '>{i18n.t(\'panels.calendar.notes_template\')}<' },
    { file: 'src/lib/components/organisms/CalendarPanel.organism.svelte', search: '>Use week number from start of year<', replace: '>{i18n.t(\'panels.calendar.use_week_since_year\')}<' },
    { file: 'src/lib/components/organisms/CalendarPanel.organism.svelte', search: '>Align Day Text<', replace: '>{i18n.t(\'panels.calendar.align_day_text\')}<' },
    { file: 'src/lib/components/organisms/CalendarPanel.organism.svelte', search: '>Sidebar Display<', replace: '>{i18n.t(\'panels.calendar.sidebar_display\')}<' },
    { file: 'src/lib/components/organisms/CalendarPanel.organism.svelte', search: '>Show week numbers in side bar<', replace: '>{i18n.t(\'panels.calendar.show_week_numbers\')}<' },
    { file: 'src/lib/components/organisms/CalendarPanel.organism.svelte', search: '>Year<', replace: '>{i18n.t(\'panels.calendar.year\')}<' },
    { file: 'src/lib/components/organisms/CalendarPanel.organism.svelte', search: '>Custom Date Range<', replace: '>{i18n.t(\'panels.calendar.custom_date\')}<' },
    { file: 'src/lib/components/organisms/CalendarPanel.organism.svelte', search: '>Start Date<', replace: '>{i18n.t(\'wizard.spreads.start_date\')}<' },
    { file: 'src/lib/components/organisms/CalendarPanel.organism.svelte', search: 'placeholder="Start Date"', replace: 'placeholder={i18n.t(\'wizard.spreads.start_date\')}' },
    { file: 'src/lib/components/organisms/CalendarPanel.organism.svelte', search: '>End Date<', replace: '>{i18n.t(\'wizard.spreads.end_date\')}<' },
    { file: 'src/lib/components/organisms/CalendarPanel.organism.svelte', search: 'placeholder="End Date"', replace: 'placeholder={i18n.t(\'wizard.spreads.end_date\')}' },
    { file: 'src/lib/components/organisms/CalendarPanel.organism.svelte', search: '>Days of the Week<', replace: '>{i18n.t(\'panels.calendar.days_week\')}<' },
    { file: 'src/lib/components/organisms/CalendarPanel.organism.svelte', search: '>Days of the Month<', replace: '>{i18n.t(\'panels.calendar.days_month\')}<' },
    { file: 'src/lib/components/organisms/CalendarPanel.organism.svelte', search: '>Days of the Year<', replace: '>{i18n.t(\'panels.calendar.days_year\')}<' },
    { file: 'src/lib/components/organisms/CalendarPanel.organism.svelte', search: '>Weeks of the Year<', replace: '>{i18n.t(\'panels.calendar.weeks_year\')}<' },
    { file: 'src/lib/components/organisms/CalendarPanel.organism.svelte', search: '>Weeks of the Month<', replace: '>{i18n.t(\'panels.calendar.weeks_month\')}<' },
    { file: 'src/lib/components/organisms/CalendarPanel.organism.svelte', search: '>Months<', replace: '>{i18n.t(\'panels.calendar.months\')}<' },
    { file: 'src/lib/components/organisms/CalendarPanel.organism.svelte', search: '>None<', replace: '>{i18n.t(\'panels.calendar.none\')}<' },
];

for (const rep of replacements) {
    const filePath = path.resolve(rep.file);
    if (!fs.existsSync(filePath)) {
        console.warn('File not found:', filePath);
        continue;
    }
    let content = fs.readFileSync(filePath, 'utf8');
    // Ensure file has useI18n import
    if (!content.includes('useI18n')) {
        content = content.replace('<script lang="ts">', '<script lang="ts">\n\timport { useI18n } from \'$state\';\n\tconst i18n = useI18n();\n');
        if (!content.includes('<script lang="ts">')) {
            content = '<script lang="ts">\n\timport { useI18n } from \'$state\';\n\tconst i18n = useI18n();\n</script>\n' + content;
        }
    } else if (content.includes('useI18n') && !content.includes('const i18n = useI18n()')) {
        content = content.replace(/import {.*useI18n.*} from .*/, match => match + '\n\tconst i18n = useI18n();');
    }

    content = content.split(rep.search).join(rep.replace);
    fs.writeFileSync(filePath, content, 'utf8');
}
console.log('Replacements applied successfully');
