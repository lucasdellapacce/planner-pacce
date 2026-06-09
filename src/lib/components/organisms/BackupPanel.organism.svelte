<script lang="ts">
	import SaveIcon from '~icons/fa/save';
	import LoadIcon from '~icons/fa/history';
	import ExportIcon from '~icons/fa/download';
	import ImportIcon from '~icons/fa/upload';
	import MagicIcon from '~icons/fa/magic';
	import { useI18n } from '$lib/state/i18n.svelte';

	const i18n = useI18n();

	let {
		onSave,
		onLoad,
		onExport,
		onImport,
		onReset,
		onOpenPresets,
	}: {
		onSave: () => void;
		onLoad: () => void;
		onExport: () => void;
		onImport: () => void;
		onReset: () => void;
		onOpenPresets: () => void;
	} = $props();
</script>

<div class="panel-content">
	<h2>
		<span style="display: flex; align-items: baseline; gap: 0.5rem;">
			{i18n.t('ui.backup_panel.title')}
		</span>
		<SaveIcon style="opacity: 0.5;" />
	</h2>
	<div class="config-buttons">
		<button type="button" onclick={onSave}>
			<SaveIcon /> {i18n.t('ui.backup_panel.save_to_browser')}
		</button>
		<button type="button" onclick={onLoad}>
			<LoadIcon /> {i18n.t('ui.backup_panel.load_from_browser')}
		</button>
		<button type="button" onclick={onExport}>
			<ExportIcon /> {i18n.t('ui.backup_panel.export_to_file')}
		</button>
		<button type="button" onclick={onImport}>
			<ImportIcon /> {i18n.t('ui.backup_panel.import_from_file')}
		</button>
		<button type="button" class="btn-reset" onclick={onReset}>{i18n.t('ui.backup_panel.reset_to_defaults')}</button>
	</div>

	<div class="presets-sticky">
		<button type="button" class="presets-cta" onclick={onOpenPresets}>
			<MagicIcon />
			{i18n.t('ui.backup_panel.load_from_presets')}
		</button>
	</div>
</div>

<style lang="scss">
	@use '../../styles/_panels.scss' as *;

	.panel-content {
		:global {
			@include panel-styles;
		}
	}

	.presets-sticky {
		margin-top: 1.5rem;
		padding-top: 1rem;
		border-top: 1px solid var(--outline);
	}
	.presets-cta {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 1rem;
		border: none;
		background: linear-gradient(135deg, #6366f1, #a855f7, #ec4899);
		background-size: 200% 200%;
		color: #ffffff;
		border-radius: var(--radius-3);
		font-family: var(--font-body);
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
		transition: all 0.3s ease;
		animation: gradient-shift 5s ease infinite;

		&:hover {
			transform: translateY(-2px);
			box-shadow: 0 6px 20px rgba(236, 72, 153, 0.4);
		}

		&:active {
			transform: translateY(1px);
			box-shadow: 0 2px 10px rgba(236, 72, 153, 0.3);
		}
	}
	@keyframes gradient-shift {
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 0% 50%;
		}
	}
</style>
