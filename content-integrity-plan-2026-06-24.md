## Content Integrity Implementation Plan

### Source

- Design doc: `content-integrity-design-2026-06-24.md`
- Planning mode: office-hours -> autoplan
- Product mode: intrapreneurship
- Stage: has users

### Goal

Harden the site as a production-safe publishing system by fixing trust boundaries, fail-open storage behavior, canonical content identity drift, and fake-success user flows.

### Scope

#### In

- secret containment in tracked files/docs
- fail-closed JSON/Blob storage behavior
- shop rich-text sanitization and JSON-LD escaping
- canonical slug + publish-date policy
- unify blog sync policy across webhook/CLI paths
- truthful contact submission behavior
- regression tests for touched flows

#### Out

- replacing JSON storage with a full database
- broad admin redesign
- unrelated lint cleanup outside touched paths unless blocking

### Preconditions

#### Before shipping

- rotate exposed credentials
- remove tracked live-looking secret values from docs/files
- back up current `db/*.json`
- validate current JSON datasets before behavior changes go live

### Phase 0: Contain Risk

#### Tasks

- replace hard-coded secret examples with placeholders
- inventory credentials that must be rotated
- add or run a JSON validation pass for current local datasets
- preserve a backup path for current content data before persistence changes

#### Done when

- no tracked file publishes usable secret material
- operator has a clear list of secrets to rotate
- current JSON data parses cleanly or known corruption is identified before code changes ship

### Phase 1: Fail-Closed Storage Contract

#### Tasks

- refactor `src/lib/db/io.js`
- distinguish: missing file, blank file, parse failure, Blob unavailable, Blob corruption
- keep bootstrap behavior only for intentionally missing files
- stop returning `[]` for corrupted/unreadable datasets
- make local JSON writes atomic
- ensure Blob mode does not silently fall back in misleading ways

#### Blast Radius Audit

- `src/lib/db/io.js`
- `src/lib/db/blog.js`
- `src/lib/db/shop.js`
- `src/lib/db/newsletter.js`
- `src/lib/db/media.js`
- `src/lib/blog/public-catalog/handler.js`
- `src/lib/shop/public-catalog/handler.js`
- any page/handler currently converting storage failure into fake empty state or fake 404

#### Done when

- corrupted storage fails loudly
- write flows cannot overwrite a dataset after a swallowed read failure
- public routes distinguish true empty state from storage failure

### Phase 2: Unified Public HTML Trust Boundary

#### Tasks

- reuse existing `sanitize-html` dependency
- add shared sanitize policy for public shop rich text
- sanitize `description`, `whyRecommend`, and FAQ answers before render
- escape `<` in shop JSON-LD payloads
- verify current shop content still renders needed formatting

#### Blast Radius Audit

- `src/app/shop/[slug]/page.js`
- `src/lib/shop/public-catalog/handler.js`
- `src/lib/shop/public-catalog/spec.js` if shaping is needed
- any shared presentation helper introduced for sanitization

#### Done when

- public shop content no longer trusts raw admin HTML
- JSON-LD payloads cannot break script context

### Phase 3: Canonical Identity Policy

#### Tasks

- replace ASCII-only slug logic in `src/lib/db/slug.js` with Vietnamese-aware normalization
- preserve existing stored slugs by default
- stop regenerating slugs automatically on edit
- align admin forms with server slug policy
- preserve `publishedAt` on already-published content
- only set `publishedAt` on first publish transition or published create without timestamp

#### Blast Radius Audit

- `src/lib/db/slug.js`
- `src/lib/db/blog.js`
- `src/lib/db/shop.js`
- `src/components/admin/BlogForm.jsx`
- `src/components/admin/ShopForm.jsx`
- other admin forms duplicating slug regex logic

#### Done when

- Vietnamese titles create stable, readable slugs
- title edits do not unexpectedly churn public URLs
- content updates do not rewrite chronology

### Phase 4: Collapse Sync Divergence

#### Tasks

- unify blog sync policy between webhook and CLI paths
- remove ad hoc `publishedAt = now` behavior from sync updates
- decide whether `scripts/sync-blog.mjs` calls the canonical service path directly or becomes a thin adapter
- preserve existing slug and publish metadata for updates

#### Blast Radius Audit

- `src/app/api/webhook/sync-blog/route.js`
- `scripts/sync-blog.mjs`
- `src/lib/blog/service/*`
- `src/lib/db-cli.mjs` if still part of the live sync path

#### Done when

- both sync entry points obey the same identity rules
- repeated syncs are idempotent for published metadata

### Phase 5: Truthful Contact Contract

#### Decision locked

- this phase uses persisted receipt, not fake “message sent”

#### Tasks

- make `/api/contact` succeed only after persistence succeeds
- remove raw PII logging from success path
- store submissions in private storage, not tracked content JSON
- update both contact clients to reflect truthful copy

#### Blast Radius Audit

- `src/app/api/contact/route.js`
- `src/components/contact/ContactPage.jsx`
- `src/components/sections/ContactForm.jsx`

#### Done when

- user success state corresponds to a real persisted submission
- no fake delivery claim remains in UI copy

### Phase 6: Regression Gates

#### Tests

- storage failure mode tests
- atomic write tests
- slug normalization tests
- publish transition tests
- sync preservation tests
- shop sanitizer tests
- contact persistence tests

#### Verification

- `npm run build`
- targeted test command(s) for new coverage
- lint for touched files
- manual localhost QA for storage failure handling, shop content render, sync behavior, slug creation, contact submission

### Risks

- stricter reads may expose hidden corruption immediately
- sanitization may strip some legacy formatting
- secret rotation may temporarily break integrations
- contact persistence adds PII handling obligations

### Mitigations

- validate and back up data first
- test representative shop entries before ship
- rotate secrets in a controlled order and re-verify webhook/indexing/admin flows
- keep contact storage private and minimal

### Approval Gate

#### Needs your approval before implementation

1. Approve immediate rotation/reissuance of currently exposed credentials and removal of tracked live secret material.
2. Approve private persistence for contact submissions outside tracked `db/` content.

#### Default if not approved

- without 1: implementation can proceed for code hardening, but ship should be blocked
- without 2: contact UX must be downgraded to avoid claiming successful delivery
