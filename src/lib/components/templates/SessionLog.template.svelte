<script lang="ts">
	import { tTemplate, type PlannerSettings } from '$lib';

	let { settings = {} as PlannerSettings } = $props();
	const showEmoji = $derived(!settings?.emojis?.disable);
</script>

<div class="session-log">
	<div class="header-section">
		<div class="field title">
			<div class="label">
				{#if showEmoji}🎛️{/if} {tTemplate('studio_session_log', settings?.design?.locale)}
			</div>
			<div class="line"></div>
		</div>
		<div class="field date">
			<div class="label">{tTemplate('date', settings?.design?.locale)}</div>
			<div class="line"></div>
		</div>
	</div>

	<div class="meta-section">
		<div class="meta-row">
			<div class="field project">
				<div class="label">{tTemplate('project_song', settings?.design?.locale)}</div>
				<div class="line"></div>
			</div>
			<div class="field tempo">
				<div class="label">{tTemplate('tempo_key', settings?.design?.locale)}</div>
				<div class="line"></div>
			</div>
		</div>
	</div>

	<div class="content-section">
		<div class="column left">
			<div class="section-label">{tTemplate('gear_signal_chain', settings?.design?.locale)}</div>
			{#each Array(5) as _}
				<div class="line"></div>
			{/each}

			<div class="section-label notes-label">{tTemplate('takes_audio_tracks', settings?.design?.locale)}</div>
			<div class="takes-table">
				<div class="table-header">
					<span class="col-take">{tTemplate('tk', settings?.design?.locale)}</span>
					<span class="col-desc">{tTemplate('desc_settings', settings?.design?.locale)}</span>
					<span class="col-rating">{tTemplate('rate', settings?.design?.locale)}</span>
				</div>
				{#each Array(5) as _}
					<div class="table-row">
						<div class="take-box"></div>
						<div class="line"></div>
						<div class="rating-dots">
							{#each Array(5) as _}
								<span class="rating-dot"></span>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</div>

		<div class="column right">
			<div class="section-label">{tTemplate('session_notes', settings?.design?.locale)}</div>
			{#each Array(7) as _}
				<div class="line"></div>
			{/each}

			<div class="section-label steps-label">{tTemplate('next_steps_mix_plan', settings?.design?.locale)}</div>
			{#each Array(5) as _}
				<div class="todo-row">
					<div class="todo-box"></div>
					<div class="line"></div>
				</div>
			{/each}
		</div>
	</div>
</div>

<style lang="scss">
	.session-log {
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
		.project {
			flex: 3;
		}
		.tempo {
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
		margin-top: 0.5rem;
		margin-bottom: 0.25rem;
		letter-spacing: 0.5px;
	}

	.notes-label,
	.steps-label {
		margin-top: 1rem;
	}

	.line {
		border-bottom: 1px solid var(--outline);
		height: 1.5rem;
		width: 100%;
	}

	.content-section {
		display: flex;
		gap: 2rem;
		flex: 1;
	}

	.column {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.takes-table {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		margin-top: 0.25rem;
	}

	.table-header {
		display: flex;
		font-size: 0.65rem;
		font-weight: bold;
		color: var(--text-low);
		padding-bottom: 0.25rem;
		border-bottom: 1px solid var(--outline);
	}

	.col-take {
		width: 2rem;
	}

	.col-desc {
		flex: 1;
		padding-left: 0.5rem;
	}

	.col-rating {
		width: 5rem;
		text-align: right;
	}

	.table-row {
		display: flex;
		align-items: flex-end;
		gap: 0.5rem;
	}

	.take-box {
		width: 1.5rem;
		height: 1.25rem;
		border: 1px solid var(--outline);
		flex-shrink: 0;
	}

	.rating-dots {
		display: flex;
		gap: 0.25rem;
		width: 5rem;
		justify-content: flex-end;
		padding-bottom: 0.25rem;
	}

	.rating-dot {
		width: 0.5rem;
		height: 0.5rem;
		border: 1px solid var(--outline);
		border-radius: 50%;
	}

	.todo-row {
		display: flex;
		align-items: flex-end;
		gap: 0.5rem;
	}

	.todo-box {
		width: 1rem;
		height: 1rem;
		border: 1px solid var(--outline);
		flex-shrink: 0;
		margin-bottom: 0.1rem;
	}
</style>
