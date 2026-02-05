import { writable } from 'svelte/store';
import { impactMetricsClient } from '$lib/api/impact-metrics/client';
import type {
	ImpactMetric,
	CreateImpactMetricRequest,
	UpdateImpactMetricRequest
} from '$lib/api/types';

interface ImpactMetricsState {
	items: ImpactMetric[];
	featuredItems: ImpactMetric[];
	currentMetric: ImpactMetric | null;
	isLoading: boolean;
	isLoadingFeatured: boolean;
	error: string | null;
}

const initialState: ImpactMetricsState = {
	items: [],
	featuredItems: [],
	currentMetric: null,
	isLoading: false,
	isLoadingFeatured: false,
	error: null
};

function createImpactMetricsStore() {
	const { subscribe, set, update } = writable<ImpactMetricsState>(initialState);

	return {
		subscribe,

		async loadMetrics() {
			update((state) => ({ ...state, isLoading: true, error: null }));
			try {
				const response = await impactMetricsClient.listMetrics();
				const data = Array.isArray(response) ? response : response?.data || [];
				update((state) => ({
					...state,
					items: data,
					isLoading: false
				}));
			} catch (err) {
				const message = err instanceof Error ? err.message : 'Failed to load metrics';
				update((state) => ({
					...state,
					items: [],
					isLoading: false,
					error: message
				}));
				throw err;
			}
		},

		async loadFeatured() {
			update((state) => ({ ...state, isLoadingFeatured: true, error: null }));
			try {
				const response = await impactMetricsClient.getFeatured();
				const data = Array.isArray(response) ? response : response?.data || [];
				update((state) => ({
					...state,
					featuredItems: data,
					isLoadingFeatured: false
				}));
			} catch (err) {
				const message = err instanceof Error ? err.message : 'Failed to load featured metrics';
				update((state) => ({
					...state,
					featuredItems: [],
					isLoadingFeatured: false,
					error: message
				}));
				throw err;
			}
		},

		async loadOne(id: string) {
			update((state) => ({ ...state, isLoading: true, error: null }));
			try {
				const metric = await impactMetricsClient.getMetric(id);
				update((state) => ({
					...state,
					currentMetric: metric,
					isLoading: false
				}));
				return metric;
			} catch (err) {
				const message = err instanceof Error ? err.message : 'Failed to load metric';
				update((state) => ({
					...state,
					currentMetric: null,
					isLoading: false,
					error: message
				}));
				throw err;
			}
		},

		async createMetric(data: CreateImpactMetricRequest) {
			update((state) => ({ ...state, isLoading: true, error: null }));
			try {
				const response = await impactMetricsClient.createMetric(data);
				const metric = (response as any)?.data || response;
				update((state) => ({
					...state,
					items: [...state.items, metric as ImpactMetric],
					isLoading: false
				}));
				return metric;
			} catch (err) {
				const message = err instanceof Error ? err.message : 'Failed to create metric';
				update((state) => ({
					...state,
					isLoading: false,
					error: message
				}));
				throw err;
			}
		},

		async updateMetric(id: string, data: UpdateImpactMetricRequest) {
			update((state) => ({ ...state, isLoading: true, error: null }));
			try {
				const response = await impactMetricsClient.updateMetric(id, data);
				const metric = (response as any)?.data || response;
				update((state) => ({
					...state,
					items: state.items.map((item) => (item.id === id ? (metric as ImpactMetric) : item)),
					currentMetric:
						state.currentMetric?.id === id ? (metric as ImpactMetric) : state.currentMetric,
					isLoading: false
				}));
				return metric;
			} catch (err) {
				const message = err instanceof Error ? err.message : 'Failed to update metric';
				update((state) => ({
					...state,
					isLoading: false,
					error: message
				}));
				throw err;
			}
		},

		async deleteMetric(id: string) {
			update((state) => ({ ...state, isLoading: true, error: null }));
			try {
				await impactMetricsClient.deleteMetric(id);
				update((state) => ({
					...state,
					items: state.items.filter((item) => item.id !== id),
					currentMetric: state.currentMetric?.id === id ? null : state.currentMetric,
					isLoading: false
				}));
			} catch (err) {
				const message = err instanceof Error ? err.message : 'Failed to delete metric';
				update((state) => ({
					...state,
					isLoading: false,
					error: message
				}));
				throw err;
			}
		},

		clear() {
			set(initialState);
		}
	};
}

export const impactMetrics = createImpactMetricsStore();
