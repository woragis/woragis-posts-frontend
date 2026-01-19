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
	CaseStudy,
	TechnicalWriting,
	SystemDesign,
	ImpactMetric,
	AimlIntegration,
	Report,
	PostComment,
	Skill,
	Category,
	Tag,
	PostAsset,
	CreatePostRequest,
	UpdatePostRequest,
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
