# Enspire Website

CMS-driven Next.js website backed by Directus.

## Start Here
- Full ownership and onboarding guide: `HANDOVER.md`

## Tech Stack
- Next.js 14 (App Router)
- React 18
- TailwindCSS + SCSS
- Directus CMS
- GSAP animations

## Requirements
- Node.js `>=22.11.0 <24.0.0`

## Local Development
1. Install dependencies:
	- `npm install`
2. Configure environment variables:
	- copy `.env.example` to `.env`
	- fill Directus and other required values
3. Run dev server:
	- `npm run dev`

Open `http://localhost:3000`.

## Scripts
- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`

## Notes
- Most pages are served through dynamic slug routing and rendered from Directus content.
- The parser/renderer and data-fetch flow are documented in `HANDOVER.md`.








## 1. What This Project Is
This is a Next.js 14 App Router website that renders content primarily from Directus CMS.

The key idea is:
- Routes are mostly dynamic (`/[...slug]`).
- The app fetches a post/page record from Directus by slug.
- The `content` HTML from Directus is parsed and rendered into React elements.
- Custom inline component blocks can be embedded in CMS content and resolved to local React components.

It behaves like a hybrid CMS renderer rather than a typical hand-authored static Next.js site.

## 2. Core Stack
- Next.js 14 (`app` directory)
- React 18
- TailwindCSS + SCSS
- Directus as content/data backend
- GSAP for animation/smooth scrolling
- Cloudflare Turnstile for anti-spam on forms

Node requirement (from `package.json`):
- `>=22.11.0 <24.0.0`

## 3. High-Level Architecture

### 3.1 Request and Render Flow
1. Route enters via `app/page.jsx` or `app/[...slug]/page.jsx`.
2. Both use `components/pageWrapper.jsx`.
3. `PageWrapper` computes slug/path and calls `getPageData` from `actions/globals.js`.
4. `getPageData` fetches Directus `/items/posts` filtered by slug + status published.
5. `PageWrapper` renders shared shell (`<html>`, header, footer, SEO/head, animations).
6. `components/renderer/index.jsx` parses and renders Directus `content` HTML.

### 3.2 Dynamic Component Embedding in CMS Content
The renderer supports component tokens in HTML, such as:
- `{{component.some.path({"prop":"value"})}}`

The parser:
- Tokenizes HTML/text.
- Extracts inline component payload JSON.
- Resolves component import dynamically from `components`.

This is a powerful feature but also a maintenance hotspot.

### 3.3 Content Source Rules
- Slugs map to Directus `posts.slug` values.
- Root `/` is normalized to `home` in helper logic.
- Post-type records use a special post template (`components/renderer/templates/post.jsx`).

## 4. Important Folders and Responsibilities
- `app/`: App Router entry points and API routes.
- `components/pageWrapper.jsx`: Global page shell and layout orchestration.
- `components/renderer/`: HTML parser + runtime node rendering + head/SEO helpers.
- `components/renderer/templates/post.jsx`: Blog post template shell.
- `components/navs/`: Header/footer UI.
- `components/posts/`: Blog list/search UI and Directus-backed queries.
- `actions/globals.js`: Core server-side data fetch helpers.
- `actions/main.js`: Form email server action.
- `services/directus/index.js`: Directus HTTP wrapper + asset URL helper.
- `migrate/`: One-off/operational migration scripts and generated data.
- `utils/`: Helper and validation utilities.

## 5. Environment Variables
Template file: `.env.example`

Main vars in active code paths:
- `DOMAIN`: Used to build canonical URLs and metadata domain.
- `DIRECTUS_URL`: Base URL for Directus API.
- `DIRECTUS_API_TOKEN`: Server-side Directus token.
- `NEXT_PUBLIC_DIRECTUS_TOKEN`: Appended to Directus asset URLs.
- `NEXT_PUBLIC_CF_TURNSTILE_SITE_KEY`: Client Turnstile key (used by widget).
- `CF_TURNSTILE_SECRET`: Present in template; verification endpoint is not implemented here.

Vars used in additional flows/scripts:
- `N8N_EMAILER_WEBHOOK_URL`
- `N8N_EMAILER_API_KEY`
- `ADMIN_EMAIL`
- `WP_USERNAME`, `WP_PASSWORD`
- `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`

## 6. Local Development
1. Install dependencies:
   - `npm install`
2. Create `.env` from `.env.example` and fill required values.
3. Start dev server:
   - `npm run dev`
4. Open `http://localhost:3000`

Other scripts:
- `npm run build`
- `npm run start`
- `npm run lint`

Note: `generate:icons` exists in `package.json`, but the referenced `scripts/generate-icons.mjs` file is missing in this workspace snapshot.

## 7. Content/CMS Operational Notes
- Page availability depends on Directus slug + status.
- If no published record is found, fallback not-found UI is rendered.
- Header/footer menus contain hardcoded links in `PageWrapper` props; these are not sourced from CMS currently.
- `HeadEl` includes many preloads/styles for Elementor/WordPress ecosystem assets.

## 8. Forms and Anti-Spam
Two form-related implementations exist:
- `components/other/contactForm.jsx`
  - Uses Turnstile widget token gating.
  - Calls server action `sendEmailServer`.
- `components/formBuilder/index.jsx`
  - Generic renderer + validation.
  - Submits to `formHandler` currently logging only.

Important:
- Turnstile token is captured client-side, but no server-side token verification endpoint is implemented in this repo.
- `sendEmailServer` forwards payload to n8n webhook.

## 9. Caching and Revalidation
API route:
- `app/api/revalidate/route.js`

Behavior:
- Accepts `paths` query param (comma-separated).
- Calls `revalidatePath` for each path.

Example:
- `/api/revalidate?paths=/,/contact-us,/about-us/meet-the-team/`

## 10. Known Risks / Technical Debt
1. Secrets exposed in migration script
- `migrate/migrate.js` includes hardcoded Directus URL/token values.
- Treat as compromised; rotate and remove from source.

2. Renderer complexity
- `components/renderer/index.jsx` is large and does parsing, sanitation, component resolution, and rendering.
- Regression risk is high when modifying parser behavior.

3. Head injection and external preload list
- `components/renderer/head/index.jsx` includes a large static list of third-party assets.
- This can drift, slow pages, and be hard to audit.

4. Partial form pipeline
- `FormBuilder` server handler currently logs only.
- Turnstile lacks server-side verification.

5. Tailwind safelist maintenance burden
- Very large manual safelist in `tailwind.config.js` increases maintenance overhead and possibility of stale classes.

6. README was default template
- Project-specific onboarding depended on tribal knowledge; this document addresses that gap.

## 11. How To Approach Changes Safely

### 11.1 If you need to add or edit page content
- Prefer changing Directus content first.
- Keep slugs stable for existing URLs.
- Validate rendering in `/` and at least one dynamic slug route.

### 11.2 If you need new reusable UI blocks in CMS content
- Implement component under `components/...`.
- Ensure token path matches dynamic import normalization in renderer.
- Test malformed JSON and missing props gracefully.

### 11.3 If you need to change parsing/rendering
- Start with smallest possible diff in renderer.
- Test:
  - plain HTML
  - nested elements
  - inline component blocks
  - images/videos and style attributes
  - at least one post template page

### 11.4 If you need to work on forms
- Decide whether flow is:
  - n8n webhook email
  - direct storage in backend
  - both
- Add server-side Turnstile verification before trusting submissions.

### 11.5 If you need to run migration scripts
- Review script assumptions and input files first.
- Remove/replace hardcoded credentials.
- Run against non-production targets until output is validated.

## 12. Suggested First Week Plan for New Owner
1. Stand up local environment and verify 3 representative routes.
2. Confirm Directus schema fields used in code still match production CMS.
3. Rotate any tokens that were committed in scripts/history.
4. Define form submission source of truth (n8n vs backend persistence).
5. Add smoke tests around:
   - slug fetch and 404 behavior
   - renderer component token parsing
   - revalidation endpoint

## 13. Quick File Map (Start Here)
- `components/pageWrapper.jsx`
- `actions/globals.js`
- `services/directus/index.js`
- `components/renderer/index.jsx`
- `components/renderer/templates/post.jsx`
- `app/[...slug]/page.jsx`
- `app/api/revalidate/route.js`
- `components/other/contactForm.jsx`
- `components/formBuilder/index.jsx`
- `migrate/migrate.js`

---
If you are taking ownership, treat this as a CMS-driven rendering platform first, and a traditional static Next.js site second. Most production behavior depends on Directus data quality and the renderer/parser contract.