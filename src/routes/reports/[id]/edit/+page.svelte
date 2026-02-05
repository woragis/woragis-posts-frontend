<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { ReportEditor } from '$lib/components/reports';
	import { reports } from '$lib/stores/reports';
	import type { UpdateReportRequest } from '$lib/api/types';

	onMount(async () => {
		try {
			const reportId = $page.params.id;
			if (reportId) {
				await reports.loadOne(reportId);
			}
		} catch (err) {
			console.error('Failed to load report:', err);
		}
	});

	async function handleSubmit(data: UpdateReportRequest) {
		try {
			const reportId = $page.params.id;
			if (reportId) {
				await reports.updateReport(reportId, data);
				await goto('/reports');
			}
		} catch (err) {
			console.error('Failed to update report:', err);
			throw err;
		}
	}

	async function handleDelete() {
		if (confirm('Are you sure? This action cannot be undone.')) {
			try {
				const reportId = $page.params.id;
				if (reportId) {
					await reports.deleteReport(reportId);
					await goto('/reports');
				}
			} catch (err) {
				console.error('Failed to delete report:', err);
			}
		}
	}
</script>

<div class="min-h-screen bg-gray-50 py-8">
	<div class="mx-auto max-w-6xl px-4">
		<div class="mb-8 flex items-center justify-between">
			<div>
				<a href="/reports" class="text-sm font-medium text-blue-600 hover:text-blue-700">
					← Back to Reports
				</a>
				<h1 class="mt-4 text-3xl font-bold text-gray-900">Edit Report</h1>
			</div>
			<button
				on:click={handleDelete}
				class="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
			>
				🗑️ Delete
			</button>
		</div>

		<div class="grid grid-cols-3 gap-6">
			<div class="col-span-2 rounded-lg bg-white p-8 shadow">
				<ReportEditor initialData={$reports.currentReport || undefined} onSubmit={handleSubmit} />
			</div>

			<div class="space-y-6">
				<div class="rounded-lg bg-white p-6 shadow">
					<h3 class="mb-4 text-lg font-semibold text-gray-900">Report Info</h3>
					<div class="space-y-3 text-sm">
						<div>
							<p class="font-medium text-gray-600">Status</p>
							<p class="text-gray-900">
								{#if $reports.currentReport?.isFavorite}
									<span
										class="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-amber-800"
									>
										⭐ Favorite
									</span>
								{:else}
									<span
										class="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-gray-800"
									>
										Not favorite
									</span>
								{/if}
							</p>
						</div>
						{#if $reports.currentReport}
							<div>
								<p class="font-medium text-gray-600">Sections</p>
								<p class="text-gray-900">
									{$reports.currentReport.sections
										? Object.keys($reports.currentReport.sections).length
										: 0} configured
								</p>
							</div>
							<div>
								<p class="font-medium text-gray-600">Filters</p>
								<p class="text-gray-900">
									{$reports.currentReport.filters
										? Object.keys($reports.currentReport.filters).length
										: 0} configured
								</p>
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
