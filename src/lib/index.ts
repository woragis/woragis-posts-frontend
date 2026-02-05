/**
 * Posts Frontend API Library
 * Central export for all API clients and types
 */

// Auth
export { authClient, type AuthApiClient } from './api/auth/client';
export { tokenCookies } from './api/auth/cookies';
export type {
	User,
	Profile,
	AuthResponse,
	LoginRequest,
	RegisterRequest,
	ChangePasswordRequest,
	ProfileUpdateRequest
} from './api/auth/types';

// API Clients
export { postsClient } from './api/posts';
export { aiClient } from './api/ai';
export type { Agent, Provider, ChatRequest, ChatResponse, StreamChunk } from './api/ai';
export { problemSolutionsClient } from './api/problem-solutions';
export { caseStudiesClient } from './api/case-studies';
export { technicalWritingsClient } from './api/technical-writings';
export { systemDesignsClient } from './api/system-designs';
export { impactMetricsClient } from './api/impact-metrics';
export { aimlIntegrationsClient } from './api/aiml-integrations';
export { reportsClient } from './api/reports';
export { publicationsClient } from './api/publications/client';

// Types
export type {
	Post,
	ProblemSolution,
	MetricsData,
	CreateProblemSolutionRequest,
	UpdateProblemSolutionRequest,
	CaseStudy,
	CreateCaseStudyRequest,
	UpdateCaseStudyRequest,
	SystemDesign,
	CreateSystemDesignRequest,
	UpdateSystemDesignRequest,
	ComponentsData,
	ImpactMetric,
	MetricType,
	MetricUnit,
	EntityType,
	CreateImpactMetricRequest,
	UpdateImpactMetricRequest,
	AimlIntegration,
	IntegrationType,
	Framework,
	CreateAimlIntegrationRequest,
	UpdateAimlIntegrationRequest,
	Report,
	CreateReportRequest,
	UpdateReportRequest,
	ReportSection,
	PostComment,
	Skill,
	Category,
	Tag,
	PostAsset,
	CreatePostRequest,
	UpdatePostRequest,
	TechnicalWriting,
	WritingType,
	WritingPublicationPlatform,
	CreateTechnicalWritingRequest,
	UpdateTechnicalWritingRequest,
	Publication,
	PublicationPlatform,
	PublicationMedia,
	Platform,
	CreatePublicationRequest,
	UpdatePublicationRequest,
	PublishRequest,
	BulkPublishRequest,
	CreatePlatformRequest,
	PublicationFilter,
	PublicationStatus,
	ContentType,
	PublicationMediaType,
	PublicationPlatformStatus
} from './api/types';

// Stores
export {
	auth,
	initializeAuth,
	loginUser,
	registerUser,
	logoutUser,
	updateProfile,
	changePassword
} from './stores/auth';
