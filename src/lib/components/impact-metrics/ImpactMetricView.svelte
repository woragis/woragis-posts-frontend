<script lang="ts">
	import type { ImpactMetric } from '$lib/api/types';

	export let metric: ImpactMetric;

	function getTypeLabel(type: string): string {
		const labels: Record<string, string> = {
			projects_delivered: 'Projects Delivered',
			users_impacted: 'Users Impacted',
			performance_improvement: 'Performance Improvement',
			cost_savings: 'Cost Savings',
			time_saved: 'Time Saved'
		};
		return labels[type] || type;
	}

	function getUnitLabel(unit: string): string {
		const labels: Record<string, string> = {
			count: 'Count',
			percentage: '%',
			currency: '$',
			hours: 'hrs',
			days: 'days',
			months: 'months',
			years: 'years',
			seconds: 'sec',
			minutes: 'min',
			milliseconds: 'ms'
		};
		return labels[unit] || unit;
	}

	function formatDate(date: string): string {
		return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
	}

	function formatValue(value: number, unit: string): string {
		if (unit === 'currency') return `$${value.toLocaleString()}`;
		if (unit === 'percentage') return `${value}%`;
		return value.toLocaleString();
	}
</script>

<div class="rounded-lg border border-gray-200 bg-white p-8">
	<div class="mb-6 flex items-start justify-between">
		<div>
			<h2 class="text-2xl font-bold text-gray-900">{getTypeLabel(metric.type)}</h2>
			{#if metric.featured}
				<div class="mt-2 flex items-center gap-2 text-amber-600">
					<span>⭐</span>
					<span class="text-sm font-medium">Featured Metric</span>
				</div>
			{/if}
		</div>
		<div class="text-right">
			<div class="text-4xl font-bold text-blue-600">{formatValue(metric.value, metric.unit)}</div>
			<div class="mt-1 text-lg text-gray-600">{getUnitLabel(metric.unit)}</div>
		</div>
	</div>

	{#if metric.description}
		<div class="mb-6 border-t pt-6">
			<h3 class="mb-2 text-sm font-medium text-gray-700">Description</h3>
			<p class="text-gray-600">{metric.description}</p>
		</div>
	{/if}

	<div class="mb-6 border-t pt-6">
		<div class="grid grid-cols-2 gap-4">
			<div>
				<div class="text-xs font-semibold uppercase text-gray-500">Created</div>
				<div class="mt-1 text-sm text-gray-900">{formatDate(metric.createdAt)}</div>
			</div>
			<div>
				<div class="text-xs font-semibold uppercase text-gray-500">Last Updated</div>
				<div class="mt-1 text-sm text-gray-900">{formatDate(metric.updatedAt)}</div>
			</div>
		</div>
	</div>

	{#if metric.displayOrder >= 0}
		<div class="border-t pt-6">
			<div class="text-xs font-semibold uppercase text-gray-500">Display Order</div>
			<div class="mt-1 text-sm text-gray-900">#{metric.displayOrder}</div>
		</div>
	{/if}
</div>
