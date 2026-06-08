<script lang="ts">
	import { tTemplate, type PlannerSettings } from '$lib';
	import { Box, Text, Checkbox } from '$atoms';
	import { Field } from '$molecules';

	let { settings = {} as PlannerSettings } = $props();
	const showEmoji = $derived(!settings?.emojis?.disable);
	let rows = new Array(24);
</script>

<Box class="assignment-tracker">
	<Box class="header-section">
		<Field label={tTemplate('assignment_tracker', settings?.design?.locale)} emoji="📚" {showEmoji} class="title-field" />
		<Field label={tTemplate('semester_quarter', settings?.design?.locale)} emoji="📅" {showEmoji} class="date-field" />
	</Box>

	<Box class="ledger">
		<Box class="header">
			<Box class="col-class">
				{#if showEmoji}<Text>🏫</Text>
					<br />{/if}
				<Text>{tTemplate('class_course', settings?.design?.locale)}</Text>
			</Box>
			<Box class="col-assignment">
				{#if showEmoji}<Text>📝</Text>
					<br />{/if}
				<Text>{tTemplate('assignment', settings?.design?.locale)}</Text>
			</Box>
			<Box class="col-due">
				{#if showEmoji}<Text>⏰</Text>
					<br />{/if}
				<Text>{tTemplate('due_date', settings?.design?.locale)}</Text>
			</Box>
			<Box class="col-status">
				{#if showEmoji}<Text tag="span">🚦</Text>
				{/if}
				<Text tag="span">{tTemplate('status', settings?.design?.locale)}</Text>
				<Box class="status-labels">
					<Text tag="span">{tTemplate('todo', settings?.design?.locale)}</Text>
					<Text tag="span">{tTemplate('doing', settings?.design?.locale)}</Text>
					<Text tag="span">{tTemplate('done', settings?.design?.locale)}</Text>
				</Box>
			</Box>
			<Box class="col-grade">
				{#if showEmoji}<Text>💯</Text>
					<br />{/if}
				<Text>{tTemplate('grade', settings?.design?.locale)}</Text>
			</Box>
		</Box>
		{#each rows as _, i (i)}
			<Box class="row">
				<Box class="col col-class"></Box>
				<Box class="col col-assignment"></Box>
				<Box class="col col-due"></Box>
				<Box class="col col-status">
					<Checkbox aria-label={tTemplate('todo', settings?.design?.locale)} />
					<Checkbox aria-label={tTemplate('doing', settings?.design?.locale)} />
					<Checkbox aria-label={tTemplate('done', settings?.design?.locale)} />
				</Box>
				<Box class="col col-grade"></Box>
			</Box>
		{/each}
	</Box>
</Box>

<style lang="scss">
	:global {
		.assignment-tracker {
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
		}

		.ledger {
			display: flex;
			flex-direction: column;
			flex: 1;
			border: 1px solid var(--outline);
			border-radius: 4px;
			overflow: hidden;

			.header {
				display: flex;
				background-color: var(--nav-bg-pdf, #f8f8f8);
				border-bottom: 2px solid var(--outline);
				font-weight: bold;
				font-size: 0.7rem;
				text-align: center;
				color: var(--text-low);
				letter-spacing: 1px;

				> div {
					padding: 0.5rem 0.25rem;
					border-right: 1px solid var(--outline);
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;

					&:last-child {
						border-right: none;
					}
				}

				.status-labels {
					display: flex;
					justify-content: space-evenly;
					width: 100%;
					margin-top: 0.25rem;
					font-size: 0.65em;
					color: var(--text-low);
					letter-spacing: 0.5px;

					span {
						flex: 1;
						text-align: center;
					}
				}
			}

			.row {
				display: flex;
				flex: 1;
				border-bottom: 1px solid var(--outline);

				&:last-child {
					border-bottom: none;
				}

				&:nth-child(even) {
					background-color: rgba(128, 128, 128, 0.05);
				}

				.col {
					border-right: 1px solid var(--outline);
					height: 100%;

					&:last-child {
						border-right: none;
					}

					&.col-status {
						display: flex;
						align-items: center;
						justify-content: space-evenly;
						padding: 0 0.25rem;
					}
				}
			}

			.col-class {
				flex: 1.5;
			}
			.col-assignment {
				flex: 3;
			}
			.col-due {
				flex: 1;
			}
			.col-status {
				flex: 1.5;
			}
			.col-grade {
				flex: 0.8;
			}
		}
	}
</style>
