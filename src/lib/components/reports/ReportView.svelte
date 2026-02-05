<script lang="ts">
	import type { Report } from '$lib/api/types';

	export let report: Report | null;

	function formatDate(date: string | undefined) {
		if (!date) return '';
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

{#if !report}
	<div class="py-12 text-center text-gray-500">Report not found</div>
{:else}
	<div class="space-y-8">
		<div>
			<div class="mb-4 flex items-center gap-3">
				<h1 class="text-3xl font-bold text-gray-900">{report.name}</h1>
				{#if report.isFavorite}
					<span class="text-2xl">⭐</span>
				{/if}
			</div>
			{#if report.description}
				<p class="text-lg text-gray-600">{report.description}</p>
			{/if}
		</div>

		{#if report.sections && Object.keys(report.sections).length > 0}
			<div class="space-y-6">
				<h2 class="text-xl font-semibold text-gray-900">Report Sections</h2>
				{#each Object.entries(report.sections) as [sectionName, sectionData]}
					<div class="rounded-lg border border-gray-200 bg-white p-6">
						<h3 class="mb-4 text-lg font-semibold text-gray-900 capitalize">
							{sectionName.replace(/_/g, ' ')}
						</h3>
						<div class="overflow-x-auto rounded bg-gray-50 p-4 font-mono text-sm">
							<pre>{JSON.stringify(sectionData, null, 2)}</pre>
						</div>
					</div>
				{/each}
			</div>
		{/if}

		{#if report.filters && Object.keys(report.filters).length > 0}
			<div class="space-y-6">
				<h2 class="text-xl font-semibold text-gray-900">Filters Applied</h2>
				<div class="rounded-lg border border-gray-200 bg-white p-6">
					<div class="overflow-x-auto rounded bg-gray-50 p-4 font-mono text-sm">
						<pre>{JSON.stringify(report.filters, null, 2)}</pre>
					</div>
				</div>
			</div>
		{/if}

		<div class="border-t border-gray-200 pt-6">
			<div class="grid grid-cols-2 gap-4 text-sm">
				<div>
					<p class="font-medium text-gray-600">Created</p>
					<p class="text-gray-900">{formatDate(report.createdAt)}</p>
				</div>
				<div>
					<p class="font-medium text-gray-600">Last Updated</p>
					<p class="text-gray-900">{formatDate(report.updatedAt)}</p>
				</div>
			</div>
		</div>
	</div>
{/if}
