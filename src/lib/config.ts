import { env } from '$env/dynamic/public';

// Runtime API configuration with env fallbacks
const getPostsApiUrl = (): string => {
	const baseUrl = env.PUBLIC_POSTS_API_URL || 'http://localhost:3013';
	const cleanUrl = baseUrl.replace(/\/$/, '');
	return `${cleanUrl}/api/v1`;
};

const getAuthApiUrl = (): string => {
	const baseUrl = env.PUBLIC_AUTH_API_URL || 'http://localhost:3010';
	const cleanUrl = baseUrl.replace(/\/$/, '');
	return `${cleanUrl}/api/v1`;
};

const getAiServiceUrl = (): string => {
	const baseUrl = env.PUBLIC_AI_SERVICE_URL || 'http://localhost:8000';
	const cleanUrl = baseUrl.replace(/\/$/, '');
	return cleanUrl;
};

export const config = {
	get postsApiUrl() {
		return getPostsApiUrl();
	},
	get authApiUrl() {
		return getAuthApiUrl();
	},
	get aiServiceUrl() {
		return getAiServiceUrl();
	}
};
