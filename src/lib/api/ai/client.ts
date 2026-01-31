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
	agent: Agent;
	input: string;
	system?: string;
	temperature?: number;
	model?: string;
	provider?: Provider;
}

export interface ChatResponse {
	agent: string;
	output: string;
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
	 * Single chat request (non-streaming)
	 */
	async chat(
		agent: Agent,
		input: string,
		options?: {
			system?: string;
			temperature?: number;
			model?: string;
			provider?: Provider;
		}
	): Promise<ChatResponse> {
		const payload: ChatRequest = {
			agent,
			input,
			system: options?.system,
			temperature: options?.temperature,
			model: options?.model,
			provider: options?.provider || 'openai'
		};

		const response = await fetch(`${this.baseUrl}/v1/chat`, {
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
	 * Streaming chat request - returns async generator of chunks
	 * Each chunk is NDJSON format: { "delta": "text" } or { "done": true, "output": "full text" }
	 */
	async *chatStream(
		agent: Agent,
		input: string,
		options?: {
			system?: string;
			temperature?: number;
			model?: string;
			provider?: Provider;
		}
	): AsyncGenerator<StreamChunk, void, unknown> {
		const payload: ChatRequest = {
			agent,
			input,
			system: options?.system,
			temperature: options?.temperature,
			model: options?.model,
			provider: options?.provider || 'openai'
		};

		const response = await fetch(`${this.baseUrl}/v1/chat/stream`, {
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
	 * Get list of available agents
	 */
	async listAgents(): Promise<string[]> {
		const response = await fetch(`${this.baseUrl}/v1/agents`);
		if (!response.ok) {
			throw new Error(`Failed to fetch agents: ${response.status}`);
		}
		return response.json();
	}
}

export const aiClient = new AIServiceClient();
export { AIServiceClient };
