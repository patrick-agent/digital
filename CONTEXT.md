# Domain Context

## Concepts

### Service
- A Service is a sellable offer shown in the admin dashboard and stored in `db/services.json`.
- Canonical fields: `serviceName`, `slug`, `headline`, `description`, `features`, `priceRange`, `ctaLabel`, `ctaUrl`, `icon`, `status`, `displayOrder`.

### Event
- An Event is a live appearance or booking entry managed from the admin dashboard and stored in `db/events.json`.
- Canonical fields: `eventName`, `slug`, `venue`, `city`, `country`, `date`, `ticketUrl`, `posterImage`, `status`.

### Release
- A Release is a music entry in the discography managed from the admin dashboard and stored in `db/music.json`.
- Canonical fields: `title`, `slug`, `type`, `releaseDate`, `coverArt`, `streamingLinks`, `spotifyEmbed`, `tracklist`, `description`, `featured`, `status`.

## Architecture

### Admin CRUD Feature Slice
- Each admin CRUD feature slice lives under `src/lib/<entity>/service`.
- The slice owns four files:
  - `spec.js`: parsed input and typed result contract.
  - `handler.js`: application logic that returns typed success or typed failure.
  - `http.js`: error-code to HTTP-status mapping for route handlers.
  - `index.js`: public entrypoint for the slice.

### Store Adapter
- `src/lib/db/*.js` files are store adapters for JSON-backed persistence.
- Store adapters normalize persisted shape before returning data to callers.

### Admin Route Handler
- `src/app/api/admin/**/route.js` files are thin HTTP adapters.
- They should authenticate, parse request input, call the feature slice, and map typed failures to HTTP responses.
