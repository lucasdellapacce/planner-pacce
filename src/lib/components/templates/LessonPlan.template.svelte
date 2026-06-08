<script lang="ts">
	import { tTemplate, type PlannerSettings } from '$lib';

	let { settings = {} as PlannerSettings } = $props();
	const showEmoji = $derived(!settings?.emojis?.disable);
</script>

<div class="lesson-plan">
	<div class="header-section">
		<div class="field title">
			<div class="label">
				{#if showEmoji}🍎{/if} {tTemplate('lesson_plan', settings?.design?.locale)}
			</div>
			<div class="line"></div>
		</div>
		<div class="field date">
			<div class="label">{tTemplate('date_class', settings?.design?.locale)}</div>
			<div class="line"></div>
		</div>
	</div>

	<div class="meta-section">
		<div class="meta-row">
			<div class="field subject">
				<div class="label">{tTemplate('subject_topic', settings?.design?.locale)}</div>
				<div class="line"></div>
			</div>
			<div class="field unit">
				<div class="label">{tTemplate('unit_chapter', settings?.design?.locale)}</div>
				<div class="line"></div>
			</div>
		</div>
	</div>

	<div class="content-section">
		<div class="top-row">
			<div class="box-section objectives">
				<div class="section-label">{tTemplate('objectives_outcomes', settings?.design?.locale)}</div>
				{#each Array(4) as _}
					<div class="line"></div>
				{/each}
			</div>

			<div class="box-section materials">
				<div class="section-label">{tTemplate('materials_resources', settings?.design?.locale)}</div>
				{#each Array(4) as _}
					<div class="line"></div>
				{/each}
			</div>
		</div>

		<div class="bottom-section">
			<div class="column activities">
				<div class="section-label">{tTemplate('activities_timeline', settings?.design?.locale)}</div>
				<div class="activity-row warm-up">
					<span class="activity-tag">{tTemplate('warm_up', settings?.design?.locale)}</span>
					<div class="activity-lines">
						<div class="line"></div>
						<div class="line"></div>
					</div>
				</div>
				<div class="activity-row main">
					<span class="activity-tag">{tTemplate('main_act', settings?.design?.locale)}</span>
					<div class="activity-lines">
						{#each Array(4) as _}
							<div class="line"></div>
						{/each}
					</div>
				</div>
				<div class="activity-row wrap-up">
					<span class="activity-tag">{tTemplate('wrap_up', settings?.design?.locale)}</span>
					<div class="activity-lines">
						<div class="line"></div>
						<div class="line"></div>
					</div>
				</div>
			</div>

			<div class="column tracking">
				<div class="section-label">{tTemplate('assessment_feedback', settings?.design?.locale)}</div>
				{#each Array(4) as _}
					<div class="line"></div>
				{/each}

				<div class="section-label homework-label">{tTemplate('homework_followup', settings?.design?.locale)}</div>
				{#each Array(3) as _}
					<div class="line"></div>
				{/each}
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.lesson-plan {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
		padding: 1.5rem;
		box-sizing: border-box;
		gap: 1rem;
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

	.meta-section {
		display: flex;
		flex-direction: column;
	}

	.meta-row {
		display: flex;
		gap: 2rem;

		.field {
			display: flex;
			flex-direction: column;
		}
		.subject {
			flex: 3;
		}
		.unit {
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
		margin-bottom: 0.25rem;
		letter-spacing: 0.5px;
	}

	.homework-label {
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

	.top-row {
		display: flex;
		gap: 2rem;
	}

	.box-section {
		flex: 1;
		display: flex;
		flex-direction: column;
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

	.activities {
		gap: 0.75rem;
	}

	.activity-row {
		display: flex;
		gap: 1rem;
		align-items: flex-start;
	}

	.activity-tag {
		font-size: 0.65rem;
		font-weight: bold;
		color: var(--text-low);
		background-color: var(--outline);
		padding: 0.2rem 0.4rem;
		border-radius: 3px;
		width: 4rem;
		text-align: center;
		margin-top: 0.25rem;
	}

	.activity-lines {
		flex: 1;
		display: flex;
		flex-direction: column;
	}
</style>
