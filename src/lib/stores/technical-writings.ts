import { writable, derived } from 'svelte/store';
import { technicalWritingsClient } from '$lib/api/technical-writings/client';
import type {
	TechnicalWriting,
	CreateTechnicalWritingRequest,
	UpdateTechnicalWritingRequest,
	WritingType,
	WritingPublicationPlatform
} from '$lib/api/types';

interface WritingFilters {
	type?: WritingType;
	platform?: WritingPublicationPlatform;
	projectId?: string;
	featured?: boolean;
	limit?: number;
	offset?: number;
}

interface TechnicalWritingsStore {
	items: TechnicalWriting[];
	featuredItems: TechnicalWriting[];
	currentWriting: TechnicalWriting | null;
	filteredByType: TechnicalWriting[];
	filteredByPlatform: TechnicalWriting[];
	isLoading: boolean;
	isLoadingFeatured: boolean;
	error: string | null;
}

const initialState: TechnicalWritingsStore = {
	items: [],
	featuredItems: [],
	currentWriting: null,
	filteredByType: [],
	filteredByPlatform: [],
	isLoading: false,
	isLoadingFeatured: false,
	error: null
};

function createTechnicalWritingsStore() {
	const { subscribe, set, update } = writable<TechnicalWritingsStore>(initialState);

	return {
		subscribe,

		async loadWritings(filters?: WritingFilters) {
			update((state) => ({ ...state, isLoading: true, error: null }));
			try {
				const items = await technicalWritingsClient.listWritings(filters);
				update((state) => ({ ...state, items, isLoading: false }));
			} catch (err) {
				const error = err instanceof Error ? err.message : 'Failed to load writings';
				update((state) => ({ ...state, error, isLoading: false }));
			}
		},

		async loadFeatured() {
			update((state) => ({ ...state, isLoadingFeatured: true, error: null }));
			try {
				const featuredItems = await technicalWritingsClient.listFeatured();
				update((state) => ({ ...state, featuredItems, isLoadingFeatured: false }));
			} catch (err) {
				const error = err instanceof Error ? err.message : 'Failed to load featured writings';
				update((state) => ({ ...state, error, isLoadingFeatured: false }));
			}
		},

		async loadByType(type: WritingType) {
			update((state) => ({ ...state, isLoading: true, error: null }));
			try {
				const filteredByType = await technicalWritingsClient.getByType(type);
				update((state) => ({ ...state, filteredByType, isLoading: false }));
			} catch (err) {
				const error = err instanceof Error ? err.message : 'Failed to load writings by type';
				update((state) => ({ ...state, error, isLoading: false }));
			}
		},

		async loadByPlatform(platform: WritingPublicationPlatform) {
			update((state) => ({ ...state, isLoading: true, error: null }));
			try {
				const filteredByPlatform = await technicalWritingsClient.getByPlatform(platform);
				update((state) => ({ ...state, filteredByPlatform, isLoading: false }));
			} catch (err) {
				const error = err instanceof Error ? err.message : 'Failed to load writings by platform';
				update((state) => ({ ...state, error, isLoading: false }));
			}
		},

		async loadByProject(projectId: string) {
			update((state) => ({ ...state, isLoading: true, error: null }));
			try {
				const items = await technicalWritingsClient.getByProject(projectId);
				update((state) => ({ ...state, items, isLoading: false }));
			} catch (err) {
				const error = err instanceof Error ? err.message : 'Failed to load project writings';
				update((state) => ({ ...state, error, isLoading: false }));
			}
		},

		async loadOne(id: string) {
			update((state) => ({ ...state, isLoading: true, error: null }));
			try {
				const currentWriting = await technicalWritingsClient.getWriting(id);
				update((state) => ({ ...state, currentWriting, isLoading: false }));
			} catch (err) {
				const error = err instanceof Error ? err.message : 'Failed to load writing';
				update((state) => ({ ...state, error, isLoading: false }));
			}
		},

		async loadPublic(id: string) {
			update((state) => ({ ...state, isLoading: true, error: null }));
			try {
				const currentWriting = await technicalWritingsClient.getPublic(id);
				update((state) => ({ ...state, currentWriting, isLoading: false }));
			} catch (err) {
				const error = err instanceof Error ? err.message : 'Failed to load writing';
				update((state) => ({ ...state, error, isLoading: false }));
			}
		},

		async createWriting(req: CreateTechnicalWritingRequest) {
			update((state) => ({ ...state, isLoading: true, error: null }));
			try {
				const writing = await technicalWritingsClient.createWriting(req);
				update((state) => ({
					...state,
					currentWriting: writing,
					items: [writing, ...state.items],
					isLoading: false
				}));
				return writing;
			} catch (err) {
				const error = err instanceof Error ? err.message : 'Failed to create writing';
				update((state) => ({ ...state, error, isLoading: false }));
				throw err;
			}
		},

		async updateWriting(id: string, req: UpdateTechnicalWritingRequest) {
			update((state) => ({ ...state, isLoading: true, error: null }));
			try {
				const writing = await technicalWritingsClient.updateWriting(id, req);
				update((state) => ({
					...state,
					currentWriting: writing,
					items: state.items.map((item) => (item.id === id ? writing : item)),
					isLoading: false
				}));
				return writing;
			} catch (err) {
				const error = err instanceof Error ? err.message : 'Failed to update writing';
				update((state) => ({ ...state, error, isLoading: false }));
				throw err;
			}
		},

		async deleteWriting(id: string) {
			update((state) => ({ ...state, isLoading: true, error: null }));
			try {
				await technicalWritingsClient.deleteWriting(id);
				update((state) => ({
					...state,
					items: state.items.filter((item) => item.id !== id),
					currentWriting: state.currentWriting?.id === id ? null : state.currentWriting,
					isLoading: false
				}));
			} catch (err) {
				const error = err instanceof Error ? err.message : 'Failed to delete writing';
				update((state) => ({ ...state, error, isLoading: false }));
				throw err;
			}
		},

		async search(query: string) {
			update((state) => ({ ...state, isLoading: true, error: null }));
			try {
				const items = await technicalWritingsClient.searchWritings(query);
				update((state) => ({ ...state, items, isLoading: false }));
			} catch (err) {
				const error = err instanceof Error ? err.message : 'Failed to search writings';
				update((state) => ({ ...state, error, isLoading: false }));
			}
		},

		clear() {
			set(initialState);
		}
	};
}

export const technicalWritings = createTechnicalWritingsStore();
