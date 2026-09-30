import type { PageTemplate } from '$state';

export type PlannerProductType = 'planner' | 'notebook' | 'agenda' | 'kit';

export interface ReusableCollectionTemplate {
	id: string;
	name: string;
	description: string;
	pageTemplate: PageTemplate;
	defaultColumns?: number;
	defaultTotal: number;
}

export interface ReusableElementItem {
	id: string;
	name: string;
	kind: 'sticker' | 'block';
}

export const REUSABLE_COLLECTION_TEMPLATES: ReusableCollectionTemplate[] = [
	{
		id: 'notes-dotted',
		name: 'Notes Dotted',
		description: 'Caderno pontilhado para notas rápidas.',
		pageTemplate: 'dotted',
		defaultTotal: 24,
	},
	{
		id: 'study-lined',
		name: 'Study Lined',
		description: 'Páginas pautadas para estudos e resumos.',
		pageTemplate: 'lined',
		defaultColumns: 1,
		defaultTotal: 30,
	},
	{
		id: 'project-kanban',
		name: 'Project Board',
		description: 'Layout visual para projetos e tarefas.',
		pageTemplate: 'sprint-planner',
		defaultTotal: 12,
	},
	{
		id: 'finance-pack',
		name: 'Finance Pack',
		description: 'Rastreamento financeiro mensal.',
		pageTemplate: 'finance-tracker',
		defaultTotal: 12,
	},
];

export const REUSABLE_ELEMENTS_LIBRARY: ReusableElementItem[] = [
	{ id: 'sticker-priority', name: 'Priority Sticker', kind: 'sticker' },
	{ id: 'sticker-deadline', name: 'Deadline Sticker', kind: 'sticker' },
	{ id: 'sticker-habit', name: 'Habit Sticker', kind: 'sticker' },
	{ id: 'block-top-3', name: 'Top 3 Priorities Block', kind: 'block' },
	{ id: 'block-week-review', name: 'Weekly Review Block', kind: 'block' },
	{ id: 'block-hydration', name: 'Hydration Tracker Block', kind: 'block' },
];

export const PRODUCT_TEMPLATE_STRUCTURES: Record<
	PlannerProductType,
	{
		label: string;
		description: string;
	}
> = {
	planner: {
		label: 'Planner',
		description: 'Fluxo completo com páginas anuais, mensais, semanais e diárias.',
	},
	notebook: {
		label: 'Notebook',
		description: 'Estrutura simplificada para caderno digital e coleções.',
	},
	agenda: {
		label: 'Agenda',
		description: 'Foco em planejamento temporal com layouts de agenda.',
	},
	kit: {
		label: 'Template Kit',
		description: 'Pacote modular para stickers, coleções e páginas especiais.',
	},
};
