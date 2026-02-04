<script lang="ts">
	import {
		GenerationModal,
		ProgressIndicator,
		ImagePreview,
		AssetManager
	} from '$lib/components/assets';
	import type { CreativeAsset } from '$lib/api/creative';

	export let postId: string;

	let generatedAssets: CreativeAsset[] = [];
	let isLoadingAssets = false;

	// Load existing assets when postId changes
	$: if (postId) {
		loadAssets();
	}

	async function loadAssets() {
		try {
			isLoadingAssets = true;
			// This would import and call getAssets from $lib/api/creative
			// For now, this is handled by AssetManager
		} catch (error) {
			console.error('Failed to load assets:', error);
		} finally {
			isLoadingAssets = false;
		}
	}

	function handleAssetGenerated(event: CustomEvent) {
		// Re-load assets when a new one is generated
		loadAssets();
	}
</script>

<div class="space-y-6 border-t border-gray-200 pt-6">
	<!-- Header -->
	<div>
		<h3 class="text-lg font-bold text-gray-900">✨ Generate Assets</h3>
		<p class="mt-1 text-sm text-gray-600">
			Create thumbnail, featured image, and OG image automatically
		</p>
	</div>

	<!-- Quick Generate Buttons -->
	<div class="grid grid-cols-1 gap-3 md:grid-cols-3">
		<GenerationModal {postId} assetType="thumbnail" on:assetGenerated={handleAssetGenerated} />
		<GenerationModal {postId} assetType="featured-image" on:assetGenerated={handleAssetGenerated} />
		<GenerationModal {postId} assetType="og-image" on:assetGenerated={handleAssetGenerated} />
	</div>

	<!-- Asset Manager - shows all generated assets -->
	<div class="rounded-lg bg-gray-50 p-4">
		<h4 class="mb-4 font-semibold text-gray-900">Generated Assets</h4>
		<AssetManager {postId} />
	</div>
</div>

<style>
	/* Components handle their own styling via Tailwind */
</style>
