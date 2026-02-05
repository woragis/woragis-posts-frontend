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
	status?: 'draft' | 'published' | 'archived' | 'generating';
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
export interface MetricsData {
	before: string;
	after: string;
	improvement: string;
}

export interface ProblemSolution {
	id: string;
	userId?: string;
	problem: string;
	context: string;
	solution: string;
	technologies: string[];
	impact: string;
	metrics?: MetricsData;
	featured: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface CreateProblemSolutionRequest {
	problem: string;
	context: string;
	solution: string;
	technologies: string[];
	impact: string;
	metrics?: MetricsData;
	featured?: boolean;
}

export interface UpdateProblemSolutionRequest {
	problem?: string;
	context?: string;
	solution?: string;
	technologies?: string[];
	impact?: string;
	metrics?: MetricsData;
	featured?: boolean;
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

export interface CreateCaseStudyRequest {
	title: string;
	slug?: string;
	description?: string;
	status?: 'draft' | 'published' | 'archived';
}

export interface UpdateCaseStudyRequest {
	title?: string;
	slug?: string;
	description?: string;
	status?: 'draft' | 'published' | 'archived';
}

// ===== Technical Writings Domain =====
export type WritingType =
	| 'article'
	| 'documentation'
	| 'tutorial'
	| 'guide'
	| 'blog_post'
	| 'case_study'
	| 'other';
export type WritingPublicationPlatform =
	| 'medium'
	| 'dev_to'
	| 'hashnode'
	| 'personal_blog'
	| 'github'
	| 'company_blog'
	| 'substack'
	| 'linkedin'
	| 'other';

export interface TechnicalWriting {
	id: string;
	userId: string;
	title: string;
	description: string;
	type: WritingType;
	platform: WritingPublicationPlatform;
	content?: string;
	url: string;
	canonicalUrl?: string;
	publishedAt?: string;
	readingTime?: number;
	topics?: string[];
	technologies?: string[];
	views?: number;
	likes?: number;
	shares?: number;
	comments?: number;
	projectId?: string;
	caseStudyId?: string;
	featured: boolean;
	displayOrder: number;
	excerpt?: string;
	coverImageUrl?: string;
	createdAt: string;
	updatedAt: string;
}

export interface CreateTechnicalWritingRequest {
	title: string;
	description: string;
	type: WritingType;
	platform: WritingPublicationPlatform;
	url: string;
	content?: string;
	excerpt?: string;
	canonicalUrl?: string;
	coverImageUrl?: string;
	publishedAt?: string;
	readingTime?: number;
	topics?: string[];
	technologies?: string[];
	views?: number;
	likes?: number;
	shares?: number;
	comments?: number;
	projectId?: string;
	caseStudyId?: string;
	featured?: boolean;
	displayOrder?: number;
}

export interface UpdateTechnicalWritingRequest {
	title?: string;
	description?: string;
	type?: WritingType;
	platform?: WritingPublicationPlatform;
	url?: string;
	content?: string;
	excerpt?: string;
	canonicalUrl?: string;
	coverImageUrl?: string;
	publishedAt?: string;
	readingTime?: number;
	topics?: string[];
	technologies?: string[];
	views?: number;
	likes?: number;
	shares?: number;
	comments?: number;
	projectId?: string;
	caseStudyId?: string;
	featured?: boolean;
	displayOrder?: number;
}

// ===== System Designs Domain =====
export interface ComponentsData {
	components: Array<{
		name: string;
		description?: string;
		responsibilities?: string[];
	}>;
}

export interface SystemDesign {
	id: string;
	userId: string;
	title: string;
	description: string;
	components?: ComponentsData;
	dataFlow: string;
	scalability: string;
	reliability: string;
	diagram?: string;
	featured: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface CreateSystemDesignRequest {
	title: string;
	description: string;
	components?: ComponentsData;
	dataFlow: string;
	scalability: string;
	reliability: string;
	diagram?: string;
	featured?: boolean;
}

export interface UpdateSystemDesignRequest {
	title?: string;
	description?: string;
	components?: ComponentsData;
	dataFlow?: string;
	scalability?: string;
	reliability?: string;
	diagram?: string;
	featured?: boolean;
}

// ===== Impact Metrics Domain =====
export type MetricType =
	| 'projects_delivered'
	| 'users_impacted'
	| 'performance_improvement'
	| 'cost_savings'
	| 'time_saved';
export type MetricUnit =
	| 'count'
	| 'percentage'
	| 'currency'
	| 'hours'
	| 'days'
	| 'months'
	| 'years'
	| 'milliseconds'
	| 'seconds'
	| 'minutes';
export type EntityType = 'project' | 'problem_solution' | 'case_study' | 'system_design';

export interface ImpactMetric {
	id: string;
	userId: string;
	type: MetricType;
	value: number;
	unit: MetricUnit;
	description?: string;
	entityType?: EntityType;
	entityId?: string;
	periodStart?: string;
	periodEnd?: string;
	featured: boolean;
	displayOrder: number;
	createdAt: string;
	updatedAt: string;
}

export interface CreateImpactMetricRequest {
	type: MetricType;
	value: number;
	unit: MetricUnit;
	description?: string;
	entityType?: EntityType;
	entityId?: string;
	periodStart?: string;
	periodEnd?: string;
	featured?: boolean;
	displayOrder?: number;
}

export interface UpdateImpactMetricRequest {
	type?: MetricType;
	value?: number;
	unit?: MetricUnit;
	description?: string;
	entityType?: EntityType;
	entityId?: string;
	periodStart?: string;
	periodEnd?: string;
	featured?: boolean;
	displayOrder?: number;
}

// ===== AIML Integrations Domain =====
export type IntegrationType =
	| 'rag'
	| 'llm'
	| 'ml_model'
	| 'computer_vision'
	| 'nlp'
	| 'recommendation'
	| 'chatbot'
	| 'anomaly_detection'
	| 'predictive_analytics'
	| 'generative_ai'
	| 'other';

export type Framework =
	| 'openai'
	| 'anthropic'
	| 'huggingface'
	| 'tensorflow'
	| 'pytorch'
	| 'langchain'
	| 'llamaindex'
	| 'cohere'
	| 'google_ai'
	| 'azure_ai'
	| 'aws_bedrock'
	| 'custom'
	| 'other';

export interface AimlIntegration {
	id: string;
	userId: string;
	title: string;
	description: string;
	type: IntegrationType;
	framework: Framework;
	modelName?: string;
	modelVersion?: string;
	useCase?: string;
	impact?: string;
	technologies?: string[];
	architecture?: string;
	metrics?: string;
	projectId?: string;
	caseStudyId?: string;
	featured: boolean;
	displayOrder: number;
	demoUrl?: string;
	documentationUrl?: string;
	githubUrl?: string;
	createdAt: string;
	updatedAt: string;
}

export interface CreateAimlIntegrationRequest {
	title: string;
	description: string;
	type: IntegrationType;
	framework: Framework;
	modelName?: string;
	modelVersion?: string;
	useCase?: string;
	impact?: string;
	technologies?: string[];
	architecture?: string;
	metrics?: string;
	projectId?: string;
	caseStudyId?: string;
	featured?: boolean;
	displayOrder?: number;
	demoUrl?: string;
	documentationUrl?: string;
	githubUrl?: string;
}

export interface UpdateAimlIntegrationRequest {
	title?: string;
	description?: string;
	type?: IntegrationType;
	framework?: Framework;
	modelName?: string;
	modelVersion?: string;
	useCase?: string;
	impact?: string;
	technologies?: string[];
	architecture?: string;
	metrics?: string;
	projectId?: string;
	caseStudyId?: string;
	featured?: boolean;
	displayOrder?: number;
	demoUrl?: string;
	documentationUrl?: string;
	githubUrl?: string;
}

// ===== Reports Domain =====
export interface Report {
	id: string;
	userId: string;
	name: string;
	description?: string;
	sections?: Record<string, any>;
	filters?: Record<string, any>;
	isFavorite: boolean;
	archivedAt?: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface CreateReportRequest {
	name: string;
	description?: string;
	sections?: Record<string, any>;
	filters?: Record<string, any>;
	favorite?: boolean;
}

export interface UpdateReportRequest {
	name?: string;
	description?: string;
	sections?: Record<string, any>;
	filters?: Record<string, any>;
	favorite?: boolean;
}

export interface ReportSection {
	name: string;
	type: 'metrics' | 'timeline' | 'summary' | 'details';
	config?: Record<string, any>;
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

export interface PaginatedApiResponse<T> {
	data: T[];
	meta: PaginationMeta;
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
