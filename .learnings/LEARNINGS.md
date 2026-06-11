## [LRN-20260611-001] best_practice

**Logged**: 2026-06-11T00:00:00Z
**Priority**: high
**Status**: resolved
**Area**: backend

### Summary
Public shop data should go through a single catalog seam so route code does not re-implement status, pagination, and related-product rules.

### Details
`/shop`, `/shop/[slug]`, and `sitemap.xml` were each shaping product data directly from `db.js`, which caused drift around `status`, hidden default limits, and duplicated helpers. A dedicated public-catalog contract/handler now centralizes active-product reads, filtering, sorting, and related-product lookup.

### Suggested Action
When touching public shop behavior again, extend the `src/lib/shop/public-catalog` seam first instead of adding more direct `db.js` reads in route segments.

### Metadata
- Source: conversation
- Related Files: src/lib/shop/public-catalog/spec.js, src/lib/shop/public-catalog/handler.js, src/app/shop/page.js, src/app/shop/[slug]/page.js, src/app/sitemap.js
- Tags: architecture, shop, spec-handler, public-catalog

### Resolution
- **Resolved**: 2026-06-11T00:00:00Z
- **Commit/PR**: uncommitted
- **Notes**: Added a public-catalog Spec/Handler seam and switched public shop routes plus sitemap to consume it.

---
