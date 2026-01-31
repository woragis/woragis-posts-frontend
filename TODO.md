# Posts Module - Frontend & Backend TODO

**Last Updated:** January 30, 2026  
**Scope:** Frontend (`woragis/frontend/posts`) and Backend (`woragis/backend/posts`)

---

## 🎯 Phase 1: Core Issues & Fixes

### Frontend - Routes & Pages

- [ ] Create `/src/routes/posts/new/+page.svelte` — draft creation editor (standalone, for new posts)
- [ ] Create `/src/routes/posts/[slug]/edit/+page.svelte` — post edit page with draft save/publish workflow
- [ ] Update `/src/routes/posts/+page.svelte` — fix draft visibility (add `status=draft` filter for authenticated users)

### Frontend - API Client

- [ ] Update `src/lib/api/posts/client.ts` — add `status` param to `listPosts(page, limit, status?)` method
- [ ] Add method `listDrafts(page, limit)` — convenience method for listing drafts (calls with `status=draft`)

### Backend - Posts API

- [ ] Review `ListPosts` handler — update default filtering logic:
  - If `UserID` present in context and no `status` param → return all statuses for that user
  - If public request (no auth) → default to `published` only
- [ ] Ensure `/posts` returns proper pagination metadata (for frontend pagination)

### Frontend - Markdown Rendering

- [ ] Install markdown renderer (e.g., `marked` or `remark + rehype`)
- [ ] Create `src/lib/components/MarkdownDisplay.svelte` — render Markdown → HTML with Tailwind prose styling
- [ ] Update `[slug]/+page.svelte` — replace `{@html post.content}` with `<MarkdownDisplay markdown={post.content} />`
- [ ] Create `src/lib/components/MarkdownEditor.svelte` — textarea + live preview for post editing

---

## 🤖 Phase 2: AI-Assisted Draft Builder

### Frontend - AI Draft Components

- [ ] Create `src/lib/components/DraftBuilder.svelte`:
  - Textarea for "Article context/brief" (user provides topic, key points, tone, target audience)
  - Select/radio for agent type (entrepreneur, strategist, economist, or auto-detect)
  - Temperature/model override options (optional advanced)
  - "Generate Draft" button → calls AI service
  - Loading state with streaming text display
  - Button to accept draft → move to editor, or regenerate

- [ ] Create `src/lib/components/StreamingTextDisplay.svelte`:
  - Accepts NDJSON stream from `ai-service` `/v1/chat/stream`
  - Incrementally renders chunks as they arrive
  - Shows loading indicator while streaming
  - Allows user to stop generation mid-stream

### Frontend - AI Client

- [ ] Create `src/lib/api/ai/client.ts` — AI service client:
  - `chat(agent, input, system?, temperature?, model?, provider?)` → single response
  - `chatStream(agent, input, system?, ...)` → async generator yielding chunks
  - Error handling + retry logic for transient failures

### Frontend - Posts Creation Flow

- [ ] Update `new/+page.svelte`:
  - Tabs/sections: "AI Draft Builder" | "Blank Editor" | "Template"
  - **AI Draft Builder tab:**
    - `<DraftBuilder />` component
    - On accept → populate editor and move to "Blank Editor" tab
  - **Blank Editor tab:**
    - Title input, slug (auto-generate, editable)
    - `<MarkdownEditor />` with live preview
    - Excerpt textarea
    - Status selector (draft/published)
    - Save as draft button → POST `/posts` with `status=draft`
    - Publish button → POST `/posts` with `status=published`

- [ ] Update `[slug]/edit/+page.svelte`:
  - Load existing post
  - All editor fields + two new sections:
    - **"Improve Draft" section:**
      - Textarea: "What would you like to improve?" (e.g., "make more technical", "add examples", "shorten")
      - "Improve with AI" button → calls `chatStream` with current content + request → streams refined version
    - **"Change Direction" section:**
      - Textarea: "Change direction" (e.g., "rewrite for beginners", "add case studies")
      - "Regenerate" button → streams new content
  - Save draft / Update & publish buttons

---

## 🔗 Phase 3: Backend - AI Integration

### Backend - New Endpoints (Optional but Recommended)

- [ ] Create `internal/domains/posts/aiassistant/` package:
  - `service.go` — interface for AI-assisted operations (draft generation, improvement, direction change)
  - `handler.go` (if direct endpoint) or wire through posts service

- [ ] Create `POST /posts/:id/ai/improve` — backend-side improvement (for heavy lifting / audit trails):
  - Body: `{ "improvement_request": "make more technical", "temperature": 0.7 }`
  - Calls `ai-service` `/v1/chat/stream` with current post content + request
  - Streams improved content back to frontend
  - (Optional: log suggestion for user review / A/B testing)

- [ ] Create `POST /posts/ai/draft` — server-side draft generation (optional):
  - Body: `{ "context": "...", "agent": "auto", "temperature": 0.7 }`
  - Returns streamed draft content
  - Can be called from frontend instead of direct AI-service call for credential security

### Backend - Posts Service Updates

- [ ] Add AI service client to posts service (dependency injection):
  - Create `pkg/aiclient/client.go` — wrapper around `ai-service` with retry + timeout logic
  - Inject into posts handler/service
- [ ] Update `CreativeAssets` generation endpoints to use AI service:
  - `POST /posts/:id/assets/generate/featured-image` → call `ai-service` `/v1/images`
  - `POST /posts/:id/assets/generate/thumbnail` → call `ai-service` `/v1/images`
  - Return generated image URLs (or placeholder URLs from CDN)

### Backend - Markdown Handling (Optional)

- [ ] Consider adding server-side Markdown → HTML conversion:
  - Use `goldmark` or similar Go library
  - Add `content_html` field to post response (optional, for clients that can't parse Markdown)
  - Or keep Markdown canonical (recommended for storage, let frontend render)

---

## 🧪 Phase 4: Testing & Polish

### Frontend Tests

- [ ] Unit tests for `DraftBuilder` component (mocked AI calls)
- [ ] Integration tests for create/edit flow
- [ ] E2E tests: create draft → improve → publish workflow

### Backend Tests

- [ ] Unit tests for AI client (mocked `ai-service` responses)
- [ ] Integration tests for improvement endpoints
- [ ] Tests for draft/published filtering in `ListPosts`

### UX / Polish

- [ ] Add loading skeletons while drafts stream in
- [ ] Add "cancel generation" button for long streams
- [ ] Add toast notifications for success/error states
- [ ] Add keyboard shortcuts (Ctrl+S for draft save, Ctrl+Shift+Enter for publish)
- [ ] Dark mode support for editor

---

## 📋 Phase 5: Documentation & Cleanup

### Documentation

- [ ] Update `API_INTEGRATION.md` with AI integration details
- [ ] Update `QUICK_START.md` with new post creation flow
- [ ] Add `DRAFTS_AND_AI.md` — user guide for draft builder and AI refinement
- [ ] Document streaming response format (NDJSON) in API docs

### Code Cleanup

- [ ] Remove TODO placeholders for translation service (if still not implemented)
- [ ] Remove TODO placeholders for creative assets (once wired to AI)
- [ ] Consolidate error codes across frontend/backend

---

## 🔀 Implementation Order (Recommended)

1. **Start Phase 1** — fix core issues (routes, draft visibility, markdown rendering)
2. **Add Phase 2.1–2.2** — simple AI client + DraftBuilder component (minimal MVP)
3. **Add Phase 2.3–2.4** — wired into new/edit pages
4. **Optional Phase 3** — backend endpoints for audit/security (can call AI from frontend directly for now)
5. **Phase 4** — tests + polish

---

## 🚀 Quick Start for AI Draft Builder MVP

```
1. Create AI client → src/lib/api/ai/client.ts
2. Create DraftBuilder component → src/lib/components/DraftBuilder.svelte
3. Create new/+page.svelte with DraftBuilder + markdown editor
4. Call ai-service /v1/chat/stream directly from frontend
5. Display streamed content incrementally
6. Save draft to backend
```

**Estimated Time:** 2–3 hours for working MVP.

---

## 📌 Notes

- **AI Service Location:** `c:\Users\Jezreel de Andrade\dev\Services-Workers\ai-service`
- **AI Endpoints:**
  - `POST /v1/chat` — single response
  - `POST /v1/chat/stream` — NDJSON streaming (recommended for draft builder)
  - `POST /v1/images` — image generation (for thumbnails/OG images)
- **Agents:** `economist`, `strategist`, `entrepreneur`, `startup`, `cover_letter`, `auto`
- **Streaming Format:** NDJSON with `{ "delta": "..." }`, `{ "done": true, "output": "..." }`, or `{ "error": "..." }`
- **Frontend AI Client Considerations:**
  - Handle network errors gracefully
  - Provide cancel button for user to stop generation
  - Auto-save drafts to localStorage during editing for recovery

---

## ✅ Completed

- ✅ Identified draft status support in backend (entity, service, handler)
- ✅ Identified missing routes (`/posts/new`, `/posts/:slug/edit`)
- ✅ Identified markdown rendering gap (Markdown stored, not rendered in UI)
- ✅ Located AI service with streaming endpoints
- ✅ Documented incongruencies (draft visibility, status filtering)
