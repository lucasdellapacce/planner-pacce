<script lang="ts">
	import { tTemplate, type PlannerSettings } from '$lib';

	let { settings = {} as PlannerSettings } = $props();
</script>

<div class="recipe-card">
	<div class="header-section">
		<div class="field title">
			<div class="label">
				{#if !settings?.emojis?.disable}🥘{/if} {tTemplate('recipe_name', settings?.design?.locale)}
			</div>
			<div class="line"></div>
		</div>
		<div class="field time">
			<div class="label">{tTemplate('prep_cook_time', settings?.design?.locale)}</div>
			<div class="line"></div>
		</div>
	</div>

	<div class="content-section">
		<div class="columns">
			<div class="column">
				<div class="label">{tTemplate('ingredients', settings?.design?.locale)}</div>
				{#each Array(15) as _}
					<div class="check-row">
						<div class="box"></div>
						<div class="line"></div>
					</div>
				{/each}
			</div>
			<div class="column">
				<div class="label">{tTemplate('directions', settings?.design?.locale)}</div>
				{#each Array(15) as _}
					<div class="line"></div>
				{/each}
			</div>
		</div>

		<div class="bottom-section">
			<div class="label">{tTemplate('nutrition_notes', settings?.design?.locale).toUpperCase()}</div>
			<div class="lines">
				{#each Array(3) as _}
					<div class="line"></div>
				{/each}
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.recipe-card {
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
		.time {
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

	.check-row {
		display: flex;
		align-items: flex-end;
		gap: 0.5rem;

		.box {
			width: 1rem;
			height: 1rem;
			border: 1px solid var(--outline);
			flex-shrink: 0;
		}
	}

	.bottom-section {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;

		.lines {
			display: flex;
			flex-direction: column;
			gap: 0.5rem;
		}
	}
</style>
