import { config } from '$lib/config';

export type Agent =
	| 'economist'
	| 'strategist'
	| 'entrepreneur'
	| 'startup'
	| 'cover_letter'
	| 'auto';
export type Provider = 'openai' | 'anthropic' | 'xai' | 'manus' | 'cipher';

export interface ChatRequest {
	user_id: string;
	prompt: string;
	agent: Agent;
	post_id?: string;
}

export interface ChatResponse {
	id: string;
	user_id: string;
	agent: string;
	status: 'pending' | 'completed' | 'error';
	response?: string;
	error?: string;
}

export interface StreamChunk {
	delta?: string;
	done?: boolean;
	output?: string;
	error?: string;
}

/**
 * AI Service Client - handles chat, streaming, and content generation
 */
class AIServiceClient {
	private baseUrl: string;

	constructor() {
		this.baseUrl = config.aiServiceUrl || 'http://localhost:8000';
	}

	/**
	 * Generate draft - single chat request (non-streaming)
	 */
	async generateDraft(
		userId: string,
		prompt: string,
		agent: Agent,
		postId?: string
	): Promise<ChatResponse> {
		const payload: ChatRequest = {
			user_id: userId,
			prompt,
			agent,
			post_id: postId
		};

		const response = await fetch(`${this.baseUrl}/api/v1/chats/generate`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		});

		if (!response.ok) {
			const error = await response.text();
			throw new Error(`AI service error: ${response.status} - ${error}`);
		}

		return response.json();
	}

	/**
	 * Streaming draft generation - returns async generator of chunks
	 * Each chunk is NDJSON format: { "delta": "text" } or { "done": true, "output": "full text" }
	 */
	async *generateDraftStream(
		userId: string,
		prompt: string,
		agent: Agent,
		postId?: string
	): AsyncGenerator<StreamChunk, void, unknown> {
		const payload: ChatRequest = {
			user_id: userId,
			prompt,
			agent,
			post_id: postId
		};

		const response = await fetch(`${this.baseUrl}/api/v1/chats/generate`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		});

		if (!response.ok) {
			const error = await response.text();
			throw new Error(`AI service error: ${response.status} - ${error}`);
		}

		if (!response.body) {
			throw new Error('Response body is empty');
		}

		const reader = response.body.getReader();
		const decoder = new TextDecoder();
		let buffer = '';

		try {
			while (true) {
				const { done, value } = await reader.read();
				if (done) break;

				buffer += decoder.decode(value, { stream: true });
				const lines = buffer.split('\n');

				// Keep the last incomplete line in the buffer
				buffer = lines.pop() || '';

				for (const line of lines) {
					if (line.trim()) {
						try {
							const chunk: StreamChunk = JSON.parse(line);
							yield chunk;
						} catch (err) {
							console.error('Failed to parse stream chunk:', line, err);
						}
					}
				}
			}

			// Process any remaining data in the buffer
			if (buffer.trim()) {
				try {
					const chunk: StreamChunk = JSON.parse(buffer);
					yield chunk;
				} catch (err) {
					console.error('Failed to parse final stream chunk:', buffer, err);
				}
			}
		} finally {
			reader.releaseLock();
		}
	}

	/**
	 * Improve content - streaming improvement request
	 */
	async *improveContent(
		userId: string,
		postId: string,
		improvement: string,
		agent: Agent = 'auto'
	): AsyncGenerator<StreamChunk, void, unknown> {
		const payload: ChatRequest = {
			user_id: userId,
			prompt: improvement,
			agent,
			post_id: postId
		};

		const response = await fetch(`${this.baseUrl}/api/v1/posts/${postId}/ai/improve`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		});

		if (!response.ok) {
			const error = await response.text();
			throw new Error(`AI service error: ${response.status} - ${error}`);
		}

		if (!response.body) {
			throw new Error('Response body is empty');
		}

		const reader = response.body.getReader();
		const decoder = new TextDecoder();
		let buffer = '';

		try {
			while (true) {
				const { done, value } = await reader.read();
				if (done) break;

				buffer += decoder.decode(value, { stream: true });
				const lines = buffer.split('\n');

				// Keep the last incomplete line in the buffer
				buffer = lines.pop() || '';

				for (const line of lines) {
					if (line.trim()) {
						try {
							const chunk: StreamChunk = JSON.parse(line);
							yield chunk;
						} catch (err) {
							console.error('Failed to parse stream chunk:', line, err);
						}
					}
				}
			}

			// Process any remaining data in the buffer
			if (buffer.trim()) {
				try {
					const chunk: StreamChunk = JSON.parse(buffer);
					yield chunk;
				} catch (err) {
					console.error('Failed to parse final stream chunk:', buffer, err);
				}
			}
		} finally {
			reader.releaseLock();
		}
	}
}

export const aiClient = new AIServiceClient();
export { AIServiceClient };
