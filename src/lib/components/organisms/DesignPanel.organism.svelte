<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import type { PlannerSettings } from '$lib';
	import { fonts as fontsList } from '$lib';
	import { THEMES } from '$lib/data/themes';
	import MagicIcon from '~icons/fa/magic';
	import ListIcon from '~icons/fa/file-text-o';
	import ThIcon from '~icons/fa/picture-o';
	import CarouselIcon from '~icons/fa/files-o';
	import { ThemePickerModal } from '$organisms';
	import { ColorPicker } from '$atoms';
	import { useI18n } from '$lib/state/i18n.svelte';

	const i18n = useI18n();

	type FontEntry = (typeof fontsList)[number];
	type ThemeEntry = (typeof THEMES)[number];

	let {
		settings,
		fonts,
		themePrints = {},
		enableHighResolution = $bindable(false),
		previewMode = $bindable('list'),
	}: {
		settings: PlannerSettings;
		fonts: FontEntry[];
		themePrints?: Record<string, number>;
		enableHighResolution: boolean;
		previewMode: 'list' | 'grid' | 'carousel';
	} = $props();

	let showThemeModal = $state(false);

	const applyThemeConfig = (theme: ThemeEntry) => {
		settings.design.themeId = theme.id;
		settings.design.font = theme.config.design.font;
		settings.design.fontDisplay = theme.config.design.fontDisplay;
		settings.design.colorBg = theme.config.design.colorBg;
		settings.design.colorNavBg = theme.config.design.colorNavBg;
		settings.design.colorText = theme.config.design.colorText;
		settings.design.colorTextDisplay =
			theme.config.design.colorTextDisplay || theme.config.design.colorText;
		settings.design.colorSideNavText =
			theme.config.design.colorSideNavText || theme.config.design.colorText;
		settings.design.colorTopNavText =
			theme.config.design.colorTopNavText || theme.config.design.colorText;
		settings.design.colorCoverText =
			theme.config.design.colorCoverText || theme.config.design.colorText;
		settings.design.colorLines = theme.config.design.colorLines;
		settings.design.colorDots = theme.config.design.colorDots;

		settings.coverPage.font = theme.config.coverPage.font;
		settings.coverPage.darkBackground = theme.config.coverPage.darkBackground;
		if (theme.config.coverPage.backgroundStyle)
			settings.coverPage.backgroundStyle = theme.config.coverPage.backgroundStyle;
		if (theme.config.coverPage.backgroundSeed !== undefined)
			settings.coverPage.backgroundSeed = theme.config.coverPage.backgroundSeed;
		if (theme.config.coverPage.backgroundComplexity !== undefined)
			settings.coverPage.backgroundComplexity =
				theme.config.coverPage.backgroundComplexity;
		if (theme.config.coverPage.backgroundPalette)
			settings.coverPage.backgroundPalette = [
				...theme.config.coverPage.backgroundPalette,
			];

		settings.topNav.font = theme.config.topNav.font;
		settings.sideNav.font = theme.config.sideNav.font;

		if (theme.config.dashboardPage?.fontSize !== undefined) {
			settings.dashboardPage.fontSize = theme.config.dashboardPage.fontSize;
		}
	};

	const applyTheme = (e: Event) => {
		const target = e.currentTarget as HTMLSelectElement;
		const themeId = target.value;
		if (!themeId) return;

		const theme = THEMES.find((t) => t.id === themeId);
		if (!theme) return;

		applyThemeConfig(theme);
	};

	const activeTheme = $derived(THEMES.find((t) => t.id === settings.design.themeId));

	const selectTheme = (theme: ThemeEntry) => {
		applyThemeConfig(theme);
		showThemeModal = false;
	};

	const handleDetailsToggle = (e: Event) => {
		const target = e.currentTarget as HTMLDetailsElement;
		const isOpened = target.open;
		if (isOpened) {
			setTimeout(() => {
				target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
			}, 100);
		}
	};
</script>

<div class="panel-content">
	<h2>
		Design & Layout
		<MagicIcon style="opacity: 0.5;" />
	</h2>

	<form>
		<div class="checkbox" style="margin-top: 1rem; margin-bottom: 1rem;">
			<input
				type="checkbox"
				bind:checked={enableHighResolution}
				id="enableHighResolution" />
			<label for="enableHighResolution">{i18n.t('ui.design_panel.high_resolution')}</label>
		</div>
		<fieldset>
			<label for="visualTheme">{i18n.t('ui.design_panel.theme_label')}</label>
			<button
				type="button"
				class="theme-picker-button"
				onclick={() => (showThemeModal = true)}>
				{#if activeTheme}
					<span
						class="theme-current-preview"
						style="font-family: {activeTheme.config.design.fontDisplay}">
						{activeTheme.icon}
						{activeTheme.name}
					</span>
					<small class="theme-current-label">
						{themePrints && themePrints[activeTheme.id]
							? `${themePrints[activeTheme.id].toLocaleString()} prints`
							: 'Click to browse themes'}
					</small>
				{:else}
					<span class="theme-current-preview">{i18n.t('ui.design_panel.pick_a_theme')}</span>
				{/if}
			</button>
		</fieldset>

		{#if showThemeModal}
			<ThemePickerModal
				{settings}
				{themePrints}
				onClose={() => (showThemeModal = false)}
				onSelect={selectTheme} />
		{/if}

		<details class="preview-details" ontoggle={handleDetailsToggle}>
			<summary><h3>{i18n.t('ui.design_panel.planner_preview')}</h3></summary>
			<div class="layout-toggle">
				<button
					type="button"
					class:active={previewMode === 'list'}
					onclick={() => (previewMode = 'list')}
					data-tooltip="Single Page View">
					<ListIcon /> Pages
				</button>
				<button
					type="button"
					class:active={previewMode === 'grid'}
					onclick={() => (previewMode = 'grid')}
					data-tooltip="Grid Gallery View">
					<ThIcon /> Gallery
				</button>
				<button
					type="button"
					class:active={previewMode === 'carousel'}
					onclick={() => (previewMode = 'carousel')}
					data-tooltip="Cover Flow View">
					<CarouselIcon /> Slider
				</button>
			</div>
		</details>

		<details ontoggle={handleDetailsToggle}>
			<summary><h3>{i18n.t('ui.design_panel.font_colors')}</h3></summary>
			<fieldset>
				<label for="designFont">{i18n.t('ui.design_panel.font_body')}</label>
				<div style="display: flex; gap: 0.5rem; align-items: center;">
					<select id="designFont" bind:value={settings.design.font} style="flex: 1;">
						{#each fontsList as font (font.name)}
							<option value={font.name}>{font.name}</option>
						{/each}
					</select>
					<ColorPicker full bind:value={settings.design.colorText} style="width: 3rem;" />
				</div>
			</fieldset>
			<fieldset>
				<label for="designFontDisplay">{i18n.t('ui.design_panel.font_display')}</label>
				<div style="display: flex; gap: 0.5rem; align-items: center;">
					<select
						id="designFontDisplay"
						bind:value={settings.design.fontDisplay}
						style="flex: 1;">
						{#each fontsList as font (font.name)}
							<option value={font.name}>{font.name}</option>
						{/each}
					</select>
					<ColorPicker
						full
						bind:value={settings.design.colorTextDisplay}
						style="width: 3rem;" />
				</div>
			</fieldset>
			<fieldset>
				<label for="coverPageFont">{i18n.t('ui.design_panel.font_cover')}</label>
				<div style="display: flex; gap: 0.5rem; align-items: center;">
					<select
						id="coverPageFont"
						bind:value={settings.coverPage.font}
						style="flex: 1;">
						{#each fonts as font (font.name)}
							<option value={font.name}>{font.name}</option>
						{/each}
					</select>
					<ColorPicker
						full
						bind:value={settings.design.colorCoverText}
						style="width: 3rem;" />
				</div>
			</fieldset>
			<fieldset>
				<label for="topNavFont">{i18n.t('ui.design_panel.font_topbar')}</label>
				<div style="display: flex; gap: 0.5rem; align-items: center;">
					<select id="topNavFont" bind:value={settings.topNav.font} style="flex: 1;">
						{#each fonts as font (font.name)}
							<option value={font.name}>{font.name}</option>
						{/each}
					</select>
					<ColorPicker
						full
						bind:value={settings.design.colorTopNavText}
						style="width: 3rem;" />
				</div>
			</fieldset>
			<fieldset>
				<label for="sideNavFont">{i18n.t('ui.design_panel.font_sidebar')}</label>
				<div style="display: flex; gap: 0.5rem; align-items: center;">
					<select id="sideNavFont" bind:value={settings.sideNav.font} style="flex: 1;">
						{#each fonts as font (font.name)}
							<option value={font.name}>{font.name}</option>
						{/each}
					</select>
					<ColorPicker
						full
						bind:value={settings.design.colorSideNavText}
						style="width: 3rem;" />
				</div>
			</fieldset>
			<fieldset>
				<label for="colorBg">{i18n.t('ui.design_panel.color_bg')}</label>
				<ColorPicker id="colorBg" bind:value={settings.design.colorBg} />
			</fieldset>
			<fieldset>
				<label for="colorNavBg">{i18n.t('ui.design_panel.color_nav_bg')}</label>
				<ColorPicker id="colorNavBg" bind:value={settings.design.colorNavBg} />
			</fieldset>
			<fieldset>
				<label for="linesColor">{i18n.t('ui.design_panel.color_lines')}</label>
				<ColorPicker id="linesColor" bind:value={settings.design.colorLines} />
			</fieldset>
			<fieldset>
				<label for="dotsColor">{i18n.t('ui.design_panel.color_dots')}</label>
				<ColorPicker id="dotsColor" bind:value={settings.design.colorDots} />
			</fieldset>
		</details>
		<details ontoggle={handleDetailsToggle}>
			<summary><h3>{i18n.t('ui.design_panel.safe_margins')}</h3></summary>
			<p style="font-size: 0.85em; color: var(--text-low); margin: 0 0 1rem;">
				Adjust margins (in inches) to prevent content from hiding under your device's
				toolbar.
			</p>
			<fieldset>
				<div
					style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-top: 0.25rem;">
					<div>
						<label for="marginTop" style="font-size: 0.8em; color: var(--text-low);">
							Top
						</label>
						<input
							type="number"
							id="marginTop"
							step="0.05"
							min="0"
							max="1"
							bind:value={settings.design.margin.top}
							style="width: 100%;" />
					</div>
					<div>
						<label for="marginBottom" style="font-size: 0.8em; color: var(--text-low);">
							Bottom
						</label>
						<input
							type="number"
							id="marginBottom"
							step="0.05"
							min="0"
							max="1"
							bind:value={settings.design.margin.bottom}
							style="width: 100%;" />
					</div>
					<div>
						<label for="marginLeft" style="font-size: 0.8em; color: var(--text-low);">
							Left
						</label>
						<input
							type="number"
							id="marginLeft"
							step="0.05"
							min="0"
							max="1"
							bind:value={settings.design.margin.left}
							style="width: 100%;" />
					</div>
					<div>
						<label for="marginRight" style="font-size: 0.8em; color: var(--text-low);">
							Right
						</label>
						<input
							type="number"
							id="marginRight"
							step="0.05"
							min="0"
							max="1"
							bind:value={settings.design.margin.right}
							style="width: 100%;" />
					</div>
				</div>
			</fieldset>
		</details>
		<details ontoggle={handleDetailsToggle}>
			<summary
				onclick={(e) => {
					if (settings.emojis.disable) e.preventDefault();
				}}
				style:cursor={settings.emojis.disable ? 'default' : 'pointer'}>
				<div style="display: flex; align-items: center; gap: 0.5rem;">
					<input
						type="checkbox"
						checked={!settings.emojis.disable}
						onchange={(e) => {
							settings.emojis.disable = !e.currentTarget.checked;
							if (settings.emojis.disable) {
								const details = (e.currentTarget as HTMLElement).closest('details');
								if (details) details.open = false;
							}
						}}
						onclick={(e) => e.stopPropagation()}
						style="margin: 0; width: 1.25rem; height: 1.25rem; cursor: pointer;" />
					<h3 style="margin: 0;">{i18n.t('ui.design_panel.emojis')}</h3>
				</div>
			</summary>
			{#if !settings.emojis.disable}
				<div
					style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem; padding: 0.5rem 0; align-items: end;">
					<!-- Q1 -->
					<fieldset style="margin: 0; padding: 0.25rem;">
						<label for="emoji-q1">Q1</label>
						<input
							type="text"
							id="emoji-q1"
							bind:value={settings.emojis.q1}
							style="width: 100%;" />
					</fieldset>
					<fieldset style="margin: 0; padding: 0.25rem;">
						<label for="emoji-jan">{i18n.t('ui.design_panel.months_short.jan')}</label>
						<input
							type="text"
							id="emoji-jan"
							bind:value={settings.emojis.january}
							style="width: 100%;" />
					</fieldset>
					<fieldset style="margin: 0; padding: 0.25rem;">
						<label for="emoji-feb">{i18n.t('ui.design_panel.months_short.feb')}</label>
						<input
							type="text"
							id="emoji-feb"
							bind:value={settings.emojis.february}
							style="width: 100%;" />
					</fieldset>
					<fieldset style="margin: 0; padding: 0.25rem;">
						<label for="emoji-mar">{i18n.t('ui.design_panel.months_short.mar')}</label>
						<input
							type="text"
							id="emoji-mar"
							bind:value={settings.emojis.march}
							style="width: 100%;" />
					</fieldset>

					<!-- Q2 -->
					<fieldset style="margin: 0; padding: 0.25rem;">
						<label for="emoji-q2">Q2</label>
						<input
							type="text"
							id="emoji-q2"
							bind:value={settings.emojis.q2}
							style="width: 100%;" />
					</fieldset>
					<fieldset style="margin: 0; padding: 0.25rem;">
						<label for="emoji-apr">{i18n.t('ui.design_panel.months_short.apr')}</label>
						<input
							type="text"
							id="emoji-apr"
							bind:value={settings.emojis.april}
							style="width: 100%;" />
					</fieldset>
					<fieldset style="margin: 0; padding: 0.25rem;">
						<label for="emoji-may">{i18n.t('ui.design_panel.months_short.may')}</label>
						<input
							type="text"
							id="emoji-may"
							bind:value={settings.emojis.may}
							style="width: 100%;" />
					</fieldset>
					<fieldset style="margin: 0; padding: 0.25rem;">
						<label for="emoji-jun">{i18n.t('ui.design_panel.months_short.jun')}</label>
						<input
							type="text"
							id="emoji-jun"
							bind:value={settings.emojis.june}
							style="width: 100%;" />
					</fieldset>

					<!-- Q3 -->
					<fieldset style="margin: 0; padding: 0.25rem;">
						<label for="emoji-q3">Q3</label>
						<input
							type="text"
							id="emoji-q3"
							bind:value={settings.emojis.q3}
							style="width: 100%;" />
					</fieldset>
					<fieldset style="margin: 0; padding: 0.25rem;">
						<label for="emoji-jul">{i18n.t('ui.design_panel.months_short.jul')}</label>
						<input
							type="text"
							id="emoji-jul"
							bind:value={settings.emojis.july}
							style="width: 100%;" />
					</fieldset>
					<fieldset style="margin: 0; padding: 0.25rem;">
						<label for="emoji-aug">{i18n.t('ui.design_panel.months_short.aug')}</label>
						<input
							type="text"
							id="emoji-aug"
							bind:value={settings.emojis.august}
							style="width: 100%;" />
					</fieldset>
					<fieldset style="margin: 0; padding: 0.25rem;">
						<label for="emoji-sep">{i18n.t('ui.design_panel.months_short.sep')}</label>
						<input
							type="text"
							id="emoji-sep"
							bind:value={settings.emojis.september}
							style="width: 100%;" />
					</fieldset>

					<!-- Q4 -->
					<fieldset style="margin: 0; padding: 0.25rem;">
						<label for="emoji-q4">Q4</label>
						<input
							type="text"
							id="emoji-q4"
							bind:value={settings.emojis.q4}
							style="width: 100%;" />
					</fieldset>
					<fieldset style="margin: 0; padding: 0.25rem;">
						<label for="emoji-oct">{i18n.t('ui.design_panel.months_short.oct')}</label>
						<input
							type="text"
							id="emoji-oct"
							bind:value={settings.emojis.october}
							style="width: 100%;" />
					</fieldset>
					<fieldset style="margin: 0; padding: 0.25rem;">
						<label for="emoji-nov">{i18n.t('ui.design_panel.months_short.nov')}</label>
						<input
							type="text"
							id="emoji-nov"
							bind:value={settings.emojis.november}
							style="width: 100%;" />
					</fieldset>
					<fieldset style="margin: 0; padding: 0.25rem;">
						<label for="emoji-dec">{i18n.t('ui.design_panel.months_short.dec')}</label>
						<input
							type="text"
							id="emoji-dec"
							bind:value={settings.emojis.december}
							style="width: 100%;" />
					</fieldset>
				</div>
			{/if}
		</details>
		<details ontoggle={handleDetailsToggle}>
			<summary
				onclick={(e) => {
					if (settings.coverPage.disable) e.preventDefault();
				}}
				style:cursor={settings.coverPage.disable ? 'default' : 'pointer'}>
				<div style="display: flex; align-items: center; gap: 0.5rem;">
					<input
						type="checkbox"
						checked={!settings.coverPage.disable}
						onchange={(e) => {
							settings.coverPage.disable = !e.currentTarget.checked;
							if (settings.coverPage.disable) {
								const details = (e.currentTarget as HTMLElement).closest('details');
								if (details) details.open = false;
							}
						}}
						onclick={(e) => e.stopPropagation()}
						style="margin: 0; width: 1.25rem; height: 1.25rem; cursor: pointer;" />
					<h3 style="margin: 0;">{i18n.t('ui.design_panel.cover_page')}</h3>
				</div>
			</summary>
			{#if !settings.coverPage.disable}
				<fieldset>
					<label for="coverPageBackgroundStyle">{i18n.t('ui.design_panel.bg_style')}</label>
					<select
						id="coverPageBackgroundStyle"
						bind:value={settings.coverPage.backgroundStyle}>
						<option value="none">{i18n.t('ui.design_panel.bg_none')}</option>
						<option value="mesh">{i18n.t('ui.design_panel.bg_mesh')}</option>
						<option value="waves">{i18n.t('ui.design_panel.bg_waves')}</option>
						<option value="bauhaus">{i18n.t('ui.design_panel.bg_bauhaus')}</option>
						<option value="halftone">{i18n.t('ui.design_panel.bg_halftone')}</option>
						<option value="glassmorphism">{i18n.t('ui.design_panel.bg_glassmorphism')}</option>
						<option value="flower-of-life">{i18n.t('ui.design_panel.bg_flower')}</option>
						<option value="emoji">{i18n.t('ui.design_panel.bg_emoji')}</option>
						<option value="fractals">{i18n.t('ui.design_panel.bg_fractals')}</option>
						<option value="platonic">{i18n.t('ui.design_panel.bg_platonic')}</option>
						<option value="pokerface">{i18n.t('ui.design_panel.bg_pokerface')}</option>
						<option value="magician">{i18n.t('ui.design_panel.bg_magician')}</option>
					</select>
				</fieldset>
				{#if settings.coverPage.backgroundStyle !== 'none'}
					<fieldset>
						<label for="coverPageBackgroundSeed">{i18n.t('ui.design_panel.bg_seed')}</label>
						<div style="display: flex; gap: 0.5rem; align-items: center;">
							<input
								type="number"
								id="coverPageBackgroundSeed"
								bind:value={settings.coverPage.backgroundSeed}
								style="flex: 1;" />
							<button
								type="button"
								onclick={() =>
									(settings.coverPage.backgroundSeed = Math.floor(
										Math.random() * 1000000,
									))}
								style="white-space: nowrap;">
								Shuffle Seed
							</button>
						</div>
					</fieldset>
					<fieldset>
						<label for="coverPageBackgroundComplexity">
							Complexity ({settings.coverPage.backgroundComplexity})
						</label>
						<input
							type="range"
							id="coverPageBackgroundComplexity"
							min="1"
							max="10"
							step="1"
							bind:value={settings.coverPage.backgroundComplexity} />
					</fieldset>
					<fieldset>
						<span class="label-text">{i18n.t('ui.design_panel.color_palette')}</span>
						<div style="display: flex; gap: 0.5rem;">
							<input type="color" bind:value={settings.coverPage.backgroundPalette[0]} />
							<input type="color" bind:value={settings.coverPage.backgroundPalette[1]} />
							<input type="color" bind:value={settings.coverPage.backgroundPalette[2]} />
						</div>
					</fieldset>
				{/if}
				<fieldset>
					<label for="coverPageTitle">{i18n.t('ui.design_panel.cover_title')}</label>
					<input
						type="text"
						placeholder={i18n.t('wizard.cover.placeholders.title')}
						id="coverPageTitle"
						bind:value={settings.coverPage.title} />
				</fieldset>
				<fieldset>
					<label for="name">{i18n.t('ui.design_panel.contact_name')}</label>
					<input
						type="text"
						placeholder={i18n.t('panels.design.placeholders.name')}
						id="name"
						bind:value={settings.coverPage.name} />
				</fieldset>
				<fieldset>
					<label for="email">{i18n.t('ui.design_panel.contact_email')}</label>
					<input
						type="text"
						placeholder="Contact Email/Phone"
						id="email"
						bind:value={settings.coverPage.email} />
				</fieldset>
				<fieldset>
					<label for="coverPageFont">{i18n.t('ui.design_panel.font_label')}</label>
					<select id="coverPageFont" bind:value={settings.coverPage.font}>
						{#each fonts as font (font.name)}
							<option value={font.name}>{font.name}</option>
						{/each}
					</select>
				</fieldset>
				<div class="checkbox">
					<input
						type="checkbox"
						bind:checked={settings.coverPage.showCollectionLinks}
						id="coverPageShowCollectionLinks" />
					<label for="coverPageShowCollectionLinks">{i18n.t('ui.design_panel.show_collection_links')}</label>
				</div>
				<div class="checkbox">
					<input
						type="checkbox"
						bind:checked={settings.coverPage.darkBackground}
						id="coverPageDarkBackground" />
					<label for="coverPageDarkBackground">{i18n.t('ui.design_panel.dark_background')}</label>
				</div>
			{/if}
		</details>
		<details ontoggle={handleDetailsToggle}>
			<summary
				onclick={(e) => {
					if (settings.dashboardPage.disable) e.preventDefault();
				}}
				style:cursor={settings.dashboardPage.disable ? 'default' : 'pointer'}>
				<div style="display: flex; align-items: center; gap: 0.5rem;">
					<input
						type="checkbox"
						checked={!settings.dashboardPage.disable}
						onchange={(e) => {
							settings.dashboardPage.disable = !e.currentTarget.checked;
							if (settings.dashboardPage.disable) {
								const details = (e.currentTarget as HTMLElement).closest('details');
								if (details) details.open = false;
							}
						}}
						onclick={(e) => e.stopPropagation()}
						style="margin: 0; width: 1.25rem; height: 1.25rem; cursor: pointer;" />
					<h3 style="margin: 0;">{i18n.t('ui.design_panel.dashboard_page')}</h3>
				</div>
			</summary>
			{#if !settings.dashboardPage.disable}
				<div class="row">
					<label for="dashboardPage-title">{i18n.t('ui.design_panel.dashboard_title')}</label>
					<input
						type="text"
						id="dashboardPage-title"
						bind:value={settings.dashboardPage.title}
						placeholder={i18n.t('panels.design.placeholders.dashboard')} />
				</div>
				<fieldset style="margin-top: 1rem;">
					<label for="dashboardPage-fontSize">
						Font Size Scale: {settings.dashboardPage.fontSize.toFixed(2)}x
					</label>
					<input
						type="range"
						id="dashboardPage-fontSize"
						min="0.5"
						max="1.5"
						step="0.05"
						bind:value={settings.dashboardPage.fontSize}
						style="width: 100%; cursor: pointer;" />
				</fieldset>
				<div class="checkbox">
					<input
						type="checkbox"
						id="dashboardPage-homeNavigatesToDashboard"
						bind:checked={settings.dashboardPage.homeNavigatesToDashboard} />
					<label for="dashboardPage-homeNavigatesToDashboard">
						Home icon navigates to Dashboard
					</label>
				</div>
			{/if}
		</details>
		<details ontoggle={handleDetailsToggle}>
			<summary
				onclick={(e) => {
					if (settings.topNav.disable) e.preventDefault();
				}}
				style:cursor={settings.topNav.disable ? 'default' : 'pointer'}>
				<div style="display: flex; align-items: center; gap: 0.5rem;">
					<input
						type="checkbox"
						checked={!settings.topNav.disable}
						onchange={(e) => {
							settings.topNav.disable = !e.currentTarget.checked;
							if (settings.topNav.disable) {
								const details = (e.currentTarget as HTMLElement).closest('details');
								if (details) details.open = false;
							}
						}}
						onclick={(e) => e.stopPropagation()}
						style="margin: 0; width: 1.25rem; height: 1.25rem; cursor: pointer;" />
					<h3 style="margin: 0;">{i18n.t('ui.design_panel.topbar_nav')}</h3>
				</div>
			</summary>
			{#if !settings.topNav.disable}
				<div class="checkbox">
					<input
						type="checkbox"
						bind:checked={settings.topNav.showCollectionLinks}
						id="topNavShowCollectionLinks" />
					<label for="topNavShowCollectionLinks">{i18n.t('ui.design_panel.show_collection_links')}</label>
				</div>
				<fieldset>
					<label for="topNavFont">{i18n.t('ui.design_panel.font_label')}</label>
					<select id="topNavFont" bind:value={settings.topNav.font}>
						{#each fonts as font (font.name)}
							<option value={font.name}>{font.name}</option>
						{/each}
					</select>
				</fieldset>
			{/if}
		</details>
		<details ontoggle={handleDetailsToggle}>
			<summary
				onclick={(e) => {
					if (settings.sideNav.disable) e.preventDefault();
				}}
				style:cursor={settings.sideNav.disable ? 'default' : 'pointer'}>
				<div style="display: flex; align-items: center; gap: 0.5rem;">
					<input
						type="checkbox"
						checked={!settings.sideNav.disable}
						onchange={(e) => {
							settings.sideNav.disable = !e.currentTarget.checked;
							if (settings.sideNav.disable) {
								const details = (e.currentTarget as HTMLElement).closest('details');
								if (details) details.open = false;
							}
						}}
						onclick={(e) => e.stopPropagation()}
						style="margin: 0; width: 1.25rem; height: 1.25rem; cursor: pointer;" />
					<h3 style="margin: 0;">{i18n.t('ui.design_panel.sidebar_nav')}</h3>
				</div>
			</summary>
			{#if !settings.sideNav.disable}
				<div class="checkbox">
					<input
						type="checkbox"
						bind:checked={settings.sideNav.leftSide}
						id="sideNavLeftSide" />
					<label for="sideNavLeftSide">{i18n.t('ui.design_panel.show_sidebar_left')}</label>
				</div>
				<div class="checkbox">
					<input
						type="checkbox"
						bind:checked={settings.sideNav.showCollectionLinks}
						id="sideNavShowCollectionLinks" />
					<label for="sideNavShowCollectionLinks">{i18n.t('ui.design_panel.show_collection_links')}</label>
				</div>
				<fieldset>
					<label for="sideNavFont">{i18n.t('ui.design_panel.font_label')}</label>
					<select id="sideNavFont" bind:value={settings.sideNav.font}>
						{#each fonts as font (font.name)}
							<option value={font.name}>{font.name}</option>
						{/each}
					</select>
				</fieldset>
			{/if}
		</details>
	</form>
</div>

<style lang="scss">
	@use '../../styles/_panels.scss' as *;

	.panel-content {
		:global {
			@include panel-styles;
		}
	}

	.preview-details {
		@media (max-width: 1024px) {
			display: none;
		}
		summary {
			cursor: pointer;
			list-style: revert;
			h3 {
				display: inline;
				margin: 0;
			}
		}
	}
	.layout-toggle {
		display: flex;
		gap: 0.5rem;
		margin: 0.5rem 0 0;
		button {
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 0.5rem;
			padding: 0.75rem 0.5rem;
			border: 1px solid var(--outline);
			background: var(--bg);
			color: var(--text);
			border-radius: var(--radius-2);
			cursor: pointer;
			opacity: 0.7;
			transition: all 0.2s;
			font-family: var(--font-body);
			&.active {
				background: #333;
				color: white;
				border-color: #333;
				opacity: 1;
			}
			&:hover:not(.active) {
				opacity: 1;
				background: rgba(255, 255, 255, 0.1);
			}
		}
	}

	.theme-picker-button {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.35rem;
		width: 100%;
		padding: 1rem 1rem;
		border: 1px solid var(--outline);
		border-radius: var(--radius-3);
		background: var(--bg-high);
		color: var(--text);
		cursor: pointer;
		text-align: left;
		transition:
			border-color 0.2s ease,
			transform 0.2s ease;
		font-family: var(--font-body);
		&:hover {
			border-color: var(--action);
			transform: translateY(-1px);
		}
	}

	.theme-current-preview {
		font-size: 1rem;
		font-weight: 700;
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
	}

	.theme-current-label {
		font-size: 0.85rem;
		color: var(--text-low);
	}
</style>
