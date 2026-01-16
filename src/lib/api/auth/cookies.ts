/**
 * Token Cookie Manager
 * Handles storing and retrieving JWT tokens from browser cookies
 */

const tokenCookies = {
	/**
	 * Get access token from cookies
	 */
	getAccessToken(): string | null {
		if (typeof document === 'undefined') return null;
		const match = document.cookie.match(/accessToken=([^;]*)/);
		return match ? decodeURIComponent(match[1]) : null;
	},

	/**
	 * Set access token in cookies
	 */
	setAccessToken(token: string, expiresIn?: number): void {
		if (typeof document === 'undefined') return;
		const expires = new Date();
		expires.setSeconds(expires.getSeconds() + (expiresIn || 3600));
		document.cookie = `accessToken=${encodeURIComponent(token)}; path=/; expires=${expires.toUTCString()}; Secure; SameSite=Strict`;
	},

	/**
	 * Get refresh token from cookies
	 */
	getRefreshToken(): string | null {
		if (typeof document === 'undefined') return null;
		const match = document.cookie.match(/refreshToken=([^;]*)/);
		return match ? decodeURIComponent(match[1]) : null;
	},

	/**
	 * Set refresh token in cookies
	 */
	setRefreshToken(token: string, expiresIn?: number): void {
		if (typeof document === 'undefined') return;
		const expires = new Date();
		expires.setSeconds(expires.getSeconds() + (expiresIn || 604800)); // 7 days
		document.cookie = `refreshToken=${encodeURIComponent(token)}; path=/; expires=${expires.toUTCString()}; Secure; SameSite=Strict`;
	},

	/**
	 * Clear all tokens from cookies
	 */
	clearTokens(): void {
		if (typeof document === 'undefined') return;
		document.cookie =
			'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure; SameSite=Strict';
		document.cookie =
			'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure; SameSite=Strict';
	}
};

export { tokenCookies };
