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

// ===== Publications Domain =====
export type PublicationStatus = 'skeleton' | 'draft' | 'scheduled' | 'published' | 'archived';
export type ContentType =
	| 'post'
	| 'case_study'
	| 'problem_solution'
	| 'technical_writing'
	| 'system_design'
	| 'report'
	| 'impact_metric'
	| 'aiml_integration';
export type PublicationMediaType =
	| 'screenshot'
	| 'archive'
	| 'thumbnail'
	| 'attachment'
	| 'metadata';
export type PublicationPlatformStatus = 'pending' | 'publishing' | 'published' | 'failed';

export interface Publication {
	id: string;
	userId: string;
	contentId: string;
	contentType: ContentType;
	title: string;
	outline?: string;
	status: PublicationStatus;
	isArchived: boolean;
	platforms?: PublicationPlatform[];
	media?: PublicationMedia[];
	createdAt: string;
	updatedAt: string;
}

export interface PublicationPlatform {
	id: string;
	publicationId: string;
	platformId: string;
	publishedAt?: string;
	publishedUrl?: string;
	status: PublicationPlatformStatus;
	metadata?: Record<string, any>;
	retryCount: number;
	platform?: Platform;
}

export interface PublicationMedia {
	id: string;
	publicationId: string;
	platformId: string;
	mediaType: PublicationMediaType;
	filePath: string;
	fileSize: number;
	uploadedAt: string;
}

export interface Platform {
	id: string;
	name: string;
	slug: string;
	description?: string;
	icon?: string;
	color?: string;
	isActive: boolean;
}

export interface CreatePublicationRequest {
	contentId: string;
	contentType: ContentType;
	title: string;
	outline?: string;
}

export interface UpdatePublicationRequest {
	title?: string;
	outline?: string;
	status?: PublicationStatus;
	isArchived?: boolean;
}

export interface PublishRequest {
	metadata?: Record<string, any>;
	scheduledAt?: string;
}

export interface BulkPublishRequest {
	platformIds: string[];
	metadata?: Record<string, any>;
}

export interface CreatePlatformRequest {
	name: string;
	slug: string;
	description?: string;
	icon?: string;
	color?: string;
}

export interface PublicationFilter {
	status?: PublicationStatus;
	contentType?: ContentType;
	isArchived?: boolean;
	limit?: number;
	offset?: number;
}
