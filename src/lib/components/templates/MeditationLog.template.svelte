<script lang="ts">
	import { useI18n } from '$state';
	const i18n = useI18n();

	import { tTemplate, type PlannerSettings } from '$lib';
	import { Box, Text, Checkbox } from '$atoms';
	import { Field } from '$molecules';

	let { settings = {} as PlannerSettings } = $props();
	const showEmoji = $derived(!settings?.emojis?.disable);
</script>

<Box class="meditation-log">
	<Box class="header-section">
		<Field label={tTemplate('meditation_breathwork_log', settings?.design?.locale)} emoji="🧘" {showEmoji} class="title" />
		<Field label={tTemplate('date_week', settings?.design?.locale)} class="date" />
	</Box>

	<Box class="content-section">
		<Box class="sessions-block">
			<Text class="section-label">{tTemplate('daily_session_tracker', settings?.design?.locale)}</Text>
			<Box class="sessions-header">
				<Text tag="span" class="col-day">{tTemplate('day', settings?.design?.locale)}</Text>
				<Text tag="span" class="col-time">{tTemplate('time', settings?.design?.locale)}</Text>
				<Text tag="span" class="col-dur">{tTemplate('dur', settings?.design?.locale)}</Text>
				<Text tag="span" class="col-tech">{tTemplate('technique_focus', settings?.design?.locale)}</Text>
				<Text tag="span" class="col-state">{tTemplate('state_of_mind', settings?.design?.locale)}</Text>
			</Box>
			{#each ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as day}
				<Box class="session-row">
					<Text tag="span" class="day-label">{tTemplate(day, settings?.design?.locale).toUpperCase()}</Text>
					<Box class="line time-line"></Box>
					<Box class="line dur-line"></Box>
					<Box class="line tech-line"></Box>
					<Box class="line state-line"></Box>
				</Box>
			{/each}
		</Box>

		<Box class="bottom-section">
			<Box class="column observations">
				<Text class="section-label">{tTemplate('insights_revelations', settings?.design?.locale)}</Text>
				{#each Array(7) as _}
					<Box class="line"></Box>
				{/each}
			</Box>

			<Box class="column goals">
				<Text class="section-label">{tTemplate('weekly_mindfulness_goals', settings?.design?.locale)}</Text>
				{#each Array(3) as _}
					<Box class="todo-row">
						<Checkbox aria-label={i18n.t('templates.checks.goal')} />
						<Box class="line"></Box>
					</Box>
				{/each}

				<Text class="section-label habits-label">{tTemplate('breathwork_habits', settings?.design?.locale)}</Text>
				<Box class="habits-check-grid">
					{#each ['box_breathing', 'wim_hof_method', 'four_seven_eight_technique', 'anapanasati_focus'] as habitKey}
						<Box class="habit-check-row">
							<Text tag="span" class="habit-name">{tTemplate(habitKey, settings?.design?.locale)}</Text>
							<Box class="check-boxes">
								{#each ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as dayKey}
									{@const dayChar = tTemplate(dayKey, settings?.design?.locale).charAt(0).toUpperCase()}
									<Box class="check-day">
										<Text tag="span" class="day-char">{dayChar}</Text>
										<Checkbox aria-label={i18n.t('templates.checks.day')} class="check-box" />
									</Box>
								{/each}
							</Box>
						</Box>
					{/each}
				</Box>
			</Box>
		</Box>
	</Box>
</Box>

<style lang="scss">
	:global {
		.meditation-log {
			display: flex;
			flex-direction: column;
			width: 100%;
			height: 100%;
			padding: 1.5rem;
			box-sizing: border-box;
			gap: 1.25rem;
		}

		.header-section {
			display: flex;
			gap: 2rem;

			.field {
				display: flex;
				flex-direction: column;
			}
			.title {
				flex: 3;
			}
			.date {
				flex: 1;
			}
		}

		.label {
			font-size: 0.75rem;
			font-weight: bold;
			color: var(--text-low);
			margin-bottom: 0.25rem;
			letter-spacing: 0.5px;
		}

		.section-label {
			font-size: 0.8rem;
			font-weight: bold;
			color: var(--text-low);
			border-bottom: 2px solid var(--outline);
			padding-bottom: 0.25rem;
			margin-bottom: 0.5rem;
			letter-spacing: 0.5px;
		}

		.habits-label {
			margin-top: 1rem;
		}

		.line {
			border-bottom: 1px solid var(--outline);
			height: 1.5rem;
			width: 100%;
		}

		.content-section {
			display: flex;
			flex-direction: column;
			gap: 1.25rem;
			flex: 1;
		}

		.sessions-block {
			display: flex;
			flex-direction: column;
			gap: 0.4rem;
		}

		.sessions-header {
			display: flex;
			font-size: 0.65rem;
			font-weight: bold;
			color: var(--text-low);
			border-bottom: 1px solid var(--outline);
			padding-bottom: 0.2rem;
		}

		.col-day {
			width: 3rem;
		}
		.col-time {
			width: 4rem;
		}
		.col-dur {
			width: 3rem;
		}
		.col-tech {
			flex: 1;
			padding-left: 0.5rem;
		}
		.col-state {
			flex: 1;
			padding-left: 0.5rem;
		}

		.session-row {
			display: flex;
			align-items: flex-end;
			gap: 0.5rem;
		}

		.day-label {
			width: 3rem;
			font-size: 0.7rem;
			font-weight: bold;
			color: var(--text-low);
			padding-bottom: 0.2rem;
		}

		.time-line {
			width: 4rem;
		}
		.dur-line {
			width: 3rem;
		}
		.tech-line {
			flex: 1;
		}
		.state-line {
			flex: 1;
		}

		.bottom-section {
			display: flex;
			gap: 2rem;
			flex: 1;
		}

		.column {
			flex: 1;
			display: flex;
			flex-direction: column;
		}

		.todo-row {
			display: flex;
			align-items: flex-end;
			gap: 0.5rem;
		}

		.habits-check-grid {
			display: flex;
			flex-direction: column;
			gap: 0.5rem;
			padding-top: 0.25rem;
		}

		.habit-check-row {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}

		.habit-name {
			font-size: 0.7rem;
			color: var(--text-low);
		}

		.check-boxes {
			display: flex;
			gap: 0.35rem;
		}

		.check-day {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 0.15rem;

			.day-char {
				font-size: 0.55rem;
				font-weight: bold;
				color: var(--text-low);
			}

			.check-box {
				width: 0.85rem !important;
				height: 0.85rem !important;
			}
		}
	}
</style>
