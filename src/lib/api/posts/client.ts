import { BaseApiClient } from '../base-client';
import { config } from '$lib/config';
import type { Post, CreatePostRequest, UpdatePostRequest } from '../types';

/**
 * Posts API Client
 */
class PostsApiClient extends BaseApiClient {
	constructor() {
		super(`${config.postsApiUrl}/posts`);
	}

	async createPost(data: CreatePostRequest): Promise<Post> {
		return this.create<Post>(data);
	}

	async listPosts(page = 1, limit = 10, status?: 'draft' | 'published' | 'archived') {
		const params = new URLSearchParams({ page: String(page), limit: String(limit) });
		if (status) {
			params.append('status', status);
		}
		const response = await this.client.get<any>(`/?${params.toString()}`);
		return response.data;
	}

	async listDrafts(page = 1, limit = 10) {
		return this.listPosts(page, limit, 'draft');
	}

	async listPublished(page = 1, limit = 10) {
		return this.listPosts(page, limit, 'published');
	}

	async getPostBySlug(slug: string): Promise<Post> {
		const response = await this.client.get<any>(`/slug/${slug}`);
		return response.data.data;
	}

	async getPost(id: string): Promise<Post> {
		return this.getById<Post>(id);
	}

	async updatePost(id: string, data: UpdatePostRequest): Promise<Post> {
		return this.update<Post>(id, data);
	}

	async deletePost(id: string): Promise<void> {
		return this.delete(id);
	}
}

export const postsClient = new PostsApiClient();
export { PostsApiClient };
