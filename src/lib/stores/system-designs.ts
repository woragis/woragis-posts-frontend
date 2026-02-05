import { writable, derived } from 'svelte/store';
import { systemDesignsClient } from '$lib/api/system-designs/client';
import type {
	SystemDesign,
	CreateSystemDesignRequest,
	UpdateSystemDesignRequest
} from '$lib/api/types';

interface SystemDesignsStore {
	items: SystemDesign[];
	featuredItems: SystemDesign[];
	currentSystemDesign: SystemDesign | null;
	isLoading: boolean;
	isLoadingFeatured: boolean;
	error: string | null;
}

function createSystemDesignsStore() {
	const initialState: SystemDesignsStore = {
		items: [],
		featuredItems: [],
		currentSystemDesign: null,
		isLoading: false,
		isLoadingFeatured: false,
		error: null
	};

	const { subscribe, set, update } = writable(initialState);

	return {
		subscribe,
		loadSystemDesigns: async () => {
			update((state) => ({ ...state, isLoading: true, error: null }));
			try {
				const items = await systemDesignsClient.listSystemDesigns();
				update((state) => ({ ...state, items, isLoading: false }));
			} catch (err) {
				const error = err instanceof Error ? err.message : 'Failed to load system designs';
				update((state) => ({ ...state, error, isLoading: false }));
			}
		},
		loadFeatured: async () => {
			update((state) => ({ ...state, isLoadingFeatured: true, error: null }));
			try {
				const featuredItems = await systemDesignsClient.listFeatured();
				update((state) => ({ ...state, featuredItems, isLoadingFeatured: false }));
			} catch (err) {
				const error = err instanceof Error ? err.message : 'Failed to load featured designs';
				update((state) => ({ ...state, error, isLoadingFeatured: false }));
			}
		},
		loadOne: async (id: string) => {
			update((state) => ({ ...state, isLoading: true, error: null }));
			try {
				const currentSystemDesign = await systemDesignsClient.getSystemDesign(id);
				update((state) => ({ ...state, currentSystemDesign, isLoading: false }));
			} catch (err) {
				const error = err instanceof Error ? err.message : 'Failed to load system design';
				update((state) => ({ ...state, error, isLoading: false }));
			}
		},
		loadPublic: async (id: string) => {
			update((state) => ({ ...state, isLoading: true, error: null }));
			try {
				const currentSystemDesign = await systemDesignsClient.getPublic(id);
				update((state) => ({ ...state, currentSystemDesign, isLoading: false }));
			} catch (err) {
				const error = err instanceof Error ? err.message : 'Failed to load system design';
				update((state) => ({ ...state, error, isLoading: false }));
			}
		},
		createSystemDesign: async (req: CreateSystemDesignRequest) => {
			update((state) => ({ ...state, isLoading: true, error: null }));
			try {
				const newDesign = await systemDesignsClient.createSystemDesign(req);
				update((state) => ({
					...state,
					items: [newDesign, ...state.items],
					isLoading: false
				}));
				return newDesign;
			} catch (err) {
				const error = err instanceof Error ? err.message : 'Failed to create system design';
				update((state) => ({ ...state, error, isLoading: false }));
				throw err;
			}
		},
		updateSystemDesign: async (id: string, req: UpdateSystemDesignRequest) => {
			update((state) => ({ ...state, isLoading: true, error: null }));
			try {
				const updated = await systemDesignsClient.updateSystemDesign(id, req);
				update((state) => ({
					...state,
					items: state.items.map((item) => (item.id === id ? updated : item)),
					currentSystemDesign:
						state.currentSystemDesign?.id === id ? updated : state.currentSystemDesign,
					isLoading: false
				}));
				return updated;
			} catch (err) {
				const error = err instanceof Error ? err.message : 'Failed to update system design';
				update((state) => ({ ...state, error, isLoading: false }));
				throw err;
			}
		},
		deleteSystemDesign: async (id: string) => {
			update((state) => ({ ...state, isLoading: true, error: null }));
			try {
				await systemDesignsClient.deleteSystemDesign(id);
				update((state) => ({
					...state,
					items: state.items.filter((item) => item.id !== id),
					currentSystemDesign:
						state.currentSystemDesign?.id === id ? null : state.currentSystemDesign,
					isLoading: false
				}));
			} catch (err) {
				const error = err instanceof Error ? err.message : 'Failed to delete system design';
				update((state) => ({ ...state, error, isLoading: false }));
				throw err;
			}
		},
		clear: () => set(initialState)
	};
}

export const systemDesigns = createSystemDesignsStore();
