<script lang="ts">
	import { tTemplate, type PlannerSettings } from '$lib';
	import { Box, Text } from '$atoms';
	import { Field, Row, SectionHeader } from '$molecules';

	let { settings = {} as PlannerSettings } = $props();
	const showEmoji = $derived(!settings?.emojis?.disable);
</script>

<Box class="character-sheet">
	<Box class="header-section">
		<Field label={tTemplate('character_sheet', settings?.design?.locale)} emoji="🎭" {showEmoji} class="title" />
		<Field label={tTemplate('role_class_type', settings?.design?.locale)} class="class-type" />
	</Box>

	<Box class="meta-section">
		<Box class="meta-row">
			<Field label={tTemplate('name', settings?.design?.locale)} class="name" />
			<Field label={tTemplate('archetype_background', settings?.design?.locale)} class="archetype" />
		</Box>
	</Box>

	<Box class="content-section">
		<Box class="top-row">
			<Box class="column attributes">
				<SectionHeader label={tTemplate('attributes_abilities', settings?.design?.locale)} />
				<Box class="attr-grid">
					{#each ['strength_force', 'agility_speed', 'intellect_mind', 'willpower_soul', 'presence_charisma', 'perception_senses'] as attrKey}
						<Box class="attr-row">
							<Text class="attr-name">{tTemplate(attrKey, settings?.design?.locale)}</Text>
							<Box class="attr-score"></Box>
						</Box>
					{/each}
				</Box>
			</Box>

			<Box class="column traits">
				<SectionHeader label={tTemplate('traits_flaws_motivations', settings?.design?.locale)} />
				{#each Array(6) as _}
					<Box class="line"></Box>
				{/each}
			</Box>
		</Box>

		<Box class="bottom-section">
			<Box class="column gear">
				<SectionHeader label={tTemplate('gear_inventory_companions', settings?.design?.locale)} />
				{#each Array(6) as _}
					<Row />
				{/each}
			</Box>

			<Box class="column history">
				<SectionHeader label={tTemplate('history_notes', settings?.design?.locale)} />
				{#each Array(6) as _}
					<Box class="line"></Box>
				{/each}
			</Box>
		</Box>
	</Box>
</Box>

<style lang="scss">
	:global {
		.character-sheet {
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

			.title {
				flex: 3;
			}
			.class-type {
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

			.name {
				flex: 2;
			}
			.archetype {
				flex: 2;
			}
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
			border: none !important;
		}

		.top-row,
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

		.attr-grid {
			display: grid;
			grid-template-rows: repeat(6, 1fr);
			gap: 0.4rem;
		}

		.attr-row {
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-bottom: 1px dashed var(--outline);
			padding-bottom: 0.2rem;
		}

		.attr-name {
			font-size: 0.75rem;
			color: var(--text-low);
			font-weight: 500;
		}

		.attr-score {
			width: 2.25rem;
			height: 1.5rem;
			border: 1px solid var(--outline);
		}
	}
</style>
