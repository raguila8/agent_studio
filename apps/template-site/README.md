# Template Site

This app is the reusable client-site starter for Site Foundry.

It is intended to become the starting point for new local business websites. A new client site should usually be created by changing content, configuration, media, and TinaCMS data files, not by editing React components. React component changes should be reserved for new reusable blocks, shared layout behavior, or template-level improvements that should benefit future client sites too.

## Main Technologies

- Next.js App Router
- React and TypeScript
- TinaCMS for Git-backed content editing
- Tailwind CSS for styling
- Reusable page blocks rendered from TinaCMS content
- pnpm for package management

## Local Development

Run commands from this app directory:

```bash
cd apps/template-site
pnpm install
pnpm dev
```

The local site runs at:

```text
http://localhost:3001
```

The local TinaCMS editor runs at:

```text
http://localhost:3001/admin
```

The `dev` script runs TinaCMS and Next.js together:

```bash
TINA_PUBLIC_IS_LOCAL=true tinacms dev --port 4002 --datalayer-port 9001 -c "next dev --turbopack --port 3001"
```

The template app uses Next.js port `3001`, Tina admin server port `4002`, and Tina datalayer port `9001` so it can run at the same time as `playground-site`.

To run both local apps from the repo root, use separate terminals:

```bash
pnpm dev:playground
pnpm dev:template
```

## Build

Build the TinaCMS admin files and the Next.js site:

```bash
cd apps/template-site
pnpm build
```

The build script runs:

```bash
tinacms build && next build
```

## What To Change For A New Client

Most client-specific work should happen in these files and folders:

```text
content/global/index.json     Global site settings, navigation, footer, theme, contact details
content/pages/                Main page content and page section composition
content/blog/                 Blog posts
content/categories/           Blog categories
content/authors/              Blog authors
content/legal/                Legal page content
public/media/                 Client images and uploaded media
src/images/                   Template image assets that are imported directly by code
src/app/favicon.ico           Client favicon
```

When creating a client site, prefer to:

- Update `content/global/index.json` for business name, contact details, links, navigation, footer, and theme choices.
- Update or replace files in `content/pages/` for the client's main pages.
- Add, remove, or reorder page sections through TinaCMS block content.
- Replace sample media in `public/media/` with client-appropriate media.
- Update blog, category, author, and legal content as needed.

Do not invent factual claims about a client business. If a claim is not provided by the client or a verified source, leave it generic or mark it for review.

## What Usually Should Not Change

These files are part of the reusable template and should usually stay stable for new client builds:

```text
src/app/                      Routes, layout, metadata, sitemap, and global styles
src/components/blocks/        Reusable block renderers
src/components/elements/      Shared UI primitives
src/components/shared/        Shared site frame, nav, footer, and common components
src/components/tina/          Tina-specific wrappers, fields, and inputs
src/lib/                      Shared helpers for metadata, navigation, theme, phone, and config
tina/config.ts                TinaCMS project configuration
tina/collections/             TinaCMS content schemas
tina/__generated__/           Tina-generated files
next.config.ts                Next.js configuration
postcss.config.mjs            PostCSS/Tailwind wiring
eslint.config.mjs             ESLint configuration
tsconfig.json                 TypeScript configuration
package.json                  App dependencies and scripts
```

Change these only when the template needs a reusable capability, such as a new block type, a schema improvement, a shared layout fix, or a template-wide bug fix.

## TinaCMS Notes

TinaCMS is the editing layer for this starter. It stores editable content in Git-backed files instead of a separate database.

Important paths:

```text
tina/config.ts                       Main TinaCMS configuration
tina/collections/                    TinaCMS collections and field schemas
tina/collections/shared/blocks.ts    Page block schemas
tina/__generated__/                  Generated Tina files
content/                             Editable content
public/media/                        Repo-based media uploads
```

Configured collections currently include:

- Pages
- Legal pages
- Authors
- Categories
- Blog posts
- Global site settings

Pages are built from reusable section blocks. The Tina block schemas are defined in `tina/collections/shared/blocks.ts`, and the React renderers live in `src/components/blocks/`.

For normal client setup, edit Tina content and global config data rather than changing schemas or components. If the content model itself needs to change, update the relevant file in `tina/collections/` and the corresponding reusable React renderer carefully.

Do not run TinaCMS local schema generation or Tina build commands just because a schema or collection changed. A local Tina/GraphQL server may already be running, so leave Tina schema generation/build checks to the maintainer unless they explicitly ask for them.

TinaCloud uses these environment variables:

```text
NEXT_PUBLIC_TINA_CLIENT_ID
TINA_TOKEN
```

Do not commit `.env` files or secrets.

## Template Rule Of Thumb

For a normal new client site, the work should mostly be content/configuration:

```text
content/
public/media/
src/images/
src/app/favicon.ico
```

If a client build requires editing many files under `src/components/` or `src/app/`, pause and ask whether the requirement should become a reusable template feature instead.
