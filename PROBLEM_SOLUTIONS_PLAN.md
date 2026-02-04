# Problem Solutions Domain - Implementation Plan

**Status**: Ready for frontend implementation (backend fully complete)
**Scope**: Phase 6 - Next domain after Case Studies
**Estimated Duration**: 6-7 hours (slightly longer than case studies due to richer data structure)

---

## 1. Domain Overview

### Backend Status: ✅ COMPLETE
- 8 endpoints fully implemented
- Creative assets polymorphic support
- Full CRUD + featured + matrix endpoints
- Translation infrastructure (queued for Phase 8)

### Frontend Status: 🔄 SKELETON READY
- API client skeleton exists
- Placeholder route page
- Ready for full implementation

---

## 2. Data Model Comparison

### Backend (Actual Fields)
```go
ProblemSolution {
  ID              UUID
  UserID          UUID
  Problem         string (text field)
  Context         string (text field - the situation/background)
  Solution        string (text field)
  Technologies    []string (JSON array)
  Impact          string (text field - the results/outcome)
  Metrics         MetricsData {
    Before        string
    After         string
    Improvement   string
  }
  Featured        bool (for admin-curated list)
  CreatedAt       time.Time
  UpdatedAt       time.Time
}
```

### Frontend Current Types (NEEDS UPDATE)
```typescript
ProblemSolution {
  id: string;
  title: string;                    // ❌ Not in backend
  slug: string;                     // ❌ Not in backend
  problemDescription: string;       // Should be "problem"
  solution: string;                 // ✅ Matches
  status: enum;                     // ❌ Not in backend
  createdAt: string;               // ✅ Matches
  updatedAt: string;               // ✅ Matches
}
```

**KEY DIFFERENCE**: Problem solutions don't have title/slug/status. They focus on:
- Problem statement
- Context (background/situation)
- Solution approach
- Technologies used
- Measurable impact
- Before/after metrics

---

## 3. Backend API Endpoints (8 Total)

```
POST   /problem-solutions              Create (auth required)
GET    /problem-solutions              List all (auth required, paginated)
PATCH  /problem-solutions/:id          Update (auth required, own content)
DELETE /problem-solutions/:id          Delete (auth required, own content)
GET    /problem-solutions/:id          Get detail (auth required)
GET    /problem-solutions/:id/public   Get detail (public read-only)
GET    /problem-solutions/featured     List featured only (public, paginated)
GET    /problem-solutions/matrix       Problem-Solution Matrix view (public)
```

### Request/Response Shape

**Create Request:**
```json
{
  "problem": "Database queries were timing out in high-load scenarios",
  "context": "During peak hours, our production API experienced 30% latency increase",
  "solution": "Implemented query optimization with indexed lookups and caching layer",
  "technologies": ["PostgreSQL", "Redis", "Go"],
  "impact": "Reduced query time from 2500ms to 150ms average",
  "metrics": {
    "before": "2500ms average query time",
    "after": "150ms average query time",
    "improvement": "94% reduction"
  },
  "featured": false
}
```

---

## 4. Frontend Architecture Decisions

### Key Design Questions:

**Q1: How should we present this data?**
- Admin view (CRUD): Table with search, featured toggle, edit/delete
- Public view: Detailed card showing problem → context → solution → impact
- Featured section: Curated problem solutions for inspiration

**Q2: Does it need creative assets?**
- ✅ YES - Same as case studies (thumbnail, featured-image, og-image)
- Supports portfolio showcasing with visual assets

**Q3: Should we show the matrix view?**
- ✅ YES - But as optional feature, grid-based "Problem vs Solution" visualization
- Can be added after core CRUD works

**Q4: Comparison vs. Case Studies:**
| Feature | Case Studies | Problem Solutions |
|---------|------|------|
| Fields | 4 (title, desc, status, slug) | 6 (problem, context, solution, tech, impact, metrics) |
| UI Complexity | Low (simple form) | Medium (metrics input, tech tags) |
| Creative Assets | Yes | Yes (same components) |
| Public Views | 1 (portfolio) | 2 (featured list + matrix) |
| Estimated Time | 2.5-3 hrs | 3.5-4 hrs |

---

## 5. Implementation Roadmap (6-7 hours total)

### Phase 1: Type System Updates (~30 min)
**Files to modify:**
- `src/lib/api/types.ts` - Fix ProblemSolution interface
  - Remove: title, slug, status
  - Add: context, technologies[], impact, metrics{}, featured
  - Add: CreateProblemSolutionRequest, UpdateProblemSolutionRequest

- `src/lib/index.ts` - Add exports

**Considerations:**
- Metrics is optional (nullable)
- Technologies is array of strings (similar to skills)
- Should be compatible with backend shape

---

### Phase 2: API Client (~45 min)
**File:** `src/lib/api/problem-solutions/client.ts`

**Methods:**
```typescript
class ProblemSolutionsApiClient extends BaseApiClient {
  // CRUD
  async createProblemSolution(data)
  async listProblemSolutions(page, limit)
  async getProblemSolution(id)
  async updateProblemSolution(id, data)
  async deleteProblemSolution(id)
  
  // Special endpoints
  async listFeaturedProblemSolutions(page, limit)
  async getProblemSolutionMatrix()  // For visualization
  async getProblemSolutionPublic(id)
}
```

**Reuse:** 100% same pattern as case studies

---

### Phase 3: Store Management (~1 hour)
**File:** `src/lib/stores/problem-solutions.ts`

**Features:**
- List with pagination
- Search (maybe filter by technology?)
- Create/update/delete
- Current item tracking
- Featured flag toggle
- Matrix data caching

**Pattern:** Identical to case-studies.ts

---

### Phase 4: Components (~2-2.5 hours)

#### 4a. ProblemSolutionsList (45 min)
- Admin list view with table
- Search + filter options
- Featured toggle (visual indicator)
- Edit/delete/view buttons
- Pagination

**Complexity:** Medium
- Need to show problem + solution preview (truncated)
- Maybe show technologies as tags
- Featured checkbox for bulk management

#### 4b. ProblemSolutionEditor (1 hour)
- Form with multiple field types:
  - Text input: Problem (single line)
  - Textarea: Context (multi-line)
  - Textarea: Solution (multi-line)
  - Textarea: Impact (multi-line)
  - Text input array: Technologies (tag input)
  - Metrics section (3 text fields for before/after/improvement)
  - Checkbox: Featured flag
- Form validation
- Save/cancel flow

**Complexity:** Medium-High
- Tech stack input (similar to skills)
- Nested metrics object
- Validation for all fields

#### 4c. ProblemSolutionView (45 min)
- Public read-only view
- Show all fields beautifully formatted
- Highlight metrics with visual separation
- Technology tags
- Featured indicator
- Timestamp

---

### Phase 5: Routes (1.5 hours)

**Route Structure:**
```
/problem-solutions              → List (admin)
/problem-solutions/new          → Create form
/problem-solutions/:id/edit     → Edit form + creative assets
/problem-solutions/:id          → Public view
/problem-solutions/featured     → Featured list (public)
/problem-solutions/matrix       → Matrix visualization (public)
```

**Files to create:**
- `+page.svelte` - List
- `new/+page.svelte` - Create
- `[id]/edit/+page.svelte` - Edit + GenerationModal
- `[id]/+page.svelte` - Public view
- `featured/+page.svelte` - Featured list
- `matrix/+page.svelte` - Matrix view (optional first pass)

**Complexity Notes:**
- Edit page integrates GenerationModal (copy from case studies)
- Featured page shows curated solutions
- Matrix page is optional (can defer to Phase 7)

---

### Phase 6: Creative Assets Integration (30 min)
- Use existing GenerationModal
- Reuse ProgressIndicator, ImagePreview, AssetManager
- Pass contentId + domainType: "problem-solution"
- Already works with updated creative.ts

---

### Phase 7: Testing & Verification (30 min)
- `npm run check` - TypeScript validation
- `npm run build` - Production build
- Manual test: create, edit, delete flow
- Manual test: creative assets generation
- Manual test: featured toggle

---

## 6. Key Implementation Considerations

### Type System
```typescript
// UPDATE types.ts with:
export interface ProblemSolution {
  id: string;
  problem: string;          // Required
  context: string;          // Required - the background/situation
  solution: string;         // Required - the approach
  technologies: string[];   // Required - tech stack used
  impact: string;          // Required - the outcome/results
  metrics?: {              // Optional - quantified improvements
    before: string;
    after: string;
    improvement: string;
  };
  featured: boolean;       // Admin feature flag
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
```

### UI/UX Patterns
1. **Tag Input for Technologies**: Multi-select, autocomplete optional
2. **Metrics Display**: Side-by-side before/after with improvement badge
3. **Featured Toggle**: Visual indicator (star icon?) for admin
4. **Problem Preview**: Show first 100 chars on list
5. **Matrix View**: Grid showing "Problem Category" vs "Solution Type"

### Reusable Components (100% from Case Studies)
- CaseStudiesList pattern → ProblemSolutionsList
- CaseStudyEditor pattern → ProblemSolutionEditor (with extra fields)
- CaseStudyView pattern → ProblemSolutionView
- GenerationModal (polymorphic, already works)
- ProgressIndicator, ImagePreview, AssetManager (no changes needed)

---

## 7. Time Breakdown

| Phase | Task | Time | Notes |
|-------|------|------|-------|
| 1 | Type system | 30 min | Update types.ts, add exports |
| 2 | API client | 45 min | Copy case-studies pattern |
| 3 | Store | 1 hr | Copy case-studies pattern |
| 4a | List component | 45 min | Slightly more complex than case studies |
| 4b | Editor component | 1 hr | Multi-field form, tech tags |
| 4c | View component | 45 min | Metrics display styling |
| 5 | Routes (4-5 pages) | 1.5 hr | Copy patterns, integrate modal |
| 6 | Creative assets | 30 min | Reuse existing |
| 7 | Testing/Build | 30 min | Verify 0 errors |
| **TOTAL** | | **6.5-7 hrs** | **Slightly longer than case studies** |

---

## 8. Comparison: Case Studies vs Problem Solutions

### Case Studies
```
Simple: title, description, status
Focus: Portfolio showcase
UI: Minimal
Assets: Optional nice-to-have
```

### Problem Solutions
```
Complex: problem + context + solution + tech + impact + metrics
Focus: Thought leadership / technical expertise
UI: Medium complexity (metrics, tags)
Assets: Essential for social sharing
```

---

## 9. Future Enhancements (Phase 8+)

- [ ] Translation service integration (already queued in backend)
- [ ] Matrix visualization (grid view)
- [ ] Technology filtering
- [ ] Impact sorting
- [ ] Export as PDF
- [ ] AI generation for missing sections
- [ ] Tagging system
- [ ] Analytics (views, impressions)

---

## 10. Quality Checklist

- [ ] All 8 backend endpoints callable
- [ ] TypeScript strict mode: 0 errors
- [ ] Creative assets generation works (polymorphic)
- [ ] Admin can CRUD problem solutions
- [ ] Featured toggle works
- [ ] Public views don't require auth
- [ ] Pagination works on list pages
- [ ] Metrics display correctly
- [ ] Technologies render as tags
- [ ] Build passes production check
- [ ] No console errors/warnings

---

## Next Steps

**Ready when you say "ok proceed":**
1. Implement phase by phase as before
2. Commit after each major component
3. Do final build verification
4. Move to next domain (Technical Writings, System Designs, etc.)

**Total frontend domains remaining:** 8 more (7 similar pattern, 1 different)
**Estimated time to complete all:** ~40-50 hours
