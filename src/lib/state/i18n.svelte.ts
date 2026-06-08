import { getContext, setContext } from 'svelte';
import ptBR from '../locales/pt-BR.json';
import enUS from '../locales/en-US.json';

const translations: Record<string, any> = {
	'pt-BR': ptBR,
	'en-US': enUS,
};

export class I18nManager {
	currentLocale = $state('pt-BR');

	t(path: string): string {
		const keys = path.split('.');
		let obj = translations[this.currentLocale];
		for (const key of keys) {
			if (!obj || obj[key] === undefined) {
				// Fallback to English
				let fallback = translations['en-US'];
				for (const fallbackKey of keys) {
					if (!fallback || fallback[fallbackKey] === undefined) {
						return path;
					}
					fallback = fallback[fallbackKey];
				}
				return fallback;
			}
			obj = obj[key];
		}
		return typeof obj === 'string' ? obj : path;
	}

	tTemplate(value: string, fallback: string): string {
		const key = `templates.${value}`;
		const translated = this.t(key);
		return translated === key ? fallback : translated;
	}

	tCategory(id: string, field: 'title' | 'description', fallback: string): string {
		const key = `categories.${id}.${field}`;
		const translated = this.t(key);
		return translated === key ? fallback : translated;
	}

	tPreset(id: string, field: 'name' | 'description', fallback: string): string {
		const key = `presets.${id}.${field}`;
		const translated = this.t(key);
		return translated === key ? fallback : translated;
	}

	tTheme(id: string, fallback: string): string {
		const key = `themes.${id}`;
		const translated = this.t(key);
		return translated === key ? fallback : translated;
	}

	tPresetCategory(id: string, fallback: string): string {
		const key = `preset_categories.${id}`;
		const translated = this.t(key);
		return translated === key ? fallback : translated;
	}

}

const I18N_KEY = Symbol('i18n');

export let globalI18n: I18nManager | null = null;

export function initI18n(initialLocale = 'pt-BR') {
	const manager = new I18nManager();
	manager.currentLocale = initialLocale;
	globalI18n = manager;
	setContext(I18N_KEY, manager);
	return manager;
}

export function useI18n() {
	const manager = getContext<I18nManager>(I18N_KEY);
	if (!manager) {
		throw new Error('i18n context not initialized');
	}
	return manager;
}
