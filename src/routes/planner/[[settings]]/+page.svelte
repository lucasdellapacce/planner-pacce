<script lang="ts">
	import { onMount } from 'svelte';
	import PlannerView from '$views/PlannerView.view.svelte';
	import { useI18n } from '$state';

	let { data } = $props();
	const i18n = useI18n();

	onMount(() => {
		if (data.preset) {
			fetch('/api/stats', {
				method: 'POST',
				body: JSON.stringify({ type: 'preset_loaded', presetId: data.preset.id })
			}).catch(console.error);
		}
	});

	const pageTitle = $derived(
		data.preset
			? i18n.t('planner_page.meta_title_preset').replace('{name}', i18n.tPreset(data.preset.id, 'name', data.preset.name))
			: i18n.t('planner_page.meta_title_default'),
	);

	const pageDescription = $derived(
		data.preset
			? i18n.t('planner_page.meta_desc_preset')
				.replace('{name}', i18n.tPreset(data.preset.id, 'name', data.preset.name))
				.replace('{description}', i18n.tPreset(data.preset.id, 'description', data.preset.description))
			: i18n.t('planner_page.meta_desc_default'),
	);
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={pageDescription} />
</svelte:head>

<PlannerView settings={data.settings} preset={data.preset} />
