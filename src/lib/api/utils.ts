import axios, { type AxiosInstance } from 'axios';

/**
 * Types for API responses
 */
export interface ApiResponse<T> {
	success: boolean;
	data?: T;
	error?: string;
	message?: string;
}

export interface PaginationMeta {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
}

export interface PaginatedApiResponse<T> {
	data: T[];
	meta: PaginationMeta;
}

/**
 * Create axios client with default config
 */
export function createApiClient(baseURL: string): AxiosInstance {
	return axios.create({
		baseURL,
		timeout: 30000,
		headers: {
			'Content-Type': 'application/json'
		},
		withCredentials: true
	});
}

/**
 * Extract error message from various response formats
 */
export function getErrorMessage(error: unknown): string {
	if (axios.isAxiosError(error)) {
		return (
			error.response?.data?.message ||
			error.response?.data?.error ||
			error.message ||
			'An error occurred'
		);
	}
	if (error instanceof Error) {
		return error.message;
	}
	return 'An unexpected error occurred';
}
