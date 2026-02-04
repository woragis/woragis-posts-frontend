import { writable, derived } from 'svelte/store';
import { problemSolutionsClient } from '../api/problem-solutions';
import type { ProblemSolution } from '../api/types';

export interface ProblemSolutionsState {
	items: ProblemSolution[];
	featuredItems: ProblemSolution[];
	currentProblemSolution: ProblemSolution | null;
	matrixData: any | null;
	isLoading: boolean;
	isLoadingCurrent: boolean;
	isLoadingFeatured: boolean;
	error: string | null;
	currentPage: number;
	totalPages: number;
}

const initialState: ProblemSolutionsState = {
	items: [],
	featuredItems: [],
	currentProblemSolution: null,
	matrixData: null,
	isLoading: false,
	isLoadingCurrent: false,
	isLoadingFeatured: false,
	error: null,
	currentPage: 1,
	totalPages: 1
};

export const problemSolutions = writable<ProblemSolutionsState>(initialState);

/**
 * Load all problem solutions with pagination
 */
export async function loadProblemSolutions(page = 1, limit = 10) {
	problemSolutions.update((state) => ({ ...state, isLoading: true, error: null }));

	try {
		const response = await problemSolutionsClient.listProblemSolutions(page, limit);
		problemSolutions.update((state) => ({
			...state,
			items: response.data || [],
			currentPage: page,
			totalPages: Math.ceil((response.meta?.total || 0) / limit),
			isLoading: false
		}));
	} catch (err: any) {
		const errorMsg = err.message || 'Failed to load problem solutions';
		problemSolutions.update((state) => ({
			...state,
			isLoading: false,
			error: errorMsg
		}));
	}
}

/**
 * Load featured problem solutions (public)
 */
export async function loadFeaturedProblemSolutions(page = 1, limit = 10) {
	problemSolutions.update((state) => ({ ...state, isLoadingFeatured: true, error: null }));

	try {
		const response = await problemSolutionsClient.listFeaturedProblemSolutions(page, limit);
		problemSolutions.update((state) => ({
			...state,
			featuredItems: response.data || [],
			isLoadingFeatured: false
		}));
	} catch (err: any) {
		const errorMsg = err.message || 'Failed to load featured problem solutions';
		problemSolutions.update((state) => ({
			...state,
			isLoadingFeatured: false,
			error: errorMsg
		}));
	}
}

/**
 * Load problem-solution matrix (public visualization)
 */
export async function loadProblemSolutionMatrix() {
	problemSolutions.update((state) => ({ ...state, isLoading: true, error: null }));

	try {
		const data = await problemSolutionsClient.getProblemSolutionMatrix();
		problemSolutions.update((state) => ({
			...state,
			matrixData: data,
			isLoading: false
		}));
	} catch (err: any) {
		const errorMsg = err.message || 'Failed to load problem-solution matrix';
		problemSolutions.update((state) => ({
			...state,
			isLoading: false,
			error: errorMsg
		}));
	}
}

/**
 * Load a single problem solution
 */
export async function loadProblemSolution(id: string) {
	problemSolutions.update((state) => ({ ...state, isLoadingCurrent: true, error: null }));

	try {
		const problemSolution = await problemSolutionsClient.getProblemSolution(id);
		problemSolutions.update((state) => ({
			...state,
			currentProblemSolution: problemSolution,
			isLoadingCurrent: false
		}));
	} catch (err: any) {
		const errorMsg = err.message || 'Failed to load problem solution';
		problemSolutions.update((state) => ({
			...state,
			isLoadingCurrent: false,
			error: errorMsg
		}));
	}
}

/**
 * Load problem solution by ID (public)
 */
export async function loadProblemSolutionPublic(id: string) {
	problemSolutions.update((state) => ({ ...state, isLoadingCurrent: true, error: null }));

	try {
		const problemSolution = await problemSolutionsClient.getProblemSolutionPublic(id);
		problemSolutions.update((state) => ({
			...state,
			currentProblemSolution: problemSolution,
			isLoadingCurrent: false
		}));
	} catch (err: any) {
		const errorMsg = err.message || 'Failed to load problem solution';
		problemSolutions.update((state) => ({
			...state,
			isLoadingCurrent: false,
			error: errorMsg
		}));
	}
}

/**
 * Create a new problem solution
 */
export async function createProblemSolution(data: any): Promise<ProblemSolution | null> {
	try {
		const newProblemSolution = await problemSolutionsClient.createProblemSolution(data);
		problemSolutions.update((state) => ({
			...state,
			currentProblemSolution: newProblemSolution,
			items: [newProblemSolution, ...state.items]
		}));
		return newProblemSolution;
	} catch (err: any) {
		const errorMsg = err.message || 'Failed to create problem solution';
		problemSolutions.update((state) => ({
			...state,
			error: errorMsg
		}));
		return null;
	}
}

/**
 * Update a problem solution
 */
export async function updateProblemSolution(id: string, data: any): Promise<ProblemSolution | null> {
	try {
		const updated = await problemSolutionsClient.updateProblemSolution(id, data);
		problemSolutions.update((state) => ({
			...state,
			currentProblemSolution: updated,
			items: state.items.map((item) => (item.id === id ? updated : item)),
			featuredItems: state.featuredItems.map((item) => (item.id === id ? updated : item))
		}));
		return updated;
	} catch (err: any) {
		const errorMsg = err.message || 'Failed to update problem solution';
		problemSolutions.update((state) => ({
			...state,
			error: errorMsg
		}));
		return null;
	}
}

/**
 * Delete a problem solution
 */
export async function deleteProblemSolution(id: string): Promise<boolean> {
	try {
		await problemSolutionsClient.deleteProblemSolution(id);
		problemSolutions.update((state) => ({
			...state,
			items: state.items.filter((item) => item.id !== id),
			featuredItems: state.featuredItems.filter((item) => item.id !== id),
			currentProblemSolution: state.currentProblemSolution?.id === id ? null : state.currentProblemSolution
		}));
		return true;
	} catch (err: any) {
		const errorMsg = err.message || 'Failed to delete problem solution';
		problemSolutions.update((state) => ({
			...state,
			error: errorMsg
		}));
		return false;
	}
}

/**
 * Clear current problem solution
 */
export function clearCurrentProblemSolution() {
	problemSolutions.update((state) => ({
		...state,
		currentProblemSolution: null
	}));
}

/**
 * Clear error
 */
export function clearError() {
	problemSolutions.update((state) => ({
		...state,
		error: null
	}));
}
