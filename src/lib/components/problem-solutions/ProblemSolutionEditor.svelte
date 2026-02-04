<script lang="ts">
	import { goto } from '$app/navigation';
	import { createProblemSolution, updateProblemSolution } from '$lib/stores/problem-solutions';
	import TechAutocomplete from './TechAutocomplete.svelte';
	import type { ProblemSolution, MetricsData } from '$lib/api/types';

	export let problemSolution: ProblemSolution | null = null;
	export let onSave: ((ps: ProblemSolution) => void) | null = null;

	let problem = problemSolution?.problem || '';
	let context = problemSolution?.context || '';
	let solution = problemSolution?.solution || '';
	let technologies = problemSolution?.technologies || [];
	let impact = problemSolution?.impact || '';
	let metrics: MetricsData = problemSolution?.metrics || { before: '', after: '', improvement: '' };
	let featured = problemSolution?.featured || false;
	let isSaving = false;
	let error = '';

	async function handleSubmit() {
		if (!problem.trim() || !context.trim() || !solution.trim() || !impact.trim()) {
			error = 'All main fields are required';
			return;
		}

		isSaving = true;
		error = '';

		try {
			const data = {
				problem: problem.trim(),
				context: context.trim(),
				solution: solution.trim(),
				technologies,
				impact: impact.trim(),
				metrics: metrics.before || metrics.after ? metrics : undefined,
				featured
			};

			let result;
			if (problemSolution?.id) {
				result = await updateProblemSolution(problemSolution.id, data);
			} else {
				result = await createProblemSolution(data);
			}

			if (result) {
				if (onSave) {
					onSave(result);
				}
				await goto(`/problem-solutions/${result.id}/edit`);
			} else {
				error = 'Failed to save problem solution';
			}
		} catch (err: any) {
			error = err.message || 'Failed to save problem solution';
		} finally {
			isSaving = false;
		}
	}
</script>

<div class="bg-white rounded-lg shadow p-6">
	<h2 class="text-2xl font-bold mb-6">{problemSolution ? 'Edit' : 'Create'} Problem Solution</h2>

	{#if error}
		<div class="rounded-md bg-red-50 p-4 mb-4">
			<p class="text-sm text-red-700">{error}</p>
		</div>
	{/if}

	<form on:submit|preventDefault={handleSubmit} class="space-y-6">
		<!-- Problem Statement -->
		<div>
			<label for="problem" class="block text-sm font-medium text-gray-700 mb-1">
				Problem Statement *
			</label>
			<input
				id="problem"
				type="text"
				bind:value={problem}
				required
				class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
				placeholder="What problem did you solve?"
			/>
		</div>

		<!-- Context -->
		<div>
			<label for="context" class="block text-sm font-medium text-gray-700 mb-1">
				Context *
			</label>
			<textarea
				id="context"
				bind:value={context}
				rows={3}
				required
				class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
				placeholder="What was the background/situation? Why was this a problem?"
			></textarea>
		</div>

		<!-- Solution -->
		<div>
			<label for="solution" class="block text-sm font-medium text-gray-700 mb-1">
				Solution *
			</label>
			<textarea
				id="solution"
				bind:value={solution}
				rows={4}
				required
				class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
				placeholder="How did you solve it? What approach did you take?"
			></textarea>
		</div>

		<!-- Technologies -->
		<div>
			<label for="technologies-input" class="block text-sm font-medium text-gray-700 mb-2">
				Technologies Used
			</label>
			<TechAutocomplete id="technologies-input" bind:selectedTechs={technologies} />
		</div>

		<!-- Impact -->
		<div>
			<label for="impact" class="block text-sm font-medium text-gray-700 mb-1">
				Impact *
			</label>
			<textarea
				id="impact"
				bind:value={impact}
				rows={3}
				required
				class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
				placeholder="What was the outcome? What results did you achieve?"
			></textarea>
		</div>

		<!-- Metrics Section - Visual Styling -->
		<div class="border-t pt-6">
			<h3 class="text-lg font-semibold text-gray-900 mb-4">Quantified Impact (Optional)</h3>
			<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
				<!-- Before -->
				<div class="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
					<label for="before" class="block text-sm font-medium text-red-700 mb-2">
						Before
					</label>
					<input
						id="before"
						type="text"
						bind:value={metrics.before}
						class="w-full px-3 py-2 border border-red-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
						placeholder="e.g., 2500ms query time"
					/>
				</div>

				<!-- After -->
				<div class="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
					<label for="after" class="block text-sm font-medium text-green-700 mb-2">
						After
					</label>
					<input
						id="after"
						type="text"
						bind:value={metrics.after}
						class="w-full px-3 py-2 border border-green-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
						placeholder="e.g., 150ms query time"
					/>
				</div>

				<!-- Improvement -->
				<div class="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
					<label for="improvement" class="block text-sm font-medium text-blue-700 mb-2">
						Improvement
					</label>
					<input
						id="improvement"
						type="text"
						bind:value={metrics.improvement}
						class="w-full px-3 py-2 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
						placeholder="e.g., 94% reduction"
					/>
				</div>
			</div>
		</div>

		<!-- Featured Flag -->
		<div>
			<label class="flex items-center gap-2">
				<input
					type="checkbox"
					bind:checked={featured}
					class="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
				/>
				<span class="text-sm font-medium text-gray-700">★ Mark as Featured</span>
			</label>
			<p class="text-xs text-gray-500 mt-1">Featured solutions appear in the public gallery</p>
		</div>

		<!-- Submit Buttons -->
		<div class="flex gap-4 pt-4 border-t">
			<button
				type="submit"
				disabled={isSaving}
				class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
			>
				{isSaving ? 'Saving...' : 'Save Problem Solution'}
			</button>
			<button
				type="button"
				on:click={() => goto('/problem-solutions')}
				class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
			>
				Cancel
			</button>
		</div>
	</form>
</div>
