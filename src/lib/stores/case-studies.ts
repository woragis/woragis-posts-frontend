import { writable, derived } from 'svelte/store';
import { caseStudiesClient } from '../api/case-studies';
import type { CaseStudy } from '../api/types';

export interface CaseStudiesState {
	items: CaseStudy[];
	currentCaseStudy: CaseStudy | null;
	isLoading: boolean;
	isLoadingCurrent: boolean;
	error: string | null;
	currentPage: number;
	totalPages: number;
	searchQuery: string;
}

const initialState: CaseStudiesState = {
	items: [],
	currentCaseStudy: null,
	isLoading: false,
	isLoadingCurrent: false,
	error: null,
	currentPage: 1,
	totalPages: 1,
	searchQuery: ''
};

export const caseStudies = writable<CaseStudiesState>(initialState);

/**
 * Load all case studies with pagination
 */
export async function loadCaseStudies(page = 1, limit = 10) {
	caseStudies.update((state) => ({ ...state, isLoading: true, error: null }));

	try {
		const response = await caseStudiesClient.listCaseStudies(page, limit);
		caseStudies.update((state) => ({
			...state,
			items: response.data || [],
			currentPage: page,
			totalPages: Math.ceil((response.meta?.total || 0) / limit),
			isLoading: false
		}));
	} catch (err: any) {
		const errorMsg = err.message || 'Failed to load case studies';
		caseStudies.update((state) => ({
			...state,
			isLoading: false,
			error: errorMsg
		}));
	}
}

/**
 * Search case studies
 */
export async function searchCaseStudies(query: string, page = 1, limit = 10) {
	if (!query.trim()) {
		await loadCaseStudies(page, limit);
		return;
	}

	caseStudies.update((state) => ({
		...state,
		isLoading: true,
		error: null,
		searchQuery: query
	}));

	try {
		const response = await caseStudiesClient.searchCaseStudies(query, page, limit);
		caseStudies.update((state) => ({
			...state,
			items: response.data || [],
			currentPage: page,
			totalPages: Math.ceil((response.meta?.total || 0) / limit),
			isLoading: false
		}));
	} catch (err: any) {
		const errorMsg = err.message || 'Failed to search case studies';
		caseStudies.update((state) => ({
			...state,
			isLoading: false,
			error: errorMsg
		}));
	}
}

/**
 * Load a single case study
 */
export async function loadCaseStudy(id: string) {
	caseStudies.update((state) => ({ ...state, isLoadingCurrent: true, error: null }));

	try {
		const caseStudy = await caseStudiesClient.getCaseStudy(id);
		caseStudies.update((state) => ({
			...state,
			currentCaseStudy: caseStudy,
			isLoadingCurrent: false
		}));
	} catch (err: any) {
		const errorMsg = err.message || 'Failed to load case study';
		caseStudies.update((state) => ({
			...state,
			isLoadingCurrent: false,
			error: errorMsg
		}));
	}
}

/**
 * Load case study by slug
 */
export async function loadCaseStudyBySlug(slug: string) {
	caseStudies.update((state) => ({ ...state, isLoadingCurrent: true, error: null }));

	try {
		const caseStudy = await caseStudiesClient.getCaseStudyBySlug(slug);
		caseStudies.update((state) => ({
			...state,
			currentCaseStudy: caseStudy,
			isLoadingCurrent: false
		}));
	} catch (err: any) {
		const errorMsg = err.message || 'Failed to load case study';
		caseStudies.update((state) => ({
			...state,
			isLoadingCurrent: false,
			error: errorMsg
		}));
	}
}

/**
 * Create a new case study
 */
export async function createCaseStudy(data: any): Promise<CaseStudy | null> {
	try {
		const newCaseStudy = await caseStudiesClient.createCaseStudy(data);
		caseStudies.update((state) => ({
			...state,
			currentCaseStudy: newCaseStudy,
			items: [newCaseStudy, ...state.items]
		}));
		return newCaseStudy;
	} catch (err: any) {
		const errorMsg = err.message || 'Failed to create case study';
		caseStudies.update((state) => ({
			...state,
			error: errorMsg
		}));
		return null;
	}
}

/**
 * Update a case study
 */
export async function updateCaseStudy(id: string, data: any): Promise<CaseStudy | null> {
	try {
		const updated = await caseStudiesClient.updateCaseStudy(id, data);
		caseStudies.update((state) => ({
			...state,
			currentCaseStudy: updated,
			items: state.items.map((item) => (item.id === id ? updated : item))
		}));
		return updated;
	} catch (err: any) {
		const errorMsg = err.message || 'Failed to update case study';
		caseStudies.update((state) => ({
			...state,
			error: errorMsg
		}));
		return null;
	}
}

/**
 * Delete a case study
 */
export async function deleteCaseStudy(id: string): Promise<boolean> {
	try {
		await caseStudiesClient.deleteCaseStudy(id);
		caseStudies.update((state) => ({
			...state,
			items: state.items.filter((item) => item.id !== id),
			currentCaseStudy: state.currentCaseStudy?.id === id ? null : state.currentCaseStudy
		}));
		return true;
	} catch (err: any) {
		const errorMsg = err.message || 'Failed to delete case study';
		caseStudies.update((state) => ({
			...state,
			error: errorMsg
		}));
		return false;
	}
}

/**
 * Clear current case study
 */
export function clearCurrentCaseStudy() {
	caseStudies.update((state) => ({
		...state,
		currentCaseStudy: null
	}));
}

/**
 * Clear error
 */
export function clearError() {
	caseStudies.update((state) => ({
		...state,
		error: null
	}));
}
