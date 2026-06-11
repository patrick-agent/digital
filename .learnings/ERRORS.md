## [ERR-20260611-001] npm run lint

**Logged**: 2026-06-11T00:00:00Z
**Priority**: medium
**Status**: pending
**Area**: config

### Summary
The repository lint script is configured, but `eslint` is not installed in the current project dependencies.

### Error
```text
'eslint' is not recognized as an internal or external command,
operable program or batch file.
```

### Context
- Command attempted: `npm run lint`
- Result: `package.json` exposes `"lint": "eslint"`, but the binary is unavailable locally.

### Suggested Fix
Add `eslint` as a project dependency or update the lint script to the intended runner for this repo.

### Metadata
- Reproducible: yes
- Related Files: package.json, eslint.config.mjs

---

## [ERR-20260611-002] npm run build -- --webpack

**Logged**: 2026-06-11T00:00:00Z
**Priority**: high
**Status**: pending
**Area**: frontend

### Summary
Production build is currently blocked by pre-existing errors outside the `shop` slice.

### Error
```text
Module not found: Package path . is not exported from package @splinetool/react-spline
Syntax error: Selector ":root" is not pure (pure selectors must contain at least one local class or id)
```

### Context
- Command attempted: `npm run build -- --webpack`
- Blocking files were in `src/components/another-me/*` and `src/app/(digital)/digital/page.client.jsx`, not in the modified `shop` files.

### Suggested Fix
Repair the `@splinetool/react-spline` imports and convert the affected CSS module `:root` selectors to a valid global or local pattern before using full-app builds as a verification step.

### Metadata
- Reproducible: yes
- Related Files: src/components/another-me/AnotherMeHero.jsx, src/components/another-me/AnotherMeSocialProof.jsx, src/components/another-me/AnotherMeTimeline.jsx, src/components/another-me/AnotherMeTransition.jsx, src/components/another-me/AnotherMeFooter.module.css

---
