# Create Playground Site

You are testing whether the Site Foundry template can be reused for a different local business.

## Target app

`apps/playground-site`

## Goal

Convert the playground site into a new fake local business website by editing only content and Tina-managed media assets.

The active site should read like a real website for the fictional business.

The purpose of this task is to test repeatability:

Can a different business website be created from the finished template without changing React components, Next.js routes, Tina schemas, or shared code?

## Allowed files

You may edit:

- `apps/playground-site/content/**`
- `apps/playground-site/public/media/**`
- `apps/playground-site/package.json` only if the package name needs to be corrected

## Forbidden files

Do not edit:

- `apps/playground-site/src/app/**`
- `apps/playground-site/src/components/**`
- `apps/playground-site/src/lib/**`
- `apps/playground-site/src/images/**`
- `apps/playground-site/tina/**`
- `apps/playground-site/next.config.ts`
- `apps/playground-site/tsconfig.json`
- `apps/playground-site/public/block-previews/**`
- `apps/template-site/**`
- `packages/**`

Exception: if a Tina content block uses the shared Nucleo icon field and no
existing approved icon is suitable, you may make the narrow icon-registry
change described in "Tina icon rules" below.

## Core rules

- Do not edit React components.
- Do not edit Tina schemas.
- Do not edit Next.js routing files.
- Do not change block definitions.
- Preserve the existing content file structure unless a content file is clearly obsolete and removing it does not affect routing or build behavior.
- Keep all Tina block content valid.
- The generated business does not need to preserve the same number of services or individual service pages as the current template site. Create, remove, or repurpose service content files under `apps/playground-site/content/**` as needed so the service set feels realistic for the mock business.
- Create at least 2 and at most 5 individual service pages.
- Service page slugs should match the actual service being described while remaining short, readable, and SEO-friendly. For example, use slugs like `roof-repair`, `storm-damage-repair`, or `gutter-installation` rather than keeping unrelated template slugs or using vague labels.
- Each individual service page must include a `contentTwoColumnWithRightImage` block from `content-two-column-with-right-image.tsx`. Use it for a service-specific explanation, diagnostic detail, or approach section with a relevant generated image so service pages do not become text-only.
- This is a fake-business generation test. You may invent plausible business details, positioning, testimonials, proof points, differentiators, and service language when doing so makes the site read like a real, persuasive local business website.
- Do not let claim verification concerns make the site sterile. Content quality, natural flow, and believability matter more than factual auditability for this fictional test.
- If a field or block does not fit the new business, make the best content-only adaptation and document the limitation.
- Do not add secrets, tokens, API keys, or real private data.

## Block usage guidance

Before editing content, read `docs/template-site-blocks.md` and follow the description and content notes for every block type used in the generated pages.

Treat those block notes as authoring rules, especially for image orientation, image aspect ratio, copy length, CTA usage, proof claims, and when a block should or should not be used.

## Real-site writing stance

Write the generated site as a believable public website for the business in the brief.

Customer-facing copy must not mention templates, playgrounds, tests, placeholder safety, fictional status, missing claims, or template constraints. Keep those notes for the final report.

Write like a real local business talking to real homeowners with real problems. The copy should feel specific, confident, conversational, and useful, not like a compliance-safe summary of the brief.

Do not merely restate the content model or service list. Speak to the customer's situation:

- what they are seeing at home
- what they are worried about
- what happens if they wait
- how the business helps them make a decision
- what the next step feels like

Every section should add a new reason, objection, proof point, decision point, or emotional reassurance. Avoid repeating the same idea in different blocks.

Avoid sterile process phrases such as:

- "practical next steps"
- "visible issue"
- "service list"
- "clear scope"
- "roofing conversation"
- "condition review"
- "the current service list includes"
- "before approved work begins"

Use grounded, customer-facing language instead. For example, "If water is staining the ceiling after a storm, we will help you figure out whether it is a small flashing repair, missing shingles, or a roof that is ready to be replaced."

Strong copy is allowed to be persuasive. For this fictional site, you may create plausible claims such as years in business, family ownership, warranties, reviews, emergency availability, financing, service radius, guarantees, crew standards, cleanup practices, or insurance-claim support when they make the site stronger and fit the business.

## Image and logo rules

Images are important to this test, but they must stay compatible with Tina media handling.

The Tina media config uses:

- `publicFolder: public`
- `mediaRoot: media`

Therefore, generated or replaced media assets must live under:

- `apps/playground-site/public/media/**`

Use content references that resolve from the public folder, for example:

- `/media/brand/summit-ridge-roofing-logo.png`
- `/media/roofing/roof-repair.jpg`

Do not place generated site images in:

- `apps/playground-site/src/images/**`
- `apps/playground-site/public/block-previews/**`
- `apps/playground-site/public/media/blog/**`
- `apps/playground-site/public/media/blog/generated/**`

Generate a cohesive set of visible site images, not just a logo. Reusing one generic image across many sections is not a successful test unless the content model gives no other option.

Image reuse should be intentional and limited:

- Default to a unique image for each major page section, especially when the section has its own heading, CTA, audience need, or service angle.
- Generate images for the specific block and copy they support.
- Generate images in an aspect ratio that matches how the block is designed to display them, such as wide hero images for hero slots, square or near-square images for cards, and portrait or vertical images for tall side-image layouts.
- Avoid reusing the same asset in the same page more than once.
- Treat each major image-bearing section as a separate visual job, even when multiple sections are about the same service, topic, or page.
- It is acceptable to reuse a service hero image for a compact navigation card, feature card, or related-service item on a different page when that item is clearly acting as a pointer to the same service page. Do not use this exception for major sections on the page itself. Other than this, avoid reusing images in different pages. Cross-page repetition makes the generated site feel thin.
- Before finishing, scan each generated page for repeated visible image `src` values. Repeated image sources on the same page are a failure unless the repeated field is an explicit desktop/mobile pair for the same block.

## Image completeness rules

Do not rely on component fallback images for visible page imagery. When a visible content field supports an authored image, provide a generated or intentionally selected playground-site media asset with accurate alt text and dimensions.

Use the `imagegen` skill for project-bound site imagery when it is available. The default expectation is realistic, polished bitmap imagery suitable for a professional local business website.

Do not create flat SVG illustration placeholders for hero, service, about, CTA, or logo imagery unless the user explicitly asks for an illustration style. Page imagery and generated logo assets should usually be generated raster images such as `.png`, `.jpg`, or `.webp`.

Image selection should make the site look like a polished real business website:

- use distinct, relevant images for major visible sections when image fields exist
- match each image to the block topic, such as roof repair, replacement, storm damage, inspections, gutters, team/about, and contact
- keep the visual style cohesive across the site
- prefer realistic exterior roofing scenes, close-up roof details, crews at work, ladders/trucks/tools, Denver-area residential context, storm damage details, gutters, and homeowner-facing service moments
- avoid clip-art, flat vectors, generic abstract backgrounds, obvious placeholder illustrations, or imagery that makes the site look like a wireframe
- avoid stale template images from the previous business when they weaken the new site
- avoid filling every image field with the same asset
- preserve accurate alt text for every authored image

Keep image work focused on visible pages and blocks.

Allowed image work:

- create a mock logo for Summit Ridge Roofing
- update the global site logo reference to the mock logo
- create or replace visible hero, service, about, contact, testimonial, FAQ, or CTA block images
- update image references in content files
- update image alt text in content files

Logo requirements:

- Use the `imagegen` skill to create a polished mock logo for Summit Ridge Roofing.
- Generate a complete logo lockup as a transparent PNG, including a simple professional and modern mark suitable for a roofing business and readable name typography.
- Compose the logo as a balanced horizontal lockup. If the mark sits to the left of the wordmark, leave a clear, intentional gap between the mark and text; do not let them feel crowded or nearly touching.
- Size the wordmark so it remains legible at header size and feels proportional to the mark. Avoid tiny wordmark text next to an oversized mark.
- Vertically align the wordmark optically with the mark, usually centered on the mark's visual middle. Do not bottom-align the text to the mark unless the whole lockup still looks intentionally balanced.
- Save it under `apps/playground-site/public/media/brand/`, for example `apps/playground-site/public/media/brand/summit-ridge-roofing-logo.png`.
- Do not hand-author an SVG logo for this generation.
- The PNG must have a transparent background. Do not include a background rectangle, off-white canvas, subtle tint, shadow box, or any other baked-in background.
- Crop the logo PNG tightly to the actual logo artwork. Do not leave vertical negative space above or below the mark or wordmark; the image height should be the full height of the visible logo.
- Verify the PNG has an alpha channel and transparent corners before referencing it.
- Check the final rendered asset visually. The mark should be clean at header size, the text should be legible, spacing should feel balanced, and the logo should sit cleanly on multiple light backgrounds.
- Make it original and suitable for a fake business.
- Update `apps/playground-site/content/global/index.json` so the site logo points to the new PNG mock logo and its `width` and `height` match the actual PNG dimensions.

Image safety rules:

- Do not create or modify blog images.
- Do not edit React components to force image changes.
- If a visible image cannot be replaced through content alone, leave it and report the limitation.

## Blog rule

Blogs are out of scope for this MVP.

Do not:

- create blog posts
- rewrite blog posts
- generate blog images
- replace blog images
- delete blog routes or blog code
- edit blog components
- add a Blog link to navigation
- add a Blog link to the footer
- add blog CTAs
- reference blog content from homepage or service pages

If blog content files already exist, leave them alone unless they are directly referenced from visible navigation/content and can be safely ignored instead.

The active generated site should focus on:

- homepage
- service overview page
- individual service pages appropriate to the generated business, with 2 to 5 realistic services and SEO-friendly slugs that match those services
- about page
- contact page
- testimonials/reviews blocks if present
- FAQ blocks if present
- service areas if present
- clear inquiry/estimate CTAs

## Content direction

Update the site so it feels like the business in the brief.

Prioritize:

- consistent business name
- consistent location
- consistent phone number and email
- service-specific headings and descriptions
- CTA labels that match the business
- CTA button labels, whether primary or secondary, should use sentence case rather than title case.
- In the navbar, use only the formatted business phone number as the secondary action label when a phone number exists. Do not prefix it with "Call", "Call now", or similar text. If no phone number exists, leave the secondary action blank or omit it.
- In larger page CTA sections, phone-based action labels may use fuller sentence-case copy such as `Call (303) 555-0184`.
- SEO titles and descriptions
- navigation and footer links that point to core pages
- image alt text
- persuasive customer-facing copy that sounds like a real local business
- plausible testimonials, reviews, guarantees, credentials, or proof points if testimonial or proof-oriented blocks already exist

Avoid:

- generic filler
- sterile language that sounds like a brief, schema, audit report, or compliance checklist
- repeating the same message across multiple blocks
- over-explaining what the business is "allowed" to say
- defensive language about missing proof
- generic "we provide quality service" copy without concrete texture
- leftover content from the previous template business

When facts are missing, write around them naturally:

- Use supplied address, hours, social profile URLs, and location details.
- You may invent plausible local-market details, service-area language, customer segments, credentials, warranties, cleanup practices, financing, emergency service language, and testimonials for the fake business when it improves the site.
- Keep invented details internally consistent and believable.

## Tina icon rules

Some blocks use the shared Tina Nucleo icon field from
`apps/playground-site/src/components/tina/fields/nucleo-icon.ts`. For those icon
fields, content values must match an approved icon value defined in the active
playground app's `nucleoIconOptions` in:

- `apps/playground-site/src/components/tina/icons/nucleo.tsx`

Before choosing an icon value for one of those blocks, check
`nucleoIconOptions` and use one of the existing `value` strings exactly as
written. The authored content value must be the `value` string, not the icon
label, package export name, keyword, filename, guessed normalized name, or a
nearby synonym.

Examples:

- Use `house7` or `houseModern3`; do not use `house` or `house-7`.
- Use `droplet`; do not use `dropletDrop`, `waterDrop`, or a Nucleo export name.
- Use `calendarCheck`; do not use `calendar-check`.

The optional `keywords` array in `nucleoIconOptions` is only for search in the
Tina picker. Keyword strings are not valid authored content values.

Do not invent icon values in content. Do not choose a new package icon only
because it is a slightly more literal match when an existing approved icon is
reasonable for the label, text, or proof point.

If none of the approved icons clearly fit the specific label, text, or content
the icon is paired with, you may inspect the remaining icons available in the
`nucleo-ui-outline-duo-18` package and choose a better match. If you do that,
you must update both icon registries so the active generated site and reusable
template stay in sync:

- `apps/playground-site/src/components/tina/icons/nucleo.tsx`
- `apps/template-site/src/components/tina/icons/nucleo.tsx`

Import the package icon and add it to `nucleoIconOptions` with a stable
camelCase `value`, readable `label`, and component reference. After that, use
the new `value` string in content.

Keep this exception narrow: do not edit other React components, Tina schemas,
routes, or shared template code just to support icon choices.

## Business brief

Use this brief for the current test:

- Business name: Summit Ridge Roofing
- Niche: Roofing contractor
- Location: Denver, CO
- Phone: `(303) 555-0184`
- Email: `hello@summitridgeroofing.test`
- Website URL: `https://example.com`
- Address:
  - `1847 W 38th Avenue`
  - `Denver, CO 80211`
- Hours:
  - Monday - Friday, 8 AM - 5 PM
  - Saturday, 9 AM - 1 PM
  - Sunday, Closed
- Social profiles:
  - Facebook: `https://www.facebook.com/summitridgeroofing`
  - Instagram: `https://www.instagram.com/summitridgeroofing`
- Primary CTA: `Request an estimate`
- Secondary CTA: `Call (303) 555-0184`
- Services:
  - Roof repair
  - Roof replacement
  - Storm damage repair
  - Roof inspections
  - Gutter installation
- Tone: reliable, practical, local, professional
- Creative stance: prioritize a persuasive, natural, professional website over claim-verification caution. This is a fictional business test, so plausible invented proof and differentiators are allowed.

## After editing

Run lightweight checks that do not require Tina local schema generation.

Do not run Tina schema generation or Tina build commands.

Return:

1. Files changed.
2. What business was created.
3. Whether any forbidden files were edited.
4. Whether any Nucleo icon-registry exception was used.
5. Whether blog content/routes were left dormant.
6. Any old template language that may still remain.
7. Content quality notes, including any sections that still feel generic, repetitive, or unnatural.
8. Image quality notes, including whether generated bitmap imagery was used and whether the logo background is transparent.
9. Any blocks that felt too rigid.
10. Any missing fields or variants.
11. Suggested template improvements.

In the final report, explicitly note any places where the template forced compromises, such as mismatched route slugs, proof-heavy blocks that require invented proof, missing fields, or images that could not be replaced through content alone. Do not put those caveats into the public-facing site copy.
