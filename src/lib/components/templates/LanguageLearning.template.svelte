<script lang="ts">
	import { tTemplate, type PlannerSettings } from '$lib';

	let { settings = {} as PlannerSettings } = $props();
</script>

<div class="language-learning">
	<div class="header-section">
		<div class="field title">
			<div class="label">
				{#if !settings?.emojis?.disable}🗣️{/if} {tTemplate('language_learning', settings?.design?.locale)}
			</div>
			<div class="line"></div>
		</div>
		<div class="field date">
			<div class="label">{tTemplate('date_week', settings?.design?.locale)}</div>
			<div class="line"></div>
		</div>
	</div>

	<div class="content-section">
		<div class="columns">
			<div class="column">
				<div class="label">{tTemplate('vocabulary', settings?.design?.locale)}</div>
				{#each Array(12) as _}
					<div class="vocab-row">
						<div class="line"></div>
						<span class="equals">=</span>
						<div class="line"></div>
					</div>
				{/each}
			</div>
			<div class="column">
				<div class="label">{tTemplate('grammar_concepts', settings?.design?.locale)}</div>
				{#each Array(12) as _}
					<div class="line"></div>
				{/each}
			</div>
		</div>

		<div class="bottom-section">
			<div class="label">{tTemplate('practice_tracker', settings?.design?.locale)}</div>
			<div class="practice-days">
				{#each ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as day}
					<div class="day-box">
						<div class="day-label">{tTemplate(day, settings?.design?.locale).toUpperCase()}</div>
						<div class="box"></div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.language-learning {
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
		gap: 2rem;
		flex: 1;
	}

	.columns {
		display: flex;
		gap: 2rem;
		flex: 1;

		.column {
			flex: 1;
			display: flex;
			flex-direction: column;
			gap: 0.5rem;
		}
	}

	.vocab-row {
		display: flex;
		align-items: flex-end;
		gap: 0.5rem;

		.equals {
			font-size: 1rem;
			color: var(--text-low);
			padding-bottom: 0.25rem;
		}
	}

	.bottom-section {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-top: auto;
		padding-top: 1rem;
	}

	.practice-days {
		display: flex;
		justify-content: space-between;

		.day-box {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 0.5rem;

			.day-label {
				font-size: 0.65rem;
				font-weight: bold;
				color: var(--text-low);
			}

			.box {
				width: 2rem;
				height: 2rem;
				border: 1px solid var(--outline);
			}
		}
	}
</style>
