<script lang="ts">
	import { useI18n } from '$state';
	const i18n = useI18n();

	import { tTemplate, type PlannerSettings } from '$lib';
	import { Box, Text, Checkbox } from '$atoms';
	import { Field } from '$molecules';

	let { settings = {} as PlannerSettings } = $props();
	const showEmoji = $derived(!settings?.emojis?.disable);
</script>

<Box class="event-planner">
	<Box class="header-section">
		<Field label={tTemplate('event_planner', settings?.design?.locale)} emoji="🎉" {showEmoji} class="title" />
		<Field label={tTemplate('date_time', settings?.design?.locale)} class="date" />
	</Box>

	<Box class="content-section">
		<Box class="columns">
			<Box class="column">
				<Text class="label">{tTemplate('guest_list', settings?.design?.locale)}</Text>
				{#each Array(15) as _}
					<Box class="check-row">
						<Checkbox aria-label={i18n.t('templates.checks.guest')} />
						<Box class="line"></Box>
					</Box>
				{/each}
			</Box>
			<Box class="column">
				<Text class="label">{tTemplate('todo', settings?.design?.locale).toUpperCase()}</Text>
				{#each Array(15) as _}
					<Box class="check-row">
						<Checkbox aria-label={i18n.t('templates.checks.todo')} />
						<Box class="line"></Box>
					</Box>
				{/each}
			</Box>
		</Box>

		<Box class="bottom-section">
			<Text class="label">{tTemplate('expenses', settings?.design?.locale)}</Text>
			<Box class="budget-grid">
				{#each Array(6) as _}
					<Box class="budget-row">
						<Box class="item-line"></Box>
						<Box class="amount-line"></Box>
					</Box>
				{/each}
			</Box>
		</Box>
	</Box>
</Box>

<style lang="scss">
	:global {
		.event-planner {
			display: flex;
			flex-direction: column;
			width: 100%;
			height: 100%;
			padding: 1.5rem;
			box-sizing: border-box;
			gap: 1.5rem;
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

		.line {
			border-bottom: 1px solid var(--outline);
			height: 1.5rem;
			width: 100%;
		}

		.content-section {
			display: flex;
			flex-direction: column;
			gap: 1rem;
			/* prevent the columns from stretching to fill the page so the budget
			   block sits closer to the columns instead of the bottom whitespace */
		}

		.columns {
			display: flex;
			gap: 1.5rem;
			/* don't grow vertically */
			flex: none;

			.column {
				flex: 1;
				display: flex;
				flex-direction: column;
				gap: 0.5rem;
			}
		}

		.check-row {
			display: flex;
			align-items: flex-end;
			gap: 0.5rem;
		}

		.bottom-section {
			display: flex;
			flex-direction: column;
			gap: 0.5rem;

			.budget-grid {
				display: flex;
				flex-direction: column;
				gap: 0.5rem;
			}

			.budget-row {
				display: flex;
				align-items: flex-end;
				gap: 1rem;
			}

			.item-line {
				border-bottom: 1px solid var(--outline);
				height: 1.2rem;
				flex: 1;
			}

			.amount-line {
				border-bottom: 1px solid var(--outline);
				height: 1.2rem;
				width: 6.5rem;
				text-align: right;
			}
		}
	}
</style>
