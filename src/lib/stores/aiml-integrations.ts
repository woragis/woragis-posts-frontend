import { writable, derived } from 'svelte/store';
import { aimlIntegrationsClient } from '$lib/api/aiml-integrations';
import type {
	AimlIntegration,
	CreateAimlIntegrationRequest,
	UpdateAimlIntegrationRequest
} from '$lib/api/types';

interface AIMLIntegrationsStore {
	items: AimlIntegration[];
	featuredItems: AimlIntegration[];
	currentIntegration: AimlIntegration | null;
	isLoading: boolean;
	isLoadingFeatured: boolean;
	error: string | null;
}

const initialState: AIMLIntegrationsStore = {
	items: [],
	featuredItems: [],
	currentIntegration: null,
	isLoading: false,
	isLoadingFeatured: false,
	error: null
};

function createAIMLIntegrationsStore() {
	const { subscribe, set, update } = writable<AIMLIntegrationsStore>(initialState);

	return {
		subscribe,

		async loadIntegrations() {
			update((state) => ({ ...state, isLoading: true, error: null }));
			try {
				const items = await aimlIntegrationsClient.listIntegrations();
				update((state) => ({ ...state, items, isLoading: false }));
			} catch (err) {
				const message = err instanceof Error ? err.message : 'Failed to load integrations';
				update((state) => ({ ...state, error: message, isLoading: false }));
				throw err;
			}
		},

		async loadFeatured() {
			update((state) => ({ ...state, isLoadingFeatured: true, error: null }));
			try {
				const featuredItems = await aimlIntegrationsClient.getFeatured();
				update((state) => ({ ...state, featuredItems, isLoadingFeatured: false }));
			} catch (err) {
				const message = err instanceof Error ? err.message : 'Failed to load featured integrations';
				update((state) => ({ ...state, error: message, isLoadingFeatured: false }));
				throw err;
			}
		},

		async loadOne(id: string) {
			update((state) => ({ ...state, isLoading: true, error: null }));
			try {
				const currentIntegration = await aimlIntegrationsClient.getIntegration(id);
				update((state) => ({ ...state, currentIntegration, isLoading: false }));
			} catch (err) {
				const message = err instanceof Error ? err.message : 'Failed to load integration';
				update((state) => ({ ...state, error: message, isLoading: false }));
				throw err;
			}
		},

		async createIntegration(data: CreateAimlIntegrationRequest) {
			update((state) => ({ ...state, isLoading: true, error: null }));
			try {
				const newIntegration = await aimlIntegrationsClient.createIntegration(data);
				update((state) => ({
					...state,
					items: [...state.items, newIntegration],
					isLoading: false
				}));
				return newIntegration;
			} catch (err) {
				const message = err instanceof Error ? err.message : 'Failed to create integration';
				update((state) => ({ ...state, error: message, isLoading: false }));
				throw err;
			}
		},

		async updateIntegration(id: string, data: UpdateAimlIntegrationRequest) {
			update((state) => ({ ...state, isLoading: true, error: null }));
			try {
				const updated = await aimlIntegrationsClient.updateIntegration(id, data);
				update((state) => ({
					...state,
					items: state.items.map((item) => (item.id === id ? updated : item)),
					currentIntegration:
						state.currentIntegration?.id === id ? updated : state.currentIntegration,
					isLoading: false
				}));
				return updated;
			} catch (err) {
				const message = err instanceof Error ? err.message : 'Failed to update integration';
				update((state) => ({ ...state, error: message, isLoading: false }));
				throw err;
			}
		},

		async deleteIntegration(id: string) {
			update((state) => ({ ...state, isLoading: true, error: null }));
			try {
				await aimlIntegrationsClient.deleteIntegration(id);
				update((state) => ({
					...state,
					items: state.items.filter((item) => item.id !== id),
					currentIntegration: state.currentIntegration?.id === id ? null : state.currentIntegration,
					isLoading: false
				}));
			} catch (err) {
				const message = err instanceof Error ? err.message : 'Failed to delete integration';
				update((state) => ({ ...state, error: message, isLoading: false }));
				throw err;
			}
		},

		clear() {
			set(initialState);
		}
	};
}

export const aimlIntegrations = createAIMLIntegrationsStore();
