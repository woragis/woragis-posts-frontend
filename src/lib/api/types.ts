/**
 * Posts Service API Types
 * Covers all domains: posts, problem-solutions, case-studies, technical-writings, system-designs, reports, impact-metrics, aiml-integrations
 */

// ===== Posts Domain =====
export interface Post {
	id: string;
	title: string;
	slug: string;
	content?: string;
	excerpt?: string;
	status?: 'draft' | 'published' | 'archived';
	authorId?: string;
	publishedAt?: string;
	createdAt?: string;
	updatedAt?: string;
	skills?: Skill[];
	categories?: Category[];
	tags?: Tag[];
}

export interface Skill {
	id: string;
	name: string;
	slug?: string;
}

export interface Category {
	id: string;
	name: string;
	slug?: string;
	description?: string;
}

export interface Tag {
	id: string;
	name: string;
	slug?: string;
}

export interface PostAsset {
	id: string;
	type: 'thumbnail' | 'featured' | 'og-image';
	url?: string;
	generatedAt?: string;
}

// ===== Problem Solutions Domain =====
export interface ProblemSolution {
	id: string;
	title: string;
	slug: string;
	problemDescription?: string;
	solution?: string;
	status?: 'draft' | 'published' | 'archived';
	createdAt?: string;
	updatedAt?: string;
}

// ===== Case Studies Domain =====
export interface CaseStudy {
	id: string;
	title: string;
	slug: string;
	description?: string;
	status?: 'draft' | 'published' | 'archived';
	createdAt?: string;
	updatedAt?: string;
}

// ===== Technical Writings Domain =====
export interface TechnicalWriting {
	id: string;
	title: string;
	slug: string;
	content?: string;
	status?: 'draft' | 'published' | 'archived';
	createdAt?: string;
	updatedAt?: string;
}

// ===== System Designs Domain =====
export interface SystemDesign {
	id: string;
	title: string;
	slug: string;
	description?: string;
	status?: 'draft' | 'published' | 'archived';
	createdAt?: string;
	updatedAt?: string;
}

// ===== Impact Metrics Domain =====
export interface ImpactMetric {
	id: string;
	title: string;
	metric?: number;
	unit?: string;
	createdAt?: string;
	updatedAt?: string;
}

// ===== AIML Integrations Domain =====
export interface AimlIntegration {
	id: string;
	title: string;
	description?: string;
	status?: 'draft' | 'published' | 'archived';
	createdAt?: string;
	updatedAt?: string;
}

// ===== Reports Domain =====
export interface Report {
	id: string;
	title: string;
	type?: string;
	content?: string;
	createdAt?: string;
	updatedAt?: string;
}

// ===== Comments (Post Comments) =====
export interface PostComment {
	id: string;
	postId: string;
	content: string;
	authorId?: string;
	status?: 'pending' | 'approved' | 'rejected';
	createdAt?: string;
	updatedAt?: string;
}

// ===== Request/Response Types =====
export interface CreatePostRequest {
	title: string;
	slug?: string;
	content?: string;
	excerpt?: string;
	status?: 'draft' | 'published' | 'archived';
}

export interface UpdatePostRequest {
	title?: string;
	slug?: string;
	content?: string;
	excerpt?: string;
	status?: 'draft' | 'published' | 'archived';
}

export interface PaginationMeta {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
}
