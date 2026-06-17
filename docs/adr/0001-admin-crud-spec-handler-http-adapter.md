# ADR 0001: Admin CRUD Uses Spec, Handler, and HTTP Adapter

- Status: Accepted
- Date: 2026-06-17

## Context

Admin CRUD flows had three recurring problems:

1. Route handlers repeated the same auth, request parsing, and HTTP error mapping logic.
2. Service handlers often validated input but returned loosely shaped output.
3. JSON store modules drifted from the shape expected by admin forms and routes.

This made the service layer shallow: the interface exposed to callers was nearly as complex as the implementation behind it.

## Decision

Admin CRUD slices will use this structure:

1. `spec.js`
   - Defines parsed input schemas.
   - Defines success and failure result schemas.
   - Defines entity-specific error codes.

2. `handler.js`
   - Parses input with `safeParse`.
   - Returns typed success or typed failure results.
   - Does not throw expected business errors to callers.
   - Accepts a store adapter seam through constructor injection when useful for tests.

3. `http.js`
   - Maps slice error codes to HTTP status codes.

4. `db/*.js`
   - Acts as the store adapter.
   - Normalizes persisted JSON into the canonical entity shape before returning data.

5. `app/api/admin/**/route.js`
   - Stays thin.
   - Authenticates the request.
   - Delegates to the slice and maps typed failures through `http.js`.

## Consequences

### Positive

- Input and output contracts are explicit.
- HTTP policy is localized instead of duplicated.
- Store drift is corrected in one place.
- Handlers become easy to smoke test with injected store adapters.

### Negative

- Each feature slice gains one more small file (`http.js`).
- Similar CRUD slices still duplicate some handler structure until a shared helper proves worthwhile.

## Rollout

The first slices using this decision are:

- `services`
- `events`
- `music`
