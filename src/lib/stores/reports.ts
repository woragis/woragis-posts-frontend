import { writable } from 'svelte/store';
import { reportsClient } from '$lib/api/reports/client';
import type { Report, CreateReportRequest, UpdateReportRequest } from '$lib/api/types';

interface ReportsState {
	items: Report[];
	currentReport: Report | null;
	isLoading: boolean;
	error: string | null;
}

const initialState: ReportsState = {
	items: [],
	currentReport: null,
	isLoading: false,
	error: null
};

function createReportsStore() {
	const { subscribe, set, update } = writable<ReportsState>(initialState);

	return {
		subscribe,

		async loadReports() {
			update((state) => ({ ...state, isLoading: true, error: null }));
			try {
				const response = await reportsClient.listReports();
				const data = Array.isArray(response) ? response : response?.data || [];
				update((state) => ({
					...state,
					items: data,
					isLoading: false
				}));
			} catch (err) {
				const message = err instanceof Error ? err.message : 'Failed to load reports';
				update((state) => ({
					...state,
					items: [],
					isLoading: false,
					error: message
				}));
				throw err;
			}
		},

		async loadOne(id: string) {
			update((state) => ({ ...state, isLoading: true, error: null }));
			try {
				const report = await reportsClient.getReport(id);
				update((state) => ({
					...state,
					currentReport: report,
					isLoading: false
				}));
				return report;
			} catch (err) {
				const message = err instanceof Error ? err.message : 'Failed to load report';
				update((state) => ({
					...state,
					currentReport: null,
					isLoading: false,
					error: message
				}));
				throw err;
			}
		},

		async createReport(data: CreateReportRequest) {
			update((state) => ({ ...state, isLoading: true, error: null }));
			try {
				const response = await reportsClient.createReport(data);
				const report = (response as any)?.data || response;
				update((state) => ({
					...state,
					items: [...state.items, report as Report],
					isLoading: false
				}));
				return report;
			} catch (err) {
				const message = err instanceof Error ? err.message : 'Failed to create report';
				update((state) => ({
					...state,
					isLoading: false,
					error: message
				}));
				throw err;
			}
		},

		async updateReport(id: string, data: UpdateReportRequest) {
			update((state) => ({ ...state, isLoading: true, error: null }));
			try {
				const response = await reportsClient.updateReport(id, data);
				const report = (response as any)?.data || response;
				update((state) => ({
					...state,
					items: state.items.map((item) => (item.id === id ? (report as Report) : item)),
					currentReport: state.currentReport?.id === id ? (report as Report) : state.currentReport,
					isLoading: false
				}));
				return report;
			} catch (err) {
				const message = err instanceof Error ? err.message : 'Failed to update report';
				update((state) => ({
					...state,
					isLoading: false,
					error: message
				}));
				throw err;
			}
		},

		async deleteReport(id: string) {
			update((state) => ({ ...state, isLoading: true, error: null }));
			try {
				await reportsClient.deleteReport(id);
				update((state) => ({
					...state,
					items: state.items.filter((item) => item.id !== id),
					currentReport: state.currentReport?.id === id ? null : state.currentReport,
					isLoading: false
				}));
			} catch (err) {
				const message = err instanceof Error ? err.message : 'Failed to delete report';
				update((state) => ({
					...state,
					isLoading: false,
					error: message
				}));
				throw err;
			}
		},

		async toggleFavorite(id: string, favorite: boolean) {
			update((state) => ({ ...state, isLoading: true }));
			try {
				await reportsClient.toggleFavorite(id, favorite);
				update((state) => ({
					...state,
					items: state.items.map((item) =>
						item.id === id ? { ...item, isFavorite: favorite } : item
					),
					currentReport:
						state.currentReport?.id === id
							? { ...state.currentReport, isFavorite: favorite }
							: state.currentReport,
					isLoading: false
				}));
			} catch (err) {
				const message = err instanceof Error ? err.message : 'Failed to toggle favorite';
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

export const reports = createReportsStore();
