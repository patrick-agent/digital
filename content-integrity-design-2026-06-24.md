## Content Integrity Hardening

### Context

- Mode: Intrapreneurship
- Product stage: Has users
- Product reality: this repo is no longer a portfolio-only site. It is now a live content, blog, shop, and admin surface with real publishing, SEO, and affiliate flows.
- Current problem: the system still behaves in several places like an internal tool or content migration script, while users and operators experience it like a production product.

### Reframed Problem

This is not a bug-fix sprint.

This is a trust and integrity gap between:

- what the site promises users and operators,
- what the admin/content system allows into the runtime,
- and what the persistence layer guarantees under failure.

Today the codebase is optimized for content velocity. It is not yet consistently optimized for production truthfulness, safety, and recoverability.

### What Users Actually Feel

- A visitor can receive unsafe or broken markup from content that was trusted too early.
- An editor can believe data was saved or synced correctly when the system actually changed canonical fields in surprising ways.
- A user can submit the contact form, see success, and still have their message disappear.
- An operator can hit one read/parsing failure in JSON storage and unknowingly put an entire dataset at risk on the next write.

### Root Cause Summary

#### 1. No consistent trust boundary for content HTML

The blog pipeline has a sanitize layer, but the shop pipeline does not. Admin-authored HTML is treated as trusted by default in some routes and untrusted in others.

Result:

- stored XSS risk,
- malformed public markup,
- inconsistent rendering guarantees between content surfaces.

#### 2. No fail-closed persistence contract

`readJSON()` swallows read/parse failures and returns `[]`. Callers then continue into read-modify-write flows as if the file were legitimately empty.

Result:

- silent data loss risk,
- hidden operational corruption path,
- impossible distinction between “empty dataset” and “storage failure”.

#### 3. No canonical content identity rules across write flows

Publishing fields such as `publishedAt`, slug generation, and content normalization are not governed by one durable policy.

Result:

- updates can rewrite chronology,
- Vietnamese slugs degrade or collide,
- sync flows are surprising instead of stable.

#### 4. Production UX is ahead of production plumbing

Some flows present production-success messaging without production-complete behavior.

Result:

- contact success without delivery,
- operator trust erosion,
- logs becoming a fake backend.

#### 5. Security posture is operationally loose

Secrets and admin controls are treated too casually in docs/worktree conventions.

Result:

- secret sprawl,
- accidental credential disclosure,
- higher blast radius when collaborating or shipping quickly.

### Product Goal

Turn the site from a fast-moving content workspace into a production-safe publishing system without slowing normal admin workflows.

### Success Criteria

#### Product-level success

- No user-facing flow claims success unless the underlying action actually completed.
- Published content keeps a stable canonical identity over time.
- Public content surfaces obey one clear HTML safety model.
- Storage failures fail loudly instead of mutating data under ambiguity.

#### Engineering success

- Persistence helpers can distinguish empty, missing, and corrupted data.
- HTML-capable fields have an explicit sanitize policy.
- Slug and publish-date behavior are centralized, deterministic, and tested.
- Critical flows have regression coverage.

### Non-Goals

- Replacing the JSON database with a hosted database in this phase.
- Redesigning the admin UI.
- Rewriting the entire content model.
- Solving every lint warning in unrelated rendering code.

### Design Principles

#### 1. Fail closed, not silently

If the system cannot prove storage is readable, it must not continue with destructive writes.

#### 2. Sanitize at the boundary

HTML safety should be enforced at the trust boundary, not left to each page author.

#### 3. Canonical fields are policy-owned

`slug`, `publishedAt`, and similar identity fields must be controlled by shared rules, not ad hoc route behavior.

#### 4. Truthful UX over optimistic UX

A “success” state is a contract. If the real side effect did not happen, the UI must not say it did.

#### 5. Small hardening beats broad rewrite

Use the minimum set of structural changes that permanently remove the risky paths.

### Proposed Scope

#### Workstream A: Secret containment

- Remove hard-coded secret examples that use live-looking values.
- Replace exposed values in tracked docs with placeholders.
- Prepare for secret rotation as an operational follow-up.

#### Workstream B: Durable JSON storage contract

- Refactor JSON read helpers so parse/read failures surface explicit errors.
- Preserve the current “missing file can bootstrap” behavior where needed.
- Block write paths from treating corruption as an empty dataset.
- Add regression tests for corrupt JSON and failed reads.

#### Workstream C: Unified HTML trust boundary

- Introduce one sanitize policy for shop-rich-text fields.
- Sanitize `description`, `whyRecommend`, and FAQ answers before public render.
- Escape `<` in JSON-LD script payloads.
- Keep allowed formatting necessary for editorial use.

#### Workstream D: Truthful contact flow

- Decide one honest production behavior for contact submissions in this phase:
  - persist submissions,
  - send mail,
  - or explicitly downgrade the UX from “sent” to “received for local/dev only”.
- Remove raw PII logging from the success path.

#### Workstream E: Canonical publish and slug policy

- Preserve existing `publishedAt` for already-published posts unless the status transitions into published.
- Add a Unicode-aware slug pipeline for Vietnamese text.
- Reuse the same slug policy in admin forms and server-side persistence.

#### Workstream F: Quality gates for the hardened paths

- Add targeted tests for storage helpers, webhook publish behavior, slug generation, and shop HTML safety.
- Verify build still passes.
- Triage lint issues into:
  - blockers for touched files,
  - follow-up debt for unrelated files.

### Rollout Strategy

#### Phase 1: Contain blast radius

- Secret examples
- JSON fail-closed contract
- Shop HTML sanitization

#### Phase 2: Restore truthfulness

- Contact flow behavior
- Publish-date preservation
- Slug normalization

#### Phase 3: Lock in regression safety

- Tests
- QA on localhost
- final ship checks

### Risks

#### Risk 1: Existing content may rely on unsanitized HTML

Mitigation:

- use an allowlist tuned to current editorial patterns,
- verify representative shop entries,
- prefer preserving formatting over over-stripping.

#### Risk 2: Stricter storage errors may expose hidden data issues immediately

Mitigation:

- make the failure explicit,
- add actionable error messages,
- validate current JSON files before ship.

#### Risk 3: Slug normalization can change generated URLs for new entries

Mitigation:

- preserve existing stored slugs,
- apply improved normalization to creation/update policy without rewriting unrelated historical URLs.

### Open Decisions

#### Decision 1: Contact flow target in this phase

Preferred direction: persist submissions server-side first, then optionally integrate outbound email later.

Why:

- smallest honest production contract,
- easiest to test locally,
- avoids fake success UX.

#### Decision 2: Sanitization point

Preferred direction: sanitize on public render now, then consider sanitize-on-write later only if editorial workflow benefits from normalized storage.

Why:

- lower migration risk,
- avoids mutating existing content records during the first hardening pass.

### Recommended Outcome

Ship a focused hardening release that makes content storage, public rendering, publishing metadata, and contact behavior trustworthy enough for a live user-facing product.

This is the highest-leverage path because it removes system-level ambiguity instead of spending cycles fixing symptoms one route at a time.
