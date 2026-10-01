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
    'wizard.indexes.title': { en: 'Indexes', pt: 'Índices' },
    'wizard.indexes.configure': { en: 'Configure index pages for your collections.', pt: 'Configure as páginas de índice para suas coleções.' },
    'wizard.indexes.pages': { en: 'Index pages', pt: 'Páginas de índice' },
    'wizard.indexes.pages_per_item': { en: 'Pages per item', pt: 'Páginas por item' },
    
    'wizard.events.desc': { en: 'Automatically populate your spreads with real-world events via public ICS links.', pt: 'Preencha automaticamente suas páginas com eventos reais usando links ICS públicos.' },
    'wizard.events.name_placeholder': { en: 'Name (e.g. Holidays)', pt: 'Nome (ex. Feriados)' },

    'wizard.collections.custom_collections': { en: 'Custom Collections', pt: 'Coleções Customizadas' },
    'wizard.collections.add': { en: '+ Add Collection', pt: '+ Adicionar Coleção' },
    'wizard.collections.pages_per_index': { en: 'Pages per Index Link', pt: 'Páginas por Link no Índice' },

    'ui.calendar_views': { en: 'Calendar Views', pt: 'Visualizações de Calendário' },
    'ui.yearly': { en: 'Yearly', pt: 'Anual' },
    'ui.quarterly': { en: 'Quarterly', pt: 'Trimestral' },
    'ui.monthly': { en: 'Monthly', pt: 'Mensal' },
    'ui.weekly': { en: 'Weekly', pt: 'Semanal' },
    'ui.daily': { en: 'Daily', pt: 'Diário' },
    'ui.select_template': { en: 'Select Template', pt: 'Selecionar Template' },

    'templates.calendar-year': { en: 'Year Calendar', pt: 'Calendário Anual' },
    'templates.overview-quarter': { en: 'Quarterly Overview', pt: 'Visão Trimestral' },
    'templates.calendar-month': { en: 'Monthly Calendar', pt: 'Calendário Mensal' },
    'templates.agenda-week': { en: 'Weekly Agenda', pt: 'Agenda Semanal' },
    'templates.agenda-day': { en: 'Daily Agenda', pt: 'Agenda Diária' },
    'templates.notes': { en: 'Notes', pt: 'Anotações' },
    'templates.lined-large': { en: 'Notes - Lined - Large', pt: 'Anotações - Pautado - Grande' },
    'templates.collection-index': { en: 'Collection Index', pt: 'Índice de Coleção' },
    'templates.blank': { en: 'Blank Page', pt: 'Página em Branco' }
};

for (const [key, val] of Object.entries(translations)) {
    addKeys(en, key, val.en);
    addKeys(pt, key, val.pt);
}

fs.writeFileSync(enPath, JSON.stringify(en, null, '\t') + '\n', 'utf8');
fs.writeFileSync(ptPath, JSON.stringify(pt, null, '\t') + '\n', 'utf8');

// Now we define the exact text replacements mapping.
const replacements = [
    // WizardIndexes
    { file: 'src/lib/components/organisms/wizard/WizardIndexes.organism.svelte', search: '>Indexes<', replace: '>{i18n.t(\'wizard.indexes.title\')}<' },
    { file: 'src/lib/components/organisms/wizard/WizardIndexes.organism.svelte', search: 'Indexes\n', replace: '{i18n.t(\'wizard.indexes.title\')}\n' },
    { file: 'src/lib/components/organisms/wizard/WizardIndexes.organism.svelte', search: 'Configure index pages for your collections.', replace: '{i18n.t(\'wizard.indexes.configure\')}' },
    { file: 'src/lib/components/organisms/wizard/WizardIndexes.organism.svelte', search: 'Index pages\n', replace: '{i18n.t(\'wizard.indexes.pages\')}\n' },
    { file: 'src/lib/components/organisms/wizard/WizardIndexes.organism.svelte', search: 'Pages per item\n', replace: '{i18n.t(\'wizard.indexes.pages_per_item\')}\n' },

    // WizardEvents
    { file: 'src/lib/components/organisms/wizard/WizardEvents.organism.svelte', search: 'Automatically populate your spreads with real-world events via public ICS links.', replace: '{i18n.t(\'wizard.events.desc\')}' },
    { file: 'src/lib/components/organisms/wizard/WizardEvents.organism.svelte', search: 'placeholder="Name (e.g. Holidays)"', replace: 'placeholder={i18n.t(\'wizard.events.name_placeholder\')}' },

    // WizardCollections
    { file: 'src/lib/components/organisms/wizard/WizardCollections.organism.svelte', search: '>Custom Collections<', replace: '>{i18n.t(\'wizard.collections.custom_collections\')}<' },
    { file: 'src/lib/components/organisms/wizard/WizardCollections.organism.svelte', search: 'Custom Collections\n', replace: '{i18n.t(\'wizard.collections.custom_collections\')}\n' },
    { file: 'src/lib/components/organisms/wizard/WizardCollections.organism.svelte', search: '>+ Add Collection<', replace: '>{i18n.t(\'wizard.collections.add\')}<' },
    { file: 'src/lib/components/organisms/wizard/WizardCollections.organism.svelte', search: 'Pages per Index Link', replace: '{i18n.t(\'wizard.collections.pages_per_index\')}' },

    // WizardSpreads
    { file: 'src/lib/components/organisms/wizard/WizardSpreads.organism.svelte', search: 'Yearly\n', replace: '{i18n.t(\'ui.yearly\')}\n' },
    { file: 'src/lib/components/organisms/wizard/WizardSpreads.organism.svelte', search: 'Quarterly\n', replace: '{i18n.t(\'ui.quarterly\')}\n' },
    { file: 'src/lib/components/organisms/wizard/WizardSpreads.organism.svelte', search: 'Monthly\n', replace: '{i18n.t(\'ui.monthly\')}\n' },
    { file: 'src/lib/components/organisms/wizard/WizardSpreads.organism.svelte', search: 'Weekly\n', replace: '{i18n.t(\'ui.weekly\')}\n' },
    { file: 'src/lib/components/organisms/wizard/WizardSpreads.organism.svelte', search: 'Daily\n', replace: '{i18n.t(\'ui.daily\')}\n' },

    // CalendarPanel
    { file: 'src/lib/components/organisms/CalendarPanel.organism.svelte', search: '>Calendar Views<', replace: '>{i18n.t(\'ui.calendar_views\')}<' },
    { file: 'src/lib/components/organisms/CalendarPanel.organism.svelte', search: 'Calendar Views\n', replace: '{i18n.t(\'ui.calendar_views\')}\n' },
    { file: 'src/lib/components/organisms/CalendarPanel.organism.svelte', search: 'Yearly\n', replace: '{i18n.t(\'ui.yearly\')}\n' },
    { file: 'src/lib/components/organisms/CalendarPanel.organism.svelte', search: 'Quarterly\n', replace: '{i18n.t(\'ui.quarterly\')}\n' },
    { file: 'src/lib/components/organisms/CalendarPanel.organism.svelte', search: 'Monthly\n', replace: '{i18n.t(\'ui.monthly\')}\n' },
    { file: 'src/lib/components/organisms/CalendarPanel.organism.svelte', search: 'Weekly\n', replace: '{i18n.t(\'ui.weekly\')}\n' },
    { file: 'src/lib/components/organisms/CalendarPanel.organism.svelte', search: 'Daily\n', replace: '{i18n.t(\'ui.daily\')}\n' },

    // TemplateThumbnail (to translate templateNames dynamically)
    { file: 'src/lib/components/molecules/TemplateThumbnail.molecule.svelte', search: '{templateName || \'Select Template\'}', replace: '{i18n.tTemplate(templateValue, templateName) || i18n.t(\'ui.select_template\')}' }
];

for (const rep of replacements) {
    const filePath = path.resolve(rep.file);
    if (!fs.existsSync(filePath)) {
        console.warn('File not found:', filePath);
        continue;
    }
    let content = fs.readFileSync(filePath, 'utf8');
    // Ensure file has useI18n import if needed
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
