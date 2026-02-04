import axios, { type AxiosInstance } from 'axios';
import { tokenCookies } from '$lib/api/auth/cookies';
import type { ApiResponse, PaginatedApiResponse } from '$lib/api/utils';

/**
 * CSRF token storage - stored in memory from response headers
 * This is more reliable than cookies in HTTP development environments
 */
let csrfToken: string | null = null;

function getCSRFToken(): string | null {
	return csrfToken;
}

function setCSRFToken(token: string): void {
	csrfToken = token;
}

function clearCSRFToken(): void {
	csrfToken = null;
}

/**
 * Base API Client
 * Provides standard CRUD operations for all domains
 */
export abstract class BaseApiClient {
	protected client: AxiosInstance;

	constructor(baseURL: string) {
		this.client = axios.create({
			baseURL,
			timeout: 30000,
			withCredentials: true
		});

		// Add request interceptor to include token and CSRF token
		this.client.interceptors.request.use((config) => {
			// Add access token
			const token = tokenCookies.getAccessToken();
			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}

			// Add CSRF token for state-changing requests (POST, PUT, PATCH, DELETE)
			const method = config.method?.toUpperCase();
			if (method && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
				const csrfToken = getCSRFToken();
				if (csrfToken) {
					console.log('Adding CSRF token to', method, 'request:', csrfToken);
					config.headers['X-CSRF-Token'] = csrfToken;
				} else {
					console.warn('CSRF token not found for', method, 'request to', config.url);
				}
			}

			// Set Content-Type for JSON requests
			if (!config.headers['Content-Type']) {
				config.headers['Content-Type'] = 'application/json';
			}

			return config;
		});

		// Response interceptor to extract CSRF token from response headers
		this.client.interceptors.response.use(
			(response) => {
				// Extract CSRF token from response header
				const token = response.headers['x-csrf-token'];
				if (token) {
					console.log('CSRF token extracted from response header:', token);
					setCSRFToken(token);
				} else {
					console.warn('No X-CSRF-Token header found in response from', response.config.url);
				}
				return response;
			},
			(error) => {
				// On 403 CSRF errors, clear the token so it can be refreshed
				if (error.response?.status === 403) {
					const errorMsg = error.response?.data?.error;
					if (errorMsg && (errorMsg.includes('CSRF') || errorMsg.includes('csrf'))) {
						clearCSRFToken();
					}
				}
				return Promise.reject(error);
			}
		);
	}

	async create<T>(data: any): Promise<T> {
		const response = await this.client.post<ApiResponse<T>>('/', data);
		return response.data.data!;
	}

	async list<T>(page = 1, limit = 10): Promise<PaginatedApiResponse<T>> {
		const response = await this.client.get<PaginatedApiResponse<T>>('/', {
			params: { page, limit }
		});
		return response.data;
	}

	async getById<T>(id: string): Promise<T> {
		const response = await this.client.get<ApiResponse<T>>(`/${id}`);
		return response.data.data!;
	}

	async update<T>(id: string, data: any): Promise<T> {
		const response = await this.client.patch<ApiResponse<T>>(`/${id}`, data);
		return response.data.data!;
	}

	async delete(id: string): Promise<void> {
		await this.client.delete(`/${id}`);
	}
}
