// ===== Types =====
export interface GenerateAssetResponse {
	assetId: string;
	jobId: string;
	status: 'pending' | 'processing' | 'completed' | 'failed';
}

export interface CreativeAsset {
	id: string;
	assetType: 'thumbnail' | 'featured-image' | 'og-image';
	domainType: string;
	contentId: string;
	jobStatus: 'pending' | 'processing' | 'completed' | 'failed';
	jobProgress: number;
	imageUrl?: string;
	mimeType?: string;
	storagePath?: string;
	errorMessage?: string;
	createdAt: string;
	updatedAt: string;
}

export interface GetAssetsResponse {
	data: CreativeAsset[];
}

export interface WebSocketMessage {
	type: 'init' | 'update' | 'error';
	assetId?: string;
	status?: string;
	progress?: number;
	error?: string;
	data?: any;
}

export interface WebSocketProgressUpdate {
	type: 'progress' | 'completed' | 'failed';
	status: string;
	progress: number;
	imageUrl?: string;
	mimeType?: string;
	error?: string;
}

// ===== API Client =====

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8080';

/**
 * Generate a thumbnail for any content type
 * Returns immediately with job ID and status
 */
export async function generateThumbnail(
	contentId: string,
	prompt: string,
	domainType: string = 'post'
): Promise<GenerateAssetResponse> {
	const endpoint =
		domainType === 'post' ? 'posts' : domainType === 'case-study' ? 'case-studies' : domainType;
	const res = await fetch(`${API_URL}/${endpoint}/${contentId}/assets/generate/thumbnail`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ prompt })
	});
	if (!res.ok) {
		const error = await res.text();
		throw new Error(`Generate thumbnail failed: ${error}`);
	}
	return res.json();
}

/**
 * Generate a featured image for any content type
 */
export async function generateFeaturedImage(
	contentId: string,
	prompt: string,
	domainType: string = 'post'
): Promise<GenerateAssetResponse> {
	const endpoint =
		domainType === 'post' ? 'posts' : domainType === 'case-study' ? 'case-studies' : domainType;
	const res = await fetch(`${API_URL}/${endpoint}/${contentId}/assets/generate/featured-image`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ prompt })
	});
	if (!res.ok) {
		const error = await res.text();
		throw new Error(`Generate featured image failed: ${error}`);
	}
	return res.json();
}

/**
 * Generate an OG (Open Graph) image for any content type
 */
export async function generateOGImage(
	contentId: string,
	prompt: string,
	domainType: string = 'post'
): Promise<GenerateAssetResponse> {
	const endpoint =
		domainType === 'post' ? 'posts' : domainType === 'case-study' ? 'case-studies' : domainType;
	const res = await fetch(`${API_URL}/${endpoint}/${contentId}/assets/generate/og-image`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ prompt })
	});
	if (!res.ok) {
		const error = await res.text();
		throw new Error(`Generate OG image failed: ${error}`);
	}
	return res.json();
}

/**
 * Edit an existing generated image
 */
export async function editImage(
	contentId: string,
	assetId: string,
	prompt: string,
	domainType: string = 'post',
	imageUrl?: string,
	imageB64?: string
): Promise<GenerateAssetResponse> {
	const endpoint =
		domainType === 'post' ? 'posts' : domainType === 'case-study' ? 'case-studies' : domainType;
	const body: any = { assetId, prompt };
	if (imageUrl) body.imageUrl = imageUrl;
	if (imageB64) body.imageB64 = imageB64;

	const res = await fetch(`${API_URL}/${endpoint}/${contentId}/assets/edit`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body)
	});
	if (!res.ok) {
		const error = await res.text();
		throw new Error(`Edit image failed: ${error}`);
	}
	return res.json();
}

/**
 * Get all assets for any content type
 */
export async function getAssets(
	contentId: string,
	domainType: string = 'post'
): Promise<CreativeAsset[]> {
	const endpoint =
		domainType === 'post' ? 'posts' : domainType === 'case-study' ? 'case-studies' : domainType;
	const res = await fetch(`${API_URL}/${endpoint}/${contentId}/assets`, {
		headers: { 'Content-Type': 'application/json' }
	});
	if (!res.ok) {
		const error = await res.text();
		throw new Error(`Get assets failed: ${error}`);
	}
	const data = (await res.json()) as GetAssetsResponse;
	return data.data || [];
}

/**
 * Poll for asset status (fallback if WebSocket unavailable)
 */
export async function pollAssetStatus(
	assetId: string,
	contentId: string,
	domainType: string = 'post'
): Promise<CreativeAsset | null> {
	const assets = await getAssets(contentId, domainType);
	return assets.find((a) => a.id === assetId) || null;
}

/**
 * Subscribe to real-time updates via WebSocket
 */
export function subscribeToAssetUpdates(
	assetId: string,
	onUpdate: (update: WebSocketProgressUpdate) => void,
	onError?: (error: string) => void
): () => void {
	let ws: WebSocket | null = null;
	let reconnectAttempts = 0;
	const maxReconnectAttempts = 5;
	let reconnectTimeout: NodeJS.Timeout | null = null;

	const connect = () => {
		try {
			ws = new WebSocket(`${WS_URL}/posts/assets/ws/${assetId}`);

			ws.onopen = () => {
				console.log(`[WebSocket] Connected to asset updates: ${assetId}`);
				reconnectAttempts = 0;
			};

			ws.onmessage = (event) => {
				try {
					const message = JSON.parse(event.data) as WebSocketMessage;

					if (message.type === 'init') {
						// Initial connection message
						onUpdate({
							type: 'progress',
							status: message.status || 'pending',
							progress: message.progress || 0
						});
					} else if (message.type === 'update' && message.data) {
						// Progress update
						onUpdate(message.data as WebSocketProgressUpdate);
					} else if (message.type === 'error') {
						const error = message.error || 'Unknown error';
						onError?.(error);
					}
				} catch (err) {
					console.error('[WebSocket] Parse error:', err);
				}
			};

			ws.onerror = (error) => {
				console.error('[WebSocket] Error:', error);
				onError?.('WebSocket connection error');
			};

			ws.onclose = () => {
				console.log('[WebSocket] Disconnected');
				if (reconnectAttempts < maxReconnectAttempts) {
					reconnectAttempts++;
					const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
					console.log(`[WebSocket] Reconnecting in ${delay}ms... (attempt ${reconnectAttempts})`);
					reconnectTimeout = setTimeout(() => connect(), delay);
				} else {
					console.log('[WebSocket] Max reconnect attempts reached, switching to polling');
					onError?.('WebSocket connection failed, using polling');
				}
			};
		} catch (err) {
			console.error('[WebSocket] Connection error:', err);
			onError?.('Failed to establish WebSocket connection');
		}
	};

	// Connect immediately
	connect();

	// Return cleanup function
	return () => {
		if (reconnectTimeout) {
			clearTimeout(reconnectTimeout);
		}
		if (ws) {
			ws.close();
			ws = null;
		}
	};
}

/**
 * Send a ping to keep WebSocket connection alive
 */
export function pingWebSocket(ws: WebSocket | null): void {
	if (ws && ws.readyState === WebSocket.OPEN) {
		ws.send(JSON.stringify({ type: 'ping' }));
	}
}
