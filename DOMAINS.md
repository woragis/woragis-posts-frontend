# Content Domains

The Posts frontend supports 8 different content domains for managing various types of content:

## Posts
**Primary content format** - Blog posts, articles, and general writing

- Full CRUD operations
- Slug-based routing
- Category and tag support
- Skill associations
- Asset management

Endpoints: `/posts`

## Problem Solutions
**Q&A style content** - Solutions to technical problems and challenges

- Structured problem-solution format
- Search optimized
- Community-driven content

Endpoints: `/problem-solutions`

## Case Studies
**Real-world examples** - Detailed case studies of projects and implementations

- Long-form content
- Results and metrics
- Client/project references

Endpoints: `/case-studies`

## Technical Writings
**Deep dives** - In-depth technical articles and documentation

- Code examples
- Architecture diagrams
- API documentation

Endpoints: `/technical-writings`

## System Designs
**Architecture documentation** - System architecture and design patterns

- Component diagrams
- Data flows
- Technology stacks

Endpoints: `/system-designs`

## Reports
**Analysis and summaries** - Regular reports and analysis of metrics/projects

- Data-driven content
- Statistics and graphs
- Periodic summaries

Endpoints: `/reports`

## Impact Metrics
**Measurements** - Tracking impact and metrics of posts/projects

- Engagement metrics
- Performance indicators
- Success measurements

Endpoints: `/impact-metrics`

## AI/ML Integrations
**AI-powered features** - Content generated or enhanced with AI/ML

- AI-assisted writing
- Automated tagging
- Intelligent summaries

Endpoints: `/aiml-integrations`

## Content Type Hierarchy

```
┌─────────────────────────────────┐
│   Base Content Properties       │
│  id, slug, title, content       │
│  excerpt, status, author        │
│  created_at, updated_at         │
└─────────────────────────────────┘
         ↓
┌─────────────────────────────────┐
│   Shared Features               │
│  Comments                       │
│  Categories & Tags              │
│  Skills                         │
│  Assets (images, files)         │
└─────────────────────────────────┘
         ↓
┌───────────────────────────────────────────────────────────────────┐
│                      Domain-Specific Content                      │
├─────────────────┬──────────────┬──────────┬──────────┬─────────┬──┤
│  Post           │ Case Study   │ Problem  │ Technical│ System  │Re│
│  (General)      │ (Projects)   │ Solution │ Writing  │ Design  │po│
└─────────────────┴──────────────┴──────────┴──────────┴─────────┴──┘
```

## Using the Domains

### Dashboard
The dashboard (`/dashboard`) provides quick access to all 8 content domains with count cards.

### List Views
- `/posts` - View all posts
- `/problem-solutions` - View all problem solutions
- `/case-studies` - View all case studies
- `/technical-writings` - View all technical writings
- `/system-designs` - View all system designs
- `/reports` - View all reports
- `/impact-metrics` - View all impact metrics
- `/aiml-integrations` - View all AI/ML integrations

### API Clients
Each domain has a dedicated API client in `src/lib/api/[domain]/`:

```typescript
import { 
  postsClient,
  problemSolutionsClient,
  caseStudiesClient,
  technicalWritingsClient,
  systemDesignsClient,
  reportsClient,
  impactMetricsClient,
  aimlIntegrationsClient
} from '$lib';

// All clients support standard operations:
await postsClient.listPosts(page, limit);
await postsClient.getPostBySlug('my-post');
await problemSolutionsClient.create(data);
await caseStudiesClient.update(id, data);
```

## Extending Domains

To add domain-specific functionality:

1. **Create specialized client method** in `src/lib/api/[domain]/client.ts`:

```typescript
class PostsApiClient extends BaseApiClient {
  async addSkill(postId: string, skillId: string): Promise<void> {
    await this.client.post(`/${postId}/skills`, { skillId });
  }
  
  async removeTag(postId: string, tagId: string): Promise<void> {
    await this.client.delete(`/${postId}/tags/${tagId}`);
  }
}
```

2. **Add types** for domain-specific properties in `src/lib/api/types.ts`

3. **Update pages** to show domain-specific UI in `src/routes/[domain]/`

## Content Strategy

### Posts
- Daily blog posts
- News and updates
- General knowledge sharing

### Problem Solutions
- Troubleshooting guides
- FAQ entries
- Common issues and fixes

### Case Studies
- Project portfolios
- Implementation stories
- Success stories

### Technical Writings
- Deep-dive articles
- How-to guides
- Architecture documentation

### System Designs
- Architecture diagrams
- System specifications
- Technology recommendations

### Reports
- Monthly reviews
- Quarterly analysis
- Annual summaries

### Impact Metrics
- Tracking blog performance
- User engagement stats
- Content effectiveness

### AI/ML Integrations
- AI-generated summaries
- Smart tag suggestions
- Content recommendations
