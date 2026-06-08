<script lang="ts">
	import { tTemplate, type PlannerSettings } from '$lib';
	import { Box, Text } from '$atoms';
	import { Field, Row } from '$molecules';

	let { settings = {} as PlannerSettings } = $props();
	let rows = new Array(11);
</script>

<Box class="eisenhower-matrix">
	<Box class="header-section">
		<Field
			class="title-field"
			label={tTemplate('eisenhower_matrix_title', settings?.design?.locale)}
			emoji="🧠"
			showEmoji={!settings?.emojis?.disable} />
		<Field
			class="date-field"
			label={tTemplate('date', settings?.design?.locale)}
			emoji="📅"
			showEmoji={!settings?.emojis?.disable}>
			<Box class="date-slashes">
				<Text tag="span">/</Text>
				<Text tag="span">/</Text>
			</Box>
		</Field>
	</Box>

	<Box class="matrix">
		<!-- DO FIRST (Urgent & Important) -->
		<Box class="quadrant q-do">
			<Box class="q-header">
				<Text tag="strong" class="q-title">{tTemplate('do_first', settings?.design?.locale)}</Text>
				<Text tag="small" class="q-subtitle">{tTemplate('urgent_important', settings?.design?.locale)}</Text>
			</Box>
			<Box class="q-body">
				{#each rows as _, i (i)}
					<Row />
				{/each}
			</Box>
		</Box>

		<!-- SCHEDULE (Not Urgent & Important) -->
		<Box class="quadrant q-schedule">
			<Box class="q-header">
				<Text tag="strong" class="q-title">{tTemplate('schedule', settings?.design?.locale)}</Text>
				<Text tag="small" class="q-subtitle">{tTemplate('not_urgent_important', settings?.design?.locale)}</Text>
			</Box>
			<Box class="q-body">
				{#each rows as _, i (i)}
					<Row />
				{/each}
			</Box>
		</Box>

		<!-- DELEGATE (Urgent & Not Important) -->
		<Box class="quadrant q-delegate">
			<Box class="q-header">
				<Text tag="strong" class="q-title">{tTemplate('delegate', settings?.design?.locale)}</Text>
				<Text tag="small" class="q-subtitle">{tTemplate('urgent_not_important', settings?.design?.locale)}</Text>
			</Box>
			<Box class="q-body">
				{#each rows as _, i (i)}
					<Row />
				{/each}
			</Box>
		</Box>

		<!-- DON'T DO (Not Urgent & Not Important) -->
		<Box class="quadrant q-drop">
			<Box class="q-header">
				<Text tag="strong" class="q-title">{tTemplate('dont_do', settings?.design?.locale)}</Text>
				<Text tag="small" class="q-subtitle">{tTemplate('not_urgent_not_important', settings?.design?.locale)}</Text>
			</Box>
			<Box class="q-body">
				{#each rows as _, i (i)}
					<Row />
				{/each}
			</Box>
		</Box>
	</Box>
</Box>

<style lang="scss">
	:global {
		.eisenhower-matrix {
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
			width: 100%;

			.title-field {
				flex: 3;
			}

			.date-field {
				flex: 1;
			}

			.date-slashes {
				display: flex;
				align-items: flex-end;
				justify-content: space-evenly;
				padding-bottom: 2px;
				color: var(--outline-high, #ccc);
				font-size: 1.2rem;
				font-weight: 300;
				width: 100%;

				span {
					line-height: 1;
				}
			}
		}

		.matrix {
			display: grid;
			grid-template-columns: 1fr 1fr;
			grid-template-rows: 1fr 1fr;
			gap: 1.5rem;
			flex: 1;

			.quadrant {
				display: flex;
				flex-direction: column;
				border: 2px solid var(--outline);
				border-radius: 8px;
				overflow: hidden;

				&.q-do {
					border-color: rgba(220, 38, 38, 0.4);
				}
				&.q-schedule {
					border-color: rgba(22, 163, 74, 0.4);
				}
				&.q-delegate {
					border-color: rgba(217, 119, 6, 0.4);
				}
				&.q-drop {
					border-color: var(--outline-high);
				}

				.q-header {
					display: flex;
					flex-direction: column;
					align-items: center;
					padding: 0.75rem;
					border-bottom: 2px solid var(--outline);
					background-color: var(--nav-bg-pdf, #f8f8f8);

					.q-title {
						font-size: 1.1rem;
						font-weight: bold;
						letter-spacing: 1px;
						color: var(--text);
					}

					.q-subtitle {
						font-size: 0.7rem;
						color: var(--text-low);
						margin-top: 0.25rem;
					}
				}

				.q-body {
					display: flex;
					flex-direction: column;
					flex: 1;
					padding: 0.5rem 1rem;
				}
			}

			.q-do .q-header {
				border-bottom-color: rgba(220, 38, 38, 0.4);
			}
			.q-schedule .q-header {
				border-bottom-color: rgba(22, 163, 74, 0.4);
			}
			.q-delegate .q-header {
				border-bottom-color: rgba(217, 119, 6, 0.4);
			}
			.q-drop .q-header {
				border-bottom-color: var(--outline-high);
			}
		}
	}
</style>
