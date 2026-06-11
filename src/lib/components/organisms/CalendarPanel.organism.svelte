<script lang="ts">
	import { useI18n } from '$state';
	const i18n = useI18n();

	import type { PlannerSettings, PageTemplate } from '$lib';
	import CalendarIcon from '~icons/fa/calendar';
	import BookIcon from '~icons/fa/book';
	import CaretRightIcon from '~icons/fa/caret-right';

	let {
		settings,
		customTimeframe = $bindable(false),
		onTimeframeSelection,
		onStartDateChange,
		onEndDateChange,
		getAvailablePageTemplates,
		openTemplatePicker = (() => {}) as (
			allowedTemplates: { name: string; value: string }[],
			onSelect: (value: string) => void,
		) => void,
	}: {
		settings: PlannerSettings;
		customTimeframe: boolean;
		onTimeframeSelection: (e: Event) => void;
		onStartDateChange: (e: Event) => void;
		onEndDateChange: (e: Event) => void;
		getAvailablePageTemplates: (
			location: 'collection' | 'year' | 'month' | 'quarter' | 'week' | 'day',
		) => { name: string; value: string }[];
		openTemplatePicker?: (
			allowedTemplates: { name: string; value: string }[],
			onSelect: (value: string) => void,
			currentTemplate?: string,
		) => void;
	} = $props();

	const handleDetailsToggle = (e: Event) => {
		const target = e.currentTarget as HTMLDetailsElement;
		const isOpened = target.open;
		if (isOpened) {
			setTimeout(() => {
				target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
			}, 100);
		}
	};

	function scrollTo(id: string | undefined) {
		if (!id) return;
		const el = document.getElementById(id);
		if (el) el.scrollIntoView({ behavior: 'smooth' });
	}

	function handleTitleKey(e: KeyboardEvent, id: string | undefined) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.stopPropagation();
			e.preventDefault();
			scrollTo(id);
		}
	}

	const isFullYear = $derived(
		settings.date.start.getUTCMonth() === 0 &&
			settings.date.start.getUTCDate() === 1 &&
			settings.date.end.getUTCMonth() === 11 &&
			settings.date.end.getUTCDate() === 31 &&
			!customTimeframe,
	);

	const isCustomRange = $derived(
		customTimeframe ||
			settings.date.start.getUTCMonth() !== 0 ||
			settings.date.start.getUTCDate() !== 1 ||
			settings.date.end.getUTCMonth() !== 11 ||
			settings.date.end.getUTCDate() !== 31,
	);

	const hasWeekNumbers = $derived(
		settings.weekPage.sideNavDisplay === 'weeks-this-month' ||
			settings.weekPage.sideNavDisplay === 'weeks-this-year',
	);

	const hasColumnsOption = (type: string) =>
		type.startsWith('numbered') || type.startsWith('lined') || type.startsWith('todo');
</script>

{#snippet weekAgendaSettings(idPrefix: string)}
	{@const isNote = idPrefix === 'note'}
	<div class="checkbox" style="margin-bottom: 0.5rem;">
		{#if isNote}
			<input
				type="checkbox"
				bind:checked={settings.weekPage.notePagesUse24HourClock}
				id="{idPrefix}Use24HourClockWeek" />
		{:else}
			<input
				type="checkbox"
				bind:checked={settings.weekPage.use24HourClock}
				id="{idPrefix}Use24HourClockWeek" />
		{/if}
		<label for="{idPrefix}Use24HourClockWeek">{i18n.t('panels.calendar.use_24h')}</label>
	</div>
	<fieldset>
		<label for="{idPrefix}WeekAgendaStartTime">{i18n.t('panels.calendar.start_time')}</label>
		{#if isNote}
			<input
				type="number"
				placeholder="0"
				id="{idPrefix}WeekAgendaStartTime"
				min="0"
				max="23"
				step="1"
				bind:value={settings.weekPage.notePagesAgendaStartTime} />
		{:else}
			<input
				type="number"
				placeholder="0"
				id="{idPrefix}WeekAgendaStartTime"
				min="0"
				max="23"
				step="1"
				bind:value={settings.weekPage.agendaStartTime} />
		{/if}
	</fieldset>
	<fieldset>
		<label for="{idPrefix}WeekAgendaEndTime">{i18n.t('panels.calendar.end_time')}</label>
		{#if isNote}
			<input
				type="number"
				placeholder="24"
				id="{idPrefix}WeekAgendaEndTime"
				min="1"
				max="24"
				step="1"
				bind:value={settings.weekPage.notePagesAgendaEndTime} />
		{:else}
			<input
				type="number"
				placeholder="24"
				id="{idPrefix}WeekAgendaEndTime"
				min="1"
				max="24"
				step="1"
				bind:value={settings.weekPage.agendaEndTime} />
		{/if}
	</fieldset>
	<fieldset>
		<label for="{idPrefix}WeekAgendaInterval">{i18n.t('panels.calendar.interval')}</label>
		{#if isNote}
			<select
				id="{idPrefix}WeekAgendaInterval"
				bind:value={settings.weekPage.notePagesAgendaInterval}>
				<option value={60}>{i18n.t('panels.calendar.1_hour')}</option>
				<option value={30}>{i18n.t('panels.calendar.30_min')}</option>
				<option value={15}>{i18n.t('panels.calendar.15_min')}</option>
			</select>
		{:else}
			<select
				id="{idPrefix}WeekAgendaInterval"
				bind:value={settings.weekPage.agendaInterval}>
				<option value={60}>{i18n.t('panels.calendar.1_hour')}</option>
				<option value={30}>{i18n.t('panels.calendar.30_min')}</option>
				<option value={15}>{i18n.t('panels.calendar.15_min')}</option>
			</select>
		{/if}
	</fieldset>
{/snippet}

{#snippet dayAgendaSettings(idPrefix: string)}
	{@const isNote = idPrefix === 'note'}
	<div class="checkbox" style="margin-bottom: 0.5rem;">
		{#if isNote}
			<input
				type="checkbox"
				bind:checked={settings.dayPage.notePagesUse24HourClock}
				id="{idPrefix}Use24HourClockDay" />
		{:else}
			<input
				type="checkbox"
				bind:checked={settings.dayPage.use24HourClock}
				id="{idPrefix}Use24HourClockDay" />
		{/if}
		<label for="{idPrefix}Use24HourClockDay">{i18n.t('panels.calendar.use_24h')}</label>
	</div>
	<fieldset>
		<label for="{idPrefix}DayAgendaStartTime">{i18n.t('panels.calendar.start_time')}</label>
		{#if isNote}
			<input
				type="number"
				placeholder="0"
				id="{idPrefix}DayAgendaStartTime"
				min="0"
				max="23"
				step="1"
				bind:value={settings.dayPage.notePagesAgendaStartTime} />
		{:else}
			<input
				type="number"
				placeholder="0"
				id="{idPrefix}DayAgendaStartTime"
				min="0"
				max="23"
				step="1"
				bind:value={settings.dayPage.agendaStartTime} />
		{/if}
	</fieldset>
	<fieldset>
		<label for="{idPrefix}DayAgendaEndTime">{i18n.t('panels.calendar.end_time')}</label>
		{#if isNote}
			<input
				type="number"
				placeholder="24"
				id="{idPrefix}DayAgendaEndTime"
				min="1"
				max="24"
				step="1"
				bind:value={settings.dayPage.notePagesAgendaEndTime} />
		{:else}
			<input
				type="number"
				placeholder="24"
				id="{idPrefix}DayAgendaEndTime"
				min="1"
				max="24"
				step="1"
				bind:value={settings.dayPage.agendaEndTime} />
		{/if}
	</fieldset>
	<fieldset>
		<label for="{idPrefix}DayAgendaInterval">{i18n.t('panels.calendar.interval')}</label>
		{#if isNote}
			<select
				id="{idPrefix}DayAgendaInterval"
				bind:value={settings.dayPage.notePagesAgendaInterval}>
				<option value={60}>{i18n.t('panels.calendar.1_hour')}</option>
				<option value={30}>{i18n.t('panels.calendar.30_min')}</option>
				<option value={15}>{i18n.t('panels.calendar.15_min')}</option>
			</select>
		{:else}
			<select
				id="{idPrefix}DayAgendaInterval"
				bind:value={settings.dayPage.agendaInterval}>
				<option value={60}>{i18n.t('panels.calendar.1_hour')}</option>
				<option value={30}>{i18n.t('panels.calendar.30_min')}</option>
				<option value={15}>{i18n.t('panels.calendar.15_min')}</option>
			</select>
		{/if}
	</fieldset>
{/snippet}

<div class="panel-content">
	<h2>
		Calendar Views
		<CalendarIcon style="opacity: 0.5;" />
	</h2>
	<form>
		<fieldset>
			<label for="timeframeBasedOnYear">{i18n.t('panels.calendar.year')}</label>
			<select
				id="timeframeBasedOnYear"
				value={isFullYear ? settings.date.start.getTime() : 0}
				onchange={onTimeframeSelection}>
				{#each new Array(5) as _, i (i)}
					{@const date = new Date(Date.UTC(new Date().getFullYear() + i))}
					<option value={date.getTime()}>
						{date.getUTCFullYear()}
					</option>
				{/each}
				<option value={0}>{i18n.t('panels.calendar.custom_date')}</option>
			</select>
		</fieldset>
		{#if isCustomRange}
			<fieldset>
				<label for="start">{i18n.t('wizard.spreads.start_date')}</label>
				<input
					type="date"
					placeholder={i18n.t('wizard.spreads.start_date')}
					id="start"
					max={settings.date.end.toISOString().slice(0, 10)}
					value={settings.date.start.toISOString().slice(0, 10)}
					onclick={(e) => e.currentTarget.showPicker()}
					onchange={onStartDateChange} />
			</fieldset>
			<fieldset>
				<label for="end">{i18n.t('wizard.spreads.end_date')}</label>
				<input
					type="date"
					placeholder={i18n.t('wizard.spreads.end_date')}
					id="end"
					min={settings.date.start.toISOString().slice(0, 10)}
					value={settings.date.end.toISOString().slice(0, 10)}
					onclick={(e) => e.currentTarget.showPicker()}
					onchange={onEndDateChange} />
			</fieldset>
		{/if}
		<div class="checkbox" style="margin-bottom: 1rem;">
			<input
				type="checkbox"
				bind:checked={settings.date.startWeekOnSunday}
				id="startWeekOnSunday" />
			<label for="startWeekOnSunday">{i18n.t('panels.calendar.start_sunday')}</label>
		</div>

		<details ontoggle={handleDetailsToggle}>
			<summary
				onclick={(e) => {
					if (settings.yearPage.disable) e.preventDefault();
				}}
				style:cursor={settings.yearPage.disable ? 'default' : 'pointer'}>
				<div style="display: flex; align-items: center; gap: 0.5rem;">
					<input
						type="checkbox"
						checked={!settings.yearPage.disable}
						onchange={(e) => {
							settings.yearPage.disable = !e.currentTarget.checked;
							if (settings.yearPage.disable) {
								const details = (e.currentTarget as HTMLElement).closest('details');
								if (details) details.open = false;
							}
						}}
						onclick={(e) => e.stopPropagation()}
						style="margin: 0; width: 1.25rem; height: 1.25rem; cursor: pointer;" />
					<button
						type="button"
						class="scroll-title"
						data-tooltip="Scroll to Yearly pages"
						onclick={(e) => {
							e.stopPropagation();
							e.preventDefault();
							scrollTo(settings.years[0]?.year?.toString());
						}}
						onkeydown={(e) => handleTitleKey(e, settings.years[0]?.year?.toString())}>
						Yearly
					</button>
				</div>
			</summary>
			{#if !settings.yearPage.disable}
				<fieldset>
					<label for="yearPageTemplate">{i18n.t('panels.calendar.year_template')}</label>
					<div style="display: flex; gap: 0.5rem; align-items: center;">
						<select
							id="yearPageTemplate"
							bind:value={settings.yearPage.template}
							style="flex: 1;">
							{#each getAvailablePageTemplates('year') as template (template.value)}
								<option value={template.value}>{template.name}</option>
							{/each}
						</select>
						<button
							class="picker-btn"
							type="button"
							aria-label={i18n.t('panels.calendar.select_template')}
							onclick={() =>
								openTemplatePicker(
									getAvailablePageTemplates('year'),
									(val) => (settings.yearPage.template = val as PageTemplate),
									settings.yearPage.template,
								)}>
							<BookIcon />
						</button>
					</div>
				</fieldset>
				<fieldset>
					<label for="yearNotePagesAmount">{i18n.t('panels.calendar.add_notes')}</label>
					<input
						type="number"
						placeholder={i18n.t('panels.calendar.add_notes')}
						id="yearNotePagesAmount"
						min="0"
						step="1"
						bind:value={settings.yearPage.notePagesAmount} />
				</fieldset>
				{#if settings.yearPage.notePagesAmount > 0}
					<fieldset>
						<label for="yearNotePagesTemplate">{i18n.t('panels.calendar.notes_template')}</label>
						<div style="display: flex; gap: 0.5rem; align-items: center;">
							<select
								id="yearNotePagesTemplate"
								bind:value={settings.yearPage.notePagesTemplate}
								style="flex: 1;">
								{#each getAvailablePageTemplates('year') as template (template.value)}
									<option value={template.value}>{template.name}</option>
								{/each}
							</select>
							<button
								class="picker-btn"
								type="button"
								aria-label={i18n.t('panels.calendar.select_template')}
								onclick={() =>
									openTemplatePicker(
										getAvailablePageTemplates('year'),
										(val) => (settings.yearPage.notePagesTemplate = val as PageTemplate),
										settings.yearPage.notePagesTemplate,
									)}>
								<BookIcon />
							</button>
						</div>
					</fieldset>
					{#if hasColumnsOption(settings.yearPage.notePagesTemplate)}
						<fieldset>
							<label for="yearNotePagesColumns">{i18n.t('panels.calendar.columns')}</label>
							<input
								type="number"
								id="yearNotePagesColumns"
								min="1"
								step="1"
								bind:value={settings.yearPage.notePagesColumns} />
						</fieldset>
					{/if}
				{/if}
			{/if}
		</details>

		<details ontoggle={handleDetailsToggle}>
			<summary
				onclick={(e) => {
					if (settings.quarterPage.disable) e.preventDefault();
				}}
				style:cursor={settings.quarterPage.disable ? 'default' : 'pointer'}>
				<div style="display: flex; align-items: center; gap: 0.5rem;">
					<input
						type="checkbox"
						checked={!settings.quarterPage.disable}
						onchange={(e) => {
							settings.quarterPage.disable = !e.currentTarget.checked;
							if (settings.quarterPage.disable) {
								const details = (e.currentTarget as HTMLElement).closest('details');
								if (details) details.open = false;
							}
						}}
						onclick={(e) => e.stopPropagation()}
						style="margin: 0; width: 1.25rem; height: 1.25rem; cursor: pointer;" />
					<button
						type="button"
						class="scroll-title"
						data-tooltip="Scroll to Quarterly pages"
						onclick={(e) => {
							e.stopPropagation();
							e.preventDefault();
							scrollTo(settings.quarters[0]?.id);
						}}
						onkeydown={(e) => handleTitleKey(e, settings.quarters[0]?.id)}>
						Quarterly
					</button>
				</div>
			</summary>
			{#if !settings.quarterPage.disable}
				<fieldset>
					<label for="quarterPageTemplate">{i18n.t('panels.calendar.quarter_template')}</label>
					<div style="display: flex; gap: 0.5rem; align-items: center;">
						<select
							id="quarterPageTemplate"
							bind:value={settings.quarterPage.template}
							style="flex: 1;">
							{#each getAvailablePageTemplates('quarter') as template (template.value)}
								<option value={template.value}>{template.name}</option>
							{/each}
						</select>
						<button
							class="picker-btn"
							type="button"
							aria-label={i18n.t('panels.calendar.select_template')}
							onclick={() =>
								openTemplatePicker(
									getAvailablePageTemplates('quarter'),
									(val) => (settings.quarterPage.template = val as PageTemplate),
									settings.quarterPage.template,
								)}>
							<BookIcon />
						</button>
					</div>
				</fieldset>
				{#if settings.quarterPage.template === 'goals-quarter'}
					<fieldset>
						<label for="quarterGoalsColumns">{i18n.t('panels.calendar.goals_columns')}</label>
						<select
							id="quarterGoalsColumns"
							bind:value={settings.quarterPage.goalsColumns}>
							{#each [1, 2, 3, 4] as column}
								<option value={column}>{column}</option>
							{/each}
						</select>
					</fieldset>
				{/if}
				<fieldset>
					<label for="quarterNotePagesAmount">{i18n.t('panels.calendar.add_notes')}</label>
					<input
						type="number"
						placeholder={i18n.t('panels.calendar.add_notes')}
						id="quarterNotePagesAmount"
						min="0"
						step="1"
						bind:value={settings.quarterPage.notePagesAmount} />
				</fieldset>
				{#if settings.quarterPage.notePagesAmount > 0}
					<fieldset>
						<label for="quarterNotePagesTemplate">{i18n.t('panels.calendar.notes_template')}</label>
						<div style="display: flex; gap: 0.5rem; align-items: center;">
							<select
								id="quarterNotePagesTemplate"
								bind:value={settings.quarterPage.notePagesTemplate}
								style="flex: 1;">
								{#each getAvailablePageTemplates('quarter') as template (template.value)}
									<option value={template.value}>{template.name}</option>
								{/each}
							</select>
							<button
								class="picker-btn"
								type="button"
								aria-label={i18n.t('panels.calendar.select_template')}
								onclick={() =>
									openTemplatePicker(
										getAvailablePageTemplates('quarter'),
										(val) =>
											(settings.quarterPage.notePagesTemplate = val as PageTemplate),
										settings.quarterPage.notePagesTemplate,
									)}>
								<BookIcon />
							</button>
						</div>
					</fieldset>
					{#if hasColumnsOption(settings.quarterPage.notePagesTemplate)}
						<fieldset>
							<label for="quarterNotePagesColumns">{i18n.t('panels.calendar.columns')}</label>
							<input
								type="number"
								id="quarterNotePagesColumns"
								min="1"
								step="1"
								bind:value={settings.quarterPage.notePagesColumns} />
						</fieldset>
					{/if}
				{/if}
			{/if}
		</details>

		<details ontoggle={handleDetailsToggle}>
			<summary
				onclick={(e) => {
					if (settings.monthPage.disable) e.preventDefault();
				}}
				style:cursor={settings.monthPage.disable ? 'default' : 'pointer'}>
				<div style="display: flex; align-items: center; gap: 0.5rem;">
					<input
						type="checkbox"
						checked={!settings.monthPage.disable}
						onchange={(e) => {
							settings.monthPage.disable = !e.currentTarget.checked;
							if (settings.monthPage.disable) {
								const details = (e.currentTarget as HTMLElement).closest('details');
								if (details) details.open = false;
							}
						}}
						onclick={(e) => e.stopPropagation()}
						style="margin: 0; width: 1.25rem; height: 1.25rem; cursor: pointer;" />
					<button
						type="button"
						class="scroll-title"
						data-tooltip="Scroll to Monthly pages"
						onclick={(e) => {
							e.stopPropagation();
							e.preventDefault();
							scrollTo(settings.months[0]?.id);
						}}
						onkeydown={(e) => handleTitleKey(e, settings.months[0]?.id)}>
						Monthly
					</button>
				</div>
			</summary>
			{#if !settings.monthPage.disable}
				<fieldset>
					<label for="monthPageTemplate">{i18n.t('panels.calendar.month_template')}</label>
					<div style="display: flex; gap: 0.5rem; align-items: center;">
						<select
							id="monthPageTemplate"
							bind:value={settings.monthPage.template}
							style="flex: 1;">
							{#each getAvailablePageTemplates('month') as template (template.value)}
								<option value={template.value}>{template.name}</option>
							{/each}
						</select>
						<button
							class="picker-btn"
							type="button"
							aria-label={i18n.t('panels.calendar.select_template')}
							onclick={() =>
								openTemplatePicker(
									getAvailablePageTemplates('month'),
									(val) => (settings.monthPage.template = val as PageTemplate),
									settings.monthPage.template,
								)}>
							<BookIcon />
						</button>
					</div>
				</fieldset>
				{#if hasColumnsOption(settings.monthPage.template)}
					<fieldset>
						<label for="monthPageColumns">{i18n.t('panels.calendar.columns')}</label>
						<input
							type="number"
							id="monthPageColumns"
							min="1"
							step="1"
							bind:value={settings.monthPage.columns} />
					</fieldset>
				{/if}
				<fieldset>
					<label for="monthNotePagesAmount">{i18n.t('panels.calendar.add_notes')}</label>
					<input
						type="number"
						placeholder={i18n.t('panels.calendar.add_notes')}
						id="monthNotePagesAmount"
						min="0"
						step="1"
						bind:value={settings.monthPage.notePagesAmount} />
				</fieldset>
				{#if settings.monthPage.notePagesAmount > 0}
					<fieldset>
						<label for="monthNotePagesTemplate">{i18n.t('panels.calendar.notes_template')}</label>
						<div style="display: flex; gap: 0.5rem; align-items: center;">
							<select
								id="monthNotePagesTemplate"
								bind:value={settings.monthPage.notePagesTemplate}
								style="flex: 1;">
								{#each getAvailablePageTemplates('month') as template (template.value)}
									<option value={template.value}>{template.name}</option>
								{/each}
							</select>
							<button
								class="picker-btn"
								type="button"
								aria-label={i18n.t('panels.calendar.select_template')}
								onclick={() =>
									openTemplatePicker(
										getAvailablePageTemplates('month'),
										(val) => (settings.monthPage.notePagesTemplate = val as PageTemplate),
										settings.monthPage.notePagesTemplate,
									)}>
								<BookIcon />
							</button>
						</div>
					</fieldset>
					{#if hasColumnsOption(settings.monthPage.notePagesTemplate)}
						<fieldset>
							<label for="monthNotePagesColumns">{i18n.t('panels.calendar.columns')}</label>
							<input
								type="number"
								id="monthNotePagesColumns"
								min="1"
								step="1"
								bind:value={settings.monthPage.notePagesColumns} />
						</fieldset>
					{/if}
				{/if}
			{/if}
		</details>

		<details ontoggle={handleDetailsToggle}>
			<summary
				onclick={(e) => {
					if (settings.weekPage.disable) e.preventDefault();
				}}
				style:cursor={settings.weekPage.disable ? 'default' : 'pointer'}>
				<div style="display: flex; align-items: center; gap: 0.5rem;">
					<input
						type="checkbox"
						checked={!settings.weekPage.disable}
						onchange={(e) => {
							settings.weekPage.disable = !e.currentTarget.checked;
							if (settings.weekPage.disable) {
								const details = (e.currentTarget as HTMLElement).closest('details');
								if (details) details.open = false;
							}
						}}
						onclick={(e) => e.stopPropagation()}
						style="margin: 0; width: 1.25rem; height: 1.25rem; cursor: pointer;" />
					<button
						type="button"
						class="scroll-title"
						data-tooltip="Scroll to Weekly pages"
						onclick={(e) => {
							e.stopPropagation();
							e.preventDefault();
							scrollTo(settings.weeks[0]?.id);
						}}
						onkeydown={(e) => handleTitleKey(e, settings.weeks[0]?.id)}>
						Weekly
					</button>
				</div>
			</summary>
			{#if !settings.weekPage.disable}
				<div class="checkbox" style="margin-bottom: 0.5rem;">
					<input
						type="checkbox"
						bind:checked={settings.weekPage.useWeekSinceYear}
						id="useWeekSinceYear" />
					<label for="useWeekSinceYear">{i18n.t('panels.calendar.use_week_since_year')}</label>
				</div>
				<fieldset>
					<label for="weekPageTemplate">{i18n.t('panels.calendar.week_template')}</label>
					<div style="display: flex; gap: 0.5rem; align-items: center;">
						<select
							id="weekPageTemplate"
							bind:value={settings.weekPage.template}
							style="flex: 1;">
							{#each getAvailablePageTemplates('week') as template (template.value)}
								<option value={template.value}>{template.name}</option>
							{/each}
						</select>
						<button
							class="picker-btn"
							type="button"
							aria-label={i18n.t('panels.calendar.select_template')}
							onclick={() =>
								openTemplatePicker(
									getAvailablePageTemplates('week'),
									(val) => (settings.weekPage.template = val as PageTemplate),
									settings.weekPage.template,
								)}>
							<BookIcon />
						</button>
					</div>
				</fieldset>
				{#if settings.weekPage.template.startsWith('agenda-week')}
					<fieldset>
						<span class="label-text">{i18n.t('panels.calendar.align_day_text')}</span>
						<div style="display: flex; gap: 1rem; align-items: center; height: 35px;">
							<label
								style="display: flex; gap: 0.25rem; align-items: center; cursor: pointer; margin: 0; padding: 0; font-size: 0.9rem;">
								<input
									type="radio"
									value="left"
									bind:group={settings.weekPage.alignDayText}
									style="margin:0;" />
								Left
							</label>
							<label
								style="display: flex; gap: 0.25rem; align-items: center; cursor: pointer; margin: 0; padding: 0; font-size: 0.9rem;">
								<input
									type="radio"
									value="center"
									bind:group={settings.weekPage.alignDayText}
									style="margin:0;" />
								Center
							</label>
							<label
								style="display: flex; gap: 0.25rem; align-items: center; cursor: pointer; margin: 0; padding: 0; font-size: 0.9rem;">
								<input
									type="radio"
									value="right"
									bind:group={settings.weekPage.alignDayText}
									style="margin:0;" />
								Right
							</label>
						</div>
					</fieldset>
				{/if}
				{#if settings.weekPage.template === 'agenda-week'}
					{@render weekAgendaSettings('main')}
				{/if}

				{#if hasColumnsOption(settings.weekPage.template)}
					<fieldset>
						<label for="weekPageColumns">{i18n.t('panels.calendar.columns')}</label>
						<input
							type="number"
							id="weekPageColumns"
							min="1"
							step="1"
							bind:value={settings.weekPage.columns} />
					</fieldset>
				{/if}
				<fieldset>
					<label for="weekNotePagesAmount">{i18n.t('panels.calendar.add_notes')}</label>
					<input
						type="number"
						placeholder={i18n.t('panels.calendar.add_notes')}
						id="weekNotePagesAmount"
						min="0"
						step="1"
						bind:value={settings.weekPage.notePagesAmount} />
				</fieldset>
				{#if settings.weekPage.notePagesAmount > 0}
					<fieldset>
						<label for="weekNotePagesTemplate">{i18n.t('panels.calendar.notes_template')}</label>
						<div style="display: flex; gap: 0.5rem; align-items: center;">
							<select
								id="weekNotePagesTemplate"
								bind:value={settings.weekPage.notePagesTemplate}
								style="flex: 1;">
								{#each getAvailablePageTemplates('week') as template (template.value)}
									<option value={template.value}>{template.name}</option>
								{/each}
							</select>
							<button
								class="picker-btn"
								type="button"
								aria-label={i18n.t('panels.calendar.select_template')}
								onclick={() =>
									openTemplatePicker(
										getAvailablePageTemplates('week'),
										(val) => (settings.weekPage.notePagesTemplate = val as PageTemplate),
										settings.weekPage.notePagesTemplate,
									)}>
								<BookIcon />
							</button>
						</div>
					</fieldset>
					{#if hasColumnsOption(settings.weekPage.notePagesTemplate)}
						<fieldset>
							<label for="weekNotePagesColumns">{i18n.t('panels.calendar.columns')}</label>
							<input
								type="number"
								id="weekNotePagesColumns"
								min="1"
								step="1"
								bind:value={settings.weekPage.notePagesColumns} />
						</fieldset>
					{/if}
					{#if settings.weekPage.notePagesTemplate === 'agenda-week'}
						{@render weekAgendaSettings('note')}
					{/if}
				{/if}
				<fieldset>
					<label for="weekSideNavDisplay">{i18n.t('panels.calendar.sidebar_display')}</label>
					<select id="weekSideNavDisplay" bind:value={settings.weekPage.sideNavDisplay}>
						<option value="days-this-week">{i18n.t('panels.calendar.days_week')}</option>
						<option value="days-this-month">{i18n.t('panels.calendar.days_month')}</option>
						<option value="weeks-this-year">{i18n.t('panels.calendar.weeks_year')}</option>
						<option value="weeks-this-month">{i18n.t('panels.calendar.weeks_month')}</option>
						<option value="months">{i18n.t('panels.calendar.months')}</option>
						<option value="none">{i18n.t('panels.calendar.none')}</option>
					</select>
				</fieldset>
				{#if hasWeekNumbers}
					<div class="checkbox">
						<input
							type="checkbox"
							bind:checked={settings.weekPage.useWeekNumbersInSideNav}
							id="useWeekNumbersInSideNav" />
						<label for="useWeekNumbersInSideNav">{i18n.t('panels.calendar.show_week_numbers')}</label>
					</div>
				{/if}
			{/if}
		</details>

		<details ontoggle={handleDetailsToggle}>
			<summary
				onclick={(e) => {
					if (settings.dayPage.disable) e.preventDefault();
				}}
				style:cursor={settings.dayPage.disable ? 'default' : 'pointer'}>
				<div style="display: flex; align-items: center; gap: 0.5rem;">
					<input
						type="checkbox"
						checked={!settings.dayPage.disable}
						onchange={(e) => {
							settings.dayPage.disable = !e.currentTarget.checked;
							if (settings.dayPage.disable) {
								const details = (e.currentTarget as HTMLElement).closest('details');
								if (details) details.open = false;
							}
						}}
						onclick={(e) => e.stopPropagation()}
						style="margin: 0; width: 1.25rem; height: 1.25rem; cursor: pointer;" />
					<button
						type="button"
						class="scroll-title"
						data-tooltip="Scroll to Daily pages"
						onclick={(e) => {
							e.stopPropagation();
							e.preventDefault();
							scrollTo(settings.days[0]?.id);
						}}
						onkeydown={(e) => handleTitleKey(e, settings.days[0]?.id)}>
						Daily
					</button>
				</div>
			</summary>
			{#if !settings.dayPage.disable}
				<fieldset>
					<label for="dayPageTemplate">{i18n.t('panels.calendar.day_template')}</label>
					<div style="display: flex; gap: 0.5rem; align-items: center;">
						<select
							id="dayPageTemplate"
							bind:value={settings.dayPage.template}
							style="flex: 1;">
							{#each getAvailablePageTemplates('day') as template (template.value)}
								<option value={template.value}>{template.name}</option>
							{/each}
						</select>
						<button
							class="picker-btn"
							type="button"
							aria-label={i18n.t('panels.calendar.select_template')}
							onclick={() =>
								openTemplatePicker(
									getAvailablePageTemplates('day'),
									(val) => (settings.dayPage.template = val as PageTemplate),
									settings.dayPage.template,
								)}>
							<BookIcon />
						</button>
					</div>
				</fieldset>
				{#if settings.dayPage.template.startsWith('agenda-day')}
					{@render dayAgendaSettings('main')}
				{/if}
				{#if hasColumnsOption(settings.dayPage.template)}
					<fieldset>
						<label for="dayPageColumns">{i18n.t('panels.calendar.columns')}</label>
						<input
							type="number"
							id="dayPageColumns"
							min="1"
							step="1"
							bind:value={settings.dayPage.columns} />
					</fieldset>
				{/if}
				<fieldset>
					<label for="dayNotePagesAmount">{i18n.t('panels.calendar.add_notes')}</label>
					<input
						type="number"
						placeholder={i18n.t('panels.calendar.add_notes')}
						id="dayNotePagesAmount"
						min="0"
						step="1"
						bind:value={settings.dayPage.notePagesAmount} />
				</fieldset>
				{#if settings.dayPage.notePagesAmount > 0}
					<fieldset>
						<label for="dayNotePagesTemplate">{i18n.t('panels.calendar.notes_template')}</label>
						<div style="display: flex; gap: 0.5rem; align-items: center;">
							<select
								id="dayNotePagesTemplate"
								bind:value={settings.dayPage.notePagesTemplate}
								style="flex: 1;">
								{#each getAvailablePageTemplates('day') as template (template.value)}
									<option value={template.value}>{template.name}</option>
								{/each}
							</select>
							<button
								class="picker-btn"
								type="button"
								aria-label={i18n.t('panels.calendar.select_template')}
								onclick={() =>
									openTemplatePicker(
										getAvailablePageTemplates('day'),
										(val) => (settings.dayPage.notePagesTemplate = val as PageTemplate),
										settings.dayPage.notePagesTemplate,
									)}>
								<BookIcon />
							</button>
						</div>
					</fieldset>
					{#if hasColumnsOption(settings.dayPage.notePagesTemplate)}
						<fieldset>
							<label for="dayNotePagesColumns">{i18n.t('panels.calendar.columns')}</label>
							<input
								type="number"
								id="dayNotePagesColumns"
								min="1"
								step="1"
								bind:value={settings.dayPage.notePagesColumns} />
						</fieldset>
					{/if}
					{#if settings.dayPage.notePagesTemplate.startsWith('agenda-day')}
						{@render dayAgendaSettings('note')}
					{/if}
				{/if}
				<fieldset>
					<label for="daySideNavDisplay">{i18n.t('panels.calendar.sidebar_display')}</label>
					<select id="daySideNavDisplay" bind:value={settings.dayPage.sideNavDisplay}>
						<option value="days-this-week">{i18n.t('panels.calendar.days_week')}</option>
						<option value="days-this-month">{i18n.t('panels.calendar.days_month')}</option>
						<option value="days-this-year">{i18n.t('panels.calendar.days_year')}</option>
						<option value="weeks-this-year">{i18n.t('panels.calendar.weeks_year')}</option>
						<option value="weeks-this-month">{i18n.t('panels.calendar.weeks_month')}</option>
						<option value="months">{i18n.t('panels.calendar.months')}</option>
						<option value="none">{i18n.t('panels.calendar.none')}</option>
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
	.scroll-title {
		margin: 0;
		cursor: pointer;
		text-decoration: none;
		transition: opacity 0.2s;
		background: none;
		border: none;
		padding: 0;
		color: inherit;
		text-align: left;
		font-family: var(--font-display);
		font-weight: var(--font-weight-7);
		font-size: var(--font-size-3);
		line-height: 1.25;

		&:hover,
		&:focus {
			text-decoration: underline;
			outline: none;
		}
	}
	.picker-btn {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-2);
		color: var(--text);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.5rem;
		transition:
			background-color 0.2s,
			color 0.2s;
		&:hover {
			background: var(--bg-high);
			color: var(--text-high);
		}
	}
</style>
