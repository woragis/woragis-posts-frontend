<script lang="ts">
	import type { ImpactMetric } from '$lib/api/types';

	type MetricType = 'projects_delivered' | 'users_impacted' | 'performance_improvement' | 'cost_savings' | 'time_saved';
	type MetricUnit = 'count' | 'percentage' | 'currency' | 'hours' | 'days' | 'months' | 'years' | 'milliseconds' | 'seconds' | 'minutes';

	export let initialData: ImpactMetric | null | undefined = undefined;
	export let onSubmit: (data: any) => Promise<void>;

	let type: MetricType = (initialData?.type as MetricType) || 'projects_delivered';
	let value = initialData?.value || 0;
	let unit: MetricUnit = (initialData?.unit as MetricUnit) || 'count';
	let description = initialData?.description || '';
	let featured = initialData?.featured || false;
	let displayOrder = initialData?.displayOrder || 0;
	let isSubmitting = false;
	let error: string | null = null;

	const metricTypes: { value: MetricType; label: string }[] = [
		{ value: 'projects_delivered', label: 'Projects Delivered' },
		{ value: 'users_impacted', label: 'Users Impacted' },
		{ value: 'performance_improvement', label: 'Performance Improvement' },
		{ value: 'cost_savings', label: 'Cost Savings' },
		{ value: 'time_saved', label: 'Time Saved' }
	];

	const units: { value: MetricUnit; label: string }[] = [
		{ value: 'count', label: 'Count' },
		{ value: 'percentage', label: 'Percentage (%)' },
		{ value: 'currency', label: 'Currency ($)' },
		{ value: 'hours', label: 'Hours' },
		{ value: 'days', label: 'Days' },
		{ value: 'months', label: 'Months' },
		{ value: 'years', label: 'Years' },
		{ value: 'seconds', label: 'Seconds' },
		{ value: 'minutes', label: 'Minutes' },
		{ value: 'milliseconds', label: 'Milliseconds' }
	];

	async function handleSubmit(e: Event) {
		e.preventDefault();
		isSubmitting = true;
		error = null;

		try {
			const data = {
				type,
				value: Number(value),
				unit,
				description: description.trim(),
				featured,
				displayOrder: Number(displayOrder)
			};

			await onSubmit(data);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to save metric';
		} finally {
			isSubmitting = false;
		}
	}
</script>

<form on:submit={handleSubmit} class="space-y-6">
	<div class="grid grid-cols-2 gap-4">
		<div>
			<label for="type" class="block text-sm font-medium text-gray-700 mb-2">Metric Type *</label>
			<select
				id="type"
				bind:value={type}
				required
				class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
			>
				{#each metricTypes as opt}
					<option value={opt.value}>{opt.label}</option>
				{/each}
			</select>
		</div>

		<div>
			<label for="unit" class="block text-sm font-medium text-gray-700 mb-2">Unit *</label>
			<select
				id="unit"
				bind:value={unit}
				required
				class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
			>
				{#each units as opt}
					<option value={opt.value}>{opt.label}</option>
				{/each}
			</select>
		</div>
	</div>

	<div class="grid grid-cols-2 gap-4">
		<div>
			<label for="value" class="block text-sm font-medium text-gray-700 mb-2">Value *</label>
			<input
				id="value"
				type="number"
				bind:value
				step="0.01"
				required
				placeholder="0.00"
				class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
			/>
		</div>

		<div>
			<label for="displayOrder" class="block text-sm font-medium text-gray-700 mb-2">Display Order</label>
			<input
				id="displayOrder"
				type="number"
				bind:value={displayOrder}
				placeholder="0"
				class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
			/>
		</div>
	</div>

	<div>
		<label for="description" class="block text-sm font-medium text-gray-700 mb-2">Description</label>
		<textarea
			id="description"
			bind:value={description}
			placeholder="Describe this metric..."
			rows="3"
			class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
		></textarea>
	</div>

	<div class="flex items-center gap-3">
		<input
			type="checkbox"
			id="featured"
			bind:checked={featured}
			class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
		/>
		<label for="featured" class="text-sm font-medium text-gray-700">Mark as featured</label>
	</div>

	{#if error}
		<div class="rounded-lg bg-red-50 p-3 text-sm text-red-700">
			{error}
		</div>
	{/if}

	<div class="flex gap-3">
		<button
			type="submit"
			disabled={isSubmitting}
			class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
		>
			{isSubmitting ? 'Saving...' : initialData ? 'Update Metric' : 'Create Metric'}
		</button>
		<a
			href="/impact-metrics"
			class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
		>
			Cancel
		</a>
	</div>
</form>
