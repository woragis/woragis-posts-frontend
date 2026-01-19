import { browser } from '$app/environment';

/**
 * Token Cookie Manager
 * Aligns with jobs/management: browser-guarded, Lax cookies, Secure only on https.
 */

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

function setCookie(name: string, value: string, maxAgeSeconds: number, secure: boolean) {
	if (!browser) return;
	const expires = new Date();
	expires.setSeconds(expires.getSeconds() + maxAgeSeconds);
	const secureFlag = secure ? '; Secure' : '';
	document.cookie = `${name}=${encodeURIComponent(value)}; path=/; expires=${expires.toUTCString()}; SameSite=Lax${secureFlag}`;
}

function getCookie(name: string): string | null {
	if (!browser) return null;
	const match = document.cookie.match(new RegExp(`${name}=([^;]*)`));
	return match ? decodeURIComponent(match[1]) : null;
}

function clearCookie(name: string) {
	if (!browser) return;
	document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax`;
}

const tokenCookies = {
	getAccessToken(): string | null {
		return getCookie(ACCESS_TOKEN_KEY);
	},

	setAccessToken(token: string, expiresInSeconds = 3600): void {
		const secure = browser && typeof location !== 'undefined' && location.protocol === 'https:';
		setCookie(ACCESS_TOKEN_KEY, token, expiresInSeconds, secure);
	},

	getRefreshToken(): string | null {
		return getCookie(REFRESH_TOKEN_KEY);
	},

	setRefreshToken(token: string, expiresInSeconds = 604800): void {
		const secure = browser && typeof location !== 'undefined' && location.protocol === 'https:';
		setCookie(REFRESH_TOKEN_KEY, token, expiresInSeconds, secure);
	},

	clearTokens(): void {
		clearCookie(ACCESS_TOKEN_KEY);
		clearCookie(REFRESH_TOKEN_KEY);
	},

	isAuthenticated(): boolean {
		return !!this.getAccessToken();
	}
};

export { tokenCookies };
