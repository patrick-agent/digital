This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Google Indexing API

Google Indexing API officially supports `JobPosting` and `BroadcastEvent` pages. For normal website/blog pages, sitemap and Search Console remain the primary method; this script can submit URLs but Google may ignore or not guarantee indexing.

Service account setup:

1. Enable `Indexing API` in Google Cloud Console.
2. Create a Service Account and JSON key.
3. Add the service account `client_email` as an `Owner` in Google Search Console for `https://tachy.io.vn`.
4. Add credentials to `.env`:

```env
GOOGLE_INDEXING_CLIENT_EMAIL="service-account@project.iam.gserviceaccount.com"
GOOGLE_INDEXING_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_INDEXING_SITEMAP_URL="https://tachy.io.vn/sitemap.xml"
```

Commands:

```bash
npm run index:api:dry
npm run index:api
npm run index:api:optional
npm run index:api -- --url=https://tachy.io.vn/blog/example
npm run index:api -- --limit=50
```

`postdeploy` also runs the Indexing API script in optional mode after the sitemap ping. If credentials are missing, it skips; if Google returns an API error, it logs the error without failing the deploy.

OAuth owner-account setup, if Search Console refuses the service account email:

1. In Google Cloud Console, create an OAuth Client ID with application type `Desktop app`.
2. Download the OAuth client JSON.
3. Save client settings and print the Google authorization URL:

```bash
npm run index:api:oauth -- --client-json="C:\path\to\oauth-client.json"
```

4. Open the printed URL with the Google account that is a verified owner in Search Console.
5. Copy the `code=` value from the localhost redirect URL.
6. Save the refresh token:

```bash
npm run index:api:oauth -- --code=PASTE_CODE_HERE
```

After that, `npm run index:api` uses the OAuth owner account automatically.

### Automatic blog indexing

When a blog post is created or updated with `status: "published"`, these endpoints automatically revalidate the blog pages and notify Google Indexing API for `/blog/[slug]`:

```txt
POST /api/v1/blog/posts
PATCH /api/v1/blog/posts/[id]
POST /api/admin/blog/posts
PATCH /api/admin/blog/posts/[id]
POST /api/webhook/sync-blog
```

Automatic Google notifications only run on Vercel by default. If you call the API on `localhost`, the local `db/blog.json` is updated, but Google is not notified because the production URL is not live yet. To publish and auto-index a real article, call the production API on `https://tachy.io.vn`.
