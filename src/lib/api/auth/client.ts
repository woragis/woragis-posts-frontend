import axios, { type AxiosInstance } from 'axios';
import { config } from '$lib/config';
import { tokenCookies } from './cookies';
import type {
	User,
	AuthResponse,
	LoginRequest,
	RegisterRequest,
	ChangePasswordRequest,
	ProfileUpdateRequest,
	ApiResponse
} from './types';

function normalizeAuthResponse(raw: any): AuthResponse {
	// Support snake_case responses from backend
	const accessToken = raw?.accessToken || raw?.access_token;
	const refreshToken = raw?.refreshToken || raw?.refresh_token;
	const expiresAt = raw?.expires_at;
	const expiresIn = raw?.expiresIn || raw?.expires_in;

	// Compute TTL in seconds if expires_at (epoch seconds) is provided
	let ttlSeconds: number | undefined;
	if (expiresIn && typeof expiresIn === 'number') {
		ttlSeconds = expiresIn;
	} else if (expiresAt && typeof expiresAt === 'number') {
		const now = Math.floor(Date.now() / 1000);
		ttlSeconds = Math.max(60, expiresAt - now);
	}

	return {
		accessToken,
		refreshToken,
		expiresIn: ttlSeconds,
		user: raw?.user
	};
}

/**
 * Auth API Client
 * Handles authentication and user management
 */
class AuthApiClient {
	private client: AxiosInstance;
	private isRefreshing = false;
	private refreshSubscribers: Array<(token: string) => void> = [];

	constructor() {
		this.client = axios.create({
			baseURL: `${config.authApiUrl}/auth`,
			headers: {
				'Content-Type': 'application/json'
			},
			withCredentials: true
		});

		// Add request interceptor to include token
		this.client.interceptors.request.use(
			(requestConfig) => {
				const token = tokenCookies.getAccessToken();
				if (token) {
					requestConfig.headers.Authorization = `Bearer ${token}`;
				}
				return requestConfig;
			},
			(error) => Promise.reject(error)
		);

		// Add response interceptor to handle 401 and refresh token
		this.client.interceptors.response.use(
			(response) => response,
			async (error) => {
				const original = error.config;

				if (error.response?.status === 401 && !original._retry) {
					original._retry = true;

					if (!this.isRefreshing) {
						this.isRefreshing = true;

						try {
							await this.refreshAccessToken();
							this.isRefreshing = false;

							// Retry original request
							const token = tokenCookies.getAccessToken();
							if (token) {
								original.headers.Authorization = `Bearer ${token}`;
							}
							return this.client(original);
						} catch (err) {
							this.isRefreshing = false;
							tokenCookies.clearTokens();
							throw err;
						}
					}
				}

				return Promise.reject(error);
			}
		);
	}

	async login(data: LoginRequest): Promise<AuthResponse> {
		const response = await this.client.post<ApiResponse<AuthResponse>>('/login', data);
		const authData = normalizeAuthResponse(response.data.data);

		// Store tokens
		if (authData.accessToken) {
			tokenCookies.setAccessToken(authData.accessToken, authData.expiresIn);
		}
		if (authData.refreshToken) {
			tokenCookies.setRefreshToken(authData.refreshToken);
		}

		return authData;
	}

	async register(data: RegisterRequest): Promise<AuthResponse> {
		const response = await this.client.post<ApiResponse<AuthResponse>>('/register', data);
		const authData = normalizeAuthResponse(response.data.data);

		// Store tokens
		if (authData.accessToken) {
			tokenCookies.setAccessToken(authData.accessToken, authData.expiresIn);
		}
		if (authData.refreshToken) {
			tokenCookies.setRefreshToken(authData.refreshToken);
		}

		return authData;
	}

	async getCurrentUser(): Promise<User> {
		const response = await this.client.get<ApiResponse<User>>('/me');
		return response.data.data!;
	}

	async getProfile(): Promise<User> {
		return this.getCurrentUser();
	}

	async updateProfile(data: ProfileUpdateRequest): Promise<User> {
		const response = await this.client.patch<ApiResponse<User>>('/profile', data);
		return response.data.data!;
	}

	async changePassword(data: ChangePasswordRequest): Promise<void> {
		await this.client.post('/change-password', data);
	}

	async refreshAccessToken(): Promise<string> {
		const refreshToken = tokenCookies.getRefreshToken();
		if (!refreshToken) {
			throw new Error('No refresh token available');
		}

		const response = await this.client.post<ApiResponse<AuthResponse>>('/refresh', {
			refreshToken
		});

		const authData = normalizeAuthResponse(response.data.data);
		if (authData.accessToken) {
			tokenCookies.setAccessToken(authData.accessToken, authData.expiresIn);
		}
		if (authData.refreshToken) {
			tokenCookies.setRefreshToken(authData.refreshToken);
		}

		if (!authData.accessToken) {
			throw new Error('Refresh did not return access token');
		}

		return authData.accessToken;
	}

	async logout(): Promise<void> {
		try {
			const refreshToken = tokenCookies.getRefreshToken();
			if (refreshToken) {
				await this.client.post('/logout', { refreshToken });
			}
		} finally {
			tokenCookies.clearTokens();
		}
	}

	getRefreshToken(): string | null {
		return tokenCookies.getRefreshToken();
	}

	isAuthenticated(): boolean {
		return !!tokenCookies.getAccessToken();
	}
}

// Singleton instance
export const authClient = new AuthApiClient();

export { AuthApiClient };
