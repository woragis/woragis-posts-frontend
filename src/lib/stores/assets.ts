import { writable, derived } from 'svelte/store';
import type { CreativeAsset } from '$lib/api/creative';

export interface AssetGenerationState {
	assetId: string | null;
	jobId: string | null;
	status: 'idle' | 'pending' | 'processing' | 'completed' | 'failed';
	progress: number; // 0-100
	imageUrl: string | null;
	mimeType: string | null;
	error: string | null;
	isGenerating: boolean;
}

const initialState: AssetGenerationState = {
	assetId: null,
	jobId: null,
	status: 'idle',
	progress: 0,
	imageUrl: null,
	mimeType: null,
	error: null,
	isGenerating: false
};

// Main generation state store
export const generationState = writable<AssetGenerationState>(initialState);

// Map of assetId -> asset for tracking multiple generations
export const assetMap = writable<Record<string, CreativeAsset>>({});

/**
 * Start a new asset generation
 */
export function startGeneration(assetId: string, jobId: string) {
	generationState.set({
		assetId,
		jobId,
		status: 'pending',
		progress: 0,
		imageUrl: null,
		mimeType: null,
		error: null,
		isGenerating: true
	});
}

/**
 * Update generation progress
 */
export function updateProgress(progress: number, status: 'processing' | 'pending' = 'processing') {
	generationState.update((state) => ({
		...state,
		progress: Math.min(100, Math.max(0, progress)),
		status
	}));
}

/**
 * Mark generation as completed
 */
export function completeGeneration(imageUrl: string, mimeType: string = 'image/png') {
	generationState.update((state) => ({
		...state,
		status: 'completed',
		progress: 100,
		imageUrl,
		mimeType,
		error: null,
		isGenerating: false
	}));
}

/**
 * Mark generation as failed
 */
export function failGeneration(error: string) {
	generationState.update((state) => ({
		...state,
		status: 'failed',
		error,
		isGenerating: false
	}));
}

/**
 * Reset generation state
 */
export function resetGeneration() {
	generationState.set(initialState);
}

/**
 * Update asset in the map
 */
export function setAsset(asset: CreativeAsset) {
	assetMap.update((map) => ({
		...map,
		[asset.id]: asset
	}));
}

/**
 * Get a specific asset from the map
 */
export function getAsset(assetId: string) {
	let asset: CreativeAsset | undefined;
	const unsubscribe = assetMap.subscribe((map) => {
		asset = map[assetId];
	});
	unsubscribe();
	return asset;
}

/**
 * Update multiple assets
 */
export function setAssets(assets: CreativeAsset[]) {
	assetMap.update((map) => {
		const newMap = { ...map };
		assets.forEach((asset) => {
			newMap[asset.id] = asset;
		});
		return newMap;
	});
}

/**
 * Clear all assets
 */
export function clearAssets() {
	assetMap.set({});
}

// Derived stores for convenience

/**
 * Whether an asset is currently being generated
 */
export const isGenerating = derived(generationState, ($state) => $state.isGenerating);

/**
 * Current generation progress as percentage
 */
export const generationProgress = derived(generationState, ($state) => $state.progress);

/**
 * Current generation status
 */
export const generationStatus = derived(generationState, ($state) => $state.status);

/**
 * Current error message
 */
export const generationError = derived(generationState, ($state) => $state.error);

/**
 * Generated image URL
 */
export const generatedImageUrl = derived(generationState, ($state) => $state.imageUrl);
