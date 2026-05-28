# MVP Strategy Research

Findings from the grilling sessions on 2026-05-24 through 2026-05-28. Covers product shape, generation and lifecycle pipeline, application architecture, pricing, and the open risks that still need validation.

The product is an automated agency that rebuilds local-service contractor websites (plumbing, HVAC, electrical, roofing) and pitches the rebuild as a lead magnet — full live Preview Site as cold-outreach payload, conversion to a single subscription. Generation runs in cloud containers (Upstash Box) using existing coding-agent harnesses (Codex / Claude Code) against the Tina CMS Template Site. The Orchestrator owns durable lifecycle state; the coding agent owns only the generated site workspace.

For canonical terminology see [`CONTEXT.md`](../CONTEXT.md).

---

## Product Shape

### Lead magnet: full live Preview, not a screenshot or landing page

Each Prospect gets a fully browsable Preview Site hosted at `{slug}.youragency.com`. The "wow" of the cold outreach depends on the prospect being able to *click around* a working version of their site — not a screenshot, not a landing page, not a video walkthrough. Landing-page-only is too easy to dismiss as a mockup.

The Preview's Tina admin route is open access for the MVP. This is a consciously accepted tail-risk: cert transparency logs leak the subdomain inventory, and a competitor could in principle edit a Preview to damage a Prospect's reputation. Mitigation is one line of code (a one-time per-site code in the cold-email URL gating `/admin`) and can be added later if abuse materializes. At MVP volumes, the risk is small.

### Provisioning: eager full-stack at generation time

Every generation produces a complete operating stack: GitHub repo + Vercel project + Tina Cloud project + live custom subdomain. The cold-email link resolves to a working site instantly. Lazy ("deploy on first click") was rejected — the 60–120s deploy wait at first-click bounces the most attention-precious moment of the funnel. The wasted-infra cost of unclicked previews is small (a paused project costs nothing); the wasted-attention cost of a slow first click is enormous.

### URL: wildcard subdomain of the agency domain

Wildcard CNAME (`*.youragency.com`) points at Vercel, while `youragency.com` and `www.youragency.com` stay reserved for the agency's own public web presence. Each generated Preview Site gets a Vercel custom domain assigned via the Vercel API. Random `vercel.app` URLs read as spam in cold email; branded subdomains read as a real pitch. Migration to in-house hosting later is DNS-only.

The `.preview` namespace was dropped from the Prospect-facing URL because `acme-plumbing.youragency.com` is cleaner and more recognizable in cold outreach than `acme-plumbing.preview.youragency.com`. The trade-off is that Preview Site slugs now share namespace with agency-owned subdomains, so the Orchestrator needs a reserved-slug blocklist such as `www`, `app`, `ops`, `admin`, `api`, `mail`, `billing`, `support`, `status`, `preview`, and `migrate`.

Slug generation is business-name-first. Market is used only for collision or ambiguity:

- `Acme Plumbing` → `acme-plumbing.youragency.com`
- `Acme Plumbing` in Austin, if needed → `acme-plumbing-austin.youragency.com`

This keeps the cold-email URL short while preserving a path for duplicate business names.

### Trigger mode: outbound mass for MVP, self-serve later

Cold-email-driven outbound for the first 90 days. No public form, no signup flow, no captcha — generations are kicked off from a scraped list, the Prospect's first touchpoint is the email. Self-serve (ad-driven landing page → form → site) is the v2 expansion once outbound is validated.

The implication: there is no customer-facing dashboard, signup flow, or onboarding UI in the MVP. The Customer Portal becomes useful later for billing, account, and subscription management.

---

## Conversion Flow

The path from "Prospect clicks the email CTA" to Customer relationship and paid subscription. Modeled as a SaaS funnel (Shopify/Wix/Squarespace mental model), not as an agency sales process. The conversion event from Prospect to Customer is the **Migration** — the moment the Prospect's real domain resolves to the site — not a button click, payment, or a signed contract. Payment and Free Trial state are tracked separately.

### Funnel shape: two CTAs on the Preview Site

Hybrid by deliberate design. The Preview Site exposes two parallel paths to Migration:

- **"Make this site mine"** → Self-Serve Migration wizard with registrar-specific written instructions.
- **"Book a 15-min call"** → Cal.com booking page for a Concierge Migration (guided Zoom screen share).

The split exists because Shopify/Wix/Squarespace conditioned this audience to expect a self-serve option, while contractor demographics also include people who'd rather have a human walk them through anything technical. Neither path forces a sales conversation; the call is a *technical assist*, not a close.

### Migration mechanic: A/CNAME record additions, not nameserver delegation

The Prospect keeps their nameservers at their existing registrar. Two records get added:

- `A` record for the apex → Vercel's apex IP (`76.76.21.21`)
- `CNAME` for `www` → `cname.vercel-dns.com`

**Email (MX records) is structurally untouched.** This is the critical safety property: with A/CNAME we are *physically incapable* of breaking the Prospect's business email because we never modify MX records. For a contractor whose lead flow depends on `info@theirdomain.com`, an email outage is a worse failure than no migration at all.

Nameserver delegation (Wix's model) was considered and rejected. It would require us to scrape and replicate the Prospect's existing MX records before flipping nameservers, with one missed record breaking email silently. Wix mitigates with an email-provider preset wizard ("What email service do you use?"); their forums still show steady email-breakage tickets. Shopify, Squarespace, and Webflow all default to A/CNAME for this reason. Nameserver delegation becomes interesting later as a "we manage your DNS" upsell once we have volume and operational maturity to safely replicate MX records.

### Concierge path: guided screen share on Zoom (Phase 1)

The first 5–10 Migrations are guided Zoom calls, not delegated registrar access. Treat it as a *learning phase*, not the long-term operational pattern. Pair-debugging on a synchronous call surfaces 10x more insight than async work — every registrar's quirks, every customer's panic-points, every variation in DNS UIs.

Tooling: **Cal.com for booking + Zoom for the call.** Both have free tiers that cover MVP volumes. Zoom in particular is recognizable to contractors and supports both screen-sharing and (escape hatch) remote control.

Default interaction model: **customer drives, operator guides.** Customer screen-shares, operator instructs verbally ("click DNS settings… now click Add Record…"). Customer enters the A/CNAME values themselves; operator verifies before each save. This keeps the customer's registrar credentials private, builds trust through visibility, and teaches them what's happening. Remote control reserved as an escape hatch for the ~20% of calls where a particularly user-hostile registrar UI (looking at you, GoDaddy) makes a specific micro-step infeasible to talk someone through.

Pre-call prep (automated, 24h before):

- Run `whois acmeplumbing.com` to identify the registrar — so when the customer says "I have no idea where I bought this domain," the operator already knows.
- Send a reminder email: "Have your domain registrar login ready. Laptop or desktop, not phone."

Failure modes to plan for: forgotten registrar login (~40% of calls, mitigated by `whois` + password-reset walkthrough), "my web guy controls everything" (~15%, reschedule), email-breakage panic (~30%, show them their MX records will be untouched), DNS propagation delay (~25%, hop off and email when verified).

**Phase 2 (after 10+ Migrations, ~Customer 10+):** Introduce delegated registrar access (GoDaddy Delegate Access and equivalents) as the default for supported registrars, with screen share as fallback. Don't commit to this pattern before having actually done Phase 1 — the operational tooling needs to be informed by what was hard.

### Self-Serve path: written instructions per registrar

A wizard at `/migrate/{slug}` with registrar-detection (via `whois`) and registrar-specific step-by-step instructions for adding the A and CNAME records. Vercel maintains good documentation for every major registrar; we crib from theirs.

The wizard polls Vercel's `/v9/projects/{id}/domains/{domain}` endpoint for verification. On success, the standard post-Migration sequence fires (see Free Trial below).

### Post-Migration ownership: agency holds the stack (SaaS model)

After Migration, the Customer owns:

- The **domain** (always did — A/CNAME means the registrar account was never transferred).
- **Tina-edited content** they create going forward.

The agency holds:

- The **GitHub repo** in the agency org.
- The **Vercel project** in the agency team.
- The **Tina Cloud project** in the agency account.

The Customer interacts with their site through the Tina editor only — they never see GitHub or Vercel. This is the Shopify/Squarespace/Wix model: customers don't want a codebase, they want a website that works.

Cancel = we pause the Vercel project and Sunset (see below); their domain still belongs to them, they can repoint DNS to anywhere else at any time.

A one-time repo export on cancellation (Webflow-style escape hatch) is parked as a later enhancement — half a day of work, addable in response to a specific customer objection. Don't pre-build it.

### Free Trial: 30 days, no card collected, Sunset on non-payment

Migration completion triggers a **30-day Free Trial**. No payment information is collected at Migration. The Customer Site is live at the Customer's real domain throughout the trial.

The trust calculus drove this choice over card-on-file-with-auto-charge. As a new brand the Prospect has never heard of, asking for a card *before* they've seen the site live on their real domain reads as "too good to be true" — a scam signal, not a SaaS signal. A free month with no card required is a strong, expensive-to-fake trust signal that explicitly outweighs the collection risk for this stage.

Migration itself is a strong commitment filter: anyone who does the DNS work is much more likely to convert than someone who just clicked a CTA. The Migrated → Paid conversion rate is expected to be high enough that the collection problem stays small in absolute terms. Marginal cost during trial is small (~$1–5/Customer/month on Vercel Pro + Tina Cloud free/paid tier).

**Dunning sequence** in the last 5 days of trial: automated email cadence reminding the Customer the trial is ending, with the Stripe Checkout link to add a card. At trial end:

- **Card added → subscription starts.** $99/mo recurring billing begins.
- **No card → site is Sunsetted.** Custom domain is moved (via Vercel API) from the Customer's project to a shared agency "sunset" Vercel project that serves a generic maintenance page. The Customer's project stays paused with all content preserved; reactivation reverses the domain assignment.

**The "point DNS back" escape valve is both an operational mechanic and a marketing pitch line.** *"Use it free for a month. If you don't love it, just point your DNS back to your old hosting. We're confident enough not to lock you in."* Implementation: we could optionally capture the Customer's original A/CNAME records during Migration so the dunning emails can include "to revert, set your A record back to X and your CNAME back to Y."

Founding Customers (first 3–5) are governed by a separate 6-month free contract, not the standard 30-day Trial. Same mechanics, longer fuse.

### Customer Site admin: authenticated `/admin`, email magic link

Preview Site `/admin` is open (existing decision, accepted tail-risk for low Preview stakes). **Customer Site `/admin` is not** — the consequence of an outsider editing a Customer's live business website is much higher than editing a Preview.

At Migration completion, an automated sequence:

1. Tina Cloud project's auth flips from open to editorial workflow.
2. The Customer's email (collected during Migration — Cal.com booking email for Concierge, wizard input for Self-Serve) is added as a whitelisted editor.
3. A welcome email is sent: "Edit your site at `acmeplumbing.com/admin`. Log in with [your email]" (Tina Cloud sends the magic link on login attempt).

Tina-native `/admin` at the Customer's own domain is the standard Tina pattern — no custom routing, no CORS gymnastics, lowest implementation friction. A separate `editor.youragency.com` was considered (Shopify-style) but fights Tina's design grain and adds maintenance friction every time Tina ships a feature.

### Preview URL after Migration: 301 redirect

`{slug}.youragency.com` is configured as a permanent 301 redirect to the Customer's real domain at Migration completion. This:

- Cleans up the security concern of a shadow site with stale auth state.
- Handles anyone who bookmarked the preview link.
- Costs nothing — a few lines of Vercel config.

---

## Generation Pipeline

### Generation Brief: minimal operator intent, not a validation contract

The Orchestrator starts a Generated Site from a Generation Brief:

```json
{
  "businessName": "Acme Plumbing",
  "sourceUrl": "https://acmeplumbing.com",
  "niche": "plumbing",
  "market": "Austin, TX"
}
```

The Source URL remains the agent's primary evidence for identity, services, phone/address, brand cues, and service-area details. The additional fields are not meant to override the Source URL; they give the agent enough intent to avoid ambiguous scraping and to aim the pitch at the correct local market.

`market` deliberately replaced `city`. A Prospect may operate across a metro, county, or multi-city service area, and the Preview Site should be pitched into the primary market without pretending that market is the whole service area.

### No deterministic preflight gates for MVP

The earlier preflight idea included checks like "rendered page mentions the company name," "niche keywords are present," and "city matches." That is too much orchestration for the MVP. These checks are brittle, slow to tune, and duplicate the actual quality gate: human review of the rendered Preview Site before outreach.

MVP position:

- The Generation Brief is context for the agent, not a deterministic validation contract.
- The Orchestrator should not reject a generation because it failed a niche/city/company-name text check.
- A cheap Source URL reachability check is acceptable as operator ergonomics, but URL failure can also simply become a Generation Run failure.
- Generation quality is judged by the rendered Preview Site, not by a machine-scored intermediate brief.

This keeps the Orchestrator small and leaves quality iteration in the prompt/template/human-review loop.

### Extraction: hand URL directly to the agent, with two arms in parallel

Selected approach for the initial implementation: Generation Brief → coding agent, agent decides what to read and how deep. The agent can call Firecrawl as a tool for HTML→markdown conversion. The argument for this over a deterministic pre-extraction step is that it minimizes pipeline code and lets the agent's judgment drive content depth, which matches the "use the cheap powerful harness, write less code" thesis.

Quality is gated by **post-generation visual review of the live Preview before the email is sent** — not by intermediate brief review. The brief tells you less than the rendered site; if the site looks good, the brief was good enough.

**A/B test planned for early validation.** Two arms:

- **Arm 1 (orchestrator-driven):** Firecrawl scrapes the Source URL up-front, passes structured markdown to the agent, agent generates from that input.
- **Arm 2 (agent-driven):** Agent receives the Generation Brief plus Firecrawl as a tool, decides what subpages to read and how deep.

Test rig:

- 5–8 fixed Source URLs spread across the four niches and across "good / mediocre / dumpster fire."
- Same harness on both sides (don't compare Codex-Arm-1 against Claude-Code-Arm-2).
- Same Firecrawl as page-rendering tool on both sides (so the variable being tested is *who decides what to extract*, not extraction quality itself).
- Rubric: name/phone/address accuracy, service-list completeness, copy specificity (cites real proof points from source), invented-fact rate, total runtime cost.

The rubric itself becomes a reusable generation-quality check for ongoing operations, but not an MVP orchestrator gate.

### Orchestrator boundary

The Orchestrator owns lifecycle state and external side effects. The coding agent owns only the Generated Site workspace.

Orchestrator responsibilities:

- create the Generated Site record
- create or reuse the Generated Site GitHub repo
- create Generation Runs
- start generation compute
- write the Generation Brief input artifact
- validate the agent's result artifact shape
- record state in SQLite
- call GitHub, Vercel, Tina Cloud, email, Migration, Trial, Archive, and Sunset actions as those features exist

Coding-agent responsibilities:

- read the Source URL
- edit content/config/media inside the Generated Site repo
- run local checks/builds if available
- write a structured generation result artifact
- leave lifecycle decisions to the Orchestrator

The agent should not write directly to SQLite and should not independently mark sites reviewed, emailed, migrated, archived, or sunset.

### Agent handoff contract

Use the filesystem as the handoff boundary between the Orchestrator and coding agent, then persist accepted state into SQLite.

Workspace shape:

```text
runs/{slug}/
  input/generation-brief.json
  output/generation-result.json
  site/
```

The Orchestrator writes `generation-brief.json`. The agent writes `generation-result.json`, including a `schemaVersion`, status, summary, changed paths, source notes, and review notes. The Orchestrator validates the result JSON against a schema before storing it on the Generation Run.

Important distinction:

- The file is the handoff contract.
- SQLite is the durable system of record.
- Schema validation proves only that the agent returned machine-readable output; it does not prove the generated site is good.

### Durable state model

Use SQLite for the MVP Orchestrator state store rather than JSON. It is still a single local file, but it gives atomic updates and direct querying for "failed runs," "previews waiting for review," and "emailed sites not migrated."

Recommended MVP tables:

```text
generated_sites
- id
- slug
- business_name
- source_url
- niche
- market
- status
- repo_url
- vercel_project_id
- tina_project_id
- preview_url
- published_generation_run_id
- initial_outreach_sent_at
- created_at
- updated_at

generation_runs
- id
- generated_site_id
- run_number
- status
- retry_reason
- previous_site_status
- branch_name
- workspace_path
- candidate_url
- vercel_deployment_id
- brief_json
- result_json
- error
- promoted_at
- promotion_error
- started_at
- completed_at

generated_site_events
- id
- generated_site_id
- type
- reason
- metadata_json
- created_at
```

`generated_sites.status` is the current lifecycle state for easy querying. `generated_site_events` is the append-only history for timestamps, reasons, and metadata such as which Generation Run was reviewed or promoted. This avoids adding a new nullable timestamp column for every lifecycle transition while keeping the current state cheap to query.

Keep `initial_outreach_sent_at` as a direct column even though an `emailed` event also exists. It protects an operational invariant: the initial outreach email should never be sent twice automatically, especially after post-email retries.

No `generation_run_events` table is needed for MVP. Generation Runs are the technical attempt history; step-level timing like "clone started" or "build started" can stay in logs.

### Generated Site statuses

Initial MVP statuses:

```text
generating
generation_failed
preview_ready
reviewed
emailed
migrated
archived
sunset
```

Meanings:

- `generating`: initial generation is active and no usable Preview Site exists yet.
- `generation_failed`: the latest initial Generation Run failed before a usable Preview Site existed.
- `preview_ready`: the stable Preview Site URL resolves and is waiting for human review.
- `reviewed`: an operator approved the currently promoted Generation Run for outreach.
- `emailed`: initial outreach containing the Preview Site link has been sent.
- `migrated`: the Prospect's real domain points to the Generated Site; this is the Preview Site → Customer Site conversion event.
- `archived`: an unconverted Preview Site has been retired before Migration.
- `sunset`: a Customer Site has been taken offline after Migration, usually for non-payment or cancellation.

There is no `created` status for MVP. If future batch import or scheduling creates records before generation starts, add `queued` then. Until that exists, the first status is `generating`.

`archived` is the pre-Migration terminal status. `sunset` is the post-Migration terminal status. Do not use `sunset` for stale Previews.

Status changes should go through a single Orchestrator transition function that:

1. loads the current status
2. checks the transition map
3. updates `generated_sites.status`
4. inserts a `generated_site_events` row
5. applies special invariants such as `initial_outreach_sent_at`

This keeps the current status and event history from drifting.

### GitHub and Vercel model

Use one GitHub repo per Generated Site. Create the repo before generation starts; the repo is the Generated Site's durable identity, while the local workspace is only a temporary checkout used by a Generation Run. Each Generation Run gets its own branch:

```text
repo: acme-plumbing
  main
  generation/run-001
  generation/run-002
```

Vercel Git integration maps this cleanly:

- pushes to `generation/run-*` produce Vercel Preview deployments with internal candidate URLs
- pushes to `main` produce Production deployments
- `{slug}.youragency.com` points at the latest successful Production deployment

Store:

```text
generation_runs.candidate_url
generated_sites.preview_url
generated_sites.published_generation_run_id
```

`candidate_url` is the internal per-run URL used for operator inspection. `preview_url` is the stable Prospect-facing URL, usually `https://{slug}.youragency.com`. `published_generation_run_id` answers which successful run currently backs that stable URL.

### Promotion

Promotion is the act of making a successful Generation Run the version that backs the stable Preview Site.

First successful run:

```text
Generation Run 1 succeeds
→ auto-promote Run 1 to main
→ Vercel production deploy succeeds
→ {slug}.youragency.com serves Run 1
→ generated_sites.status = preview_ready
→ published_generation_run_id = Run 1
```

Later runs:

```text
Generation Run 2 succeeds
→ Run 2 has candidate_url
→ stable Preview URL still serves Run 1
→ operator promotes Run 2
→ main is replaced with Run 2
→ Vercel production deploy succeeds
→ stable Preview URL now serves Run 2
→ published_generation_run_id = Run 2
```

The Orchestrator should update `published_generation_run_id` only after the production Vercel deployment succeeds and the stable Preview URL is verified. If promotion fails, record the failure on the Generation Run and leave the currently published run intact.

Promotion should make `main` exactly match the selected successful Generation Run. PR review is unnecessary for MVP because the real review artifact is the rendered site, not a code diff. Since these repos are generated outputs owned by the Orchestrator, replacing `main` with the selected run tree is acceptable.

Review applies to the currently promoted run. If a new run is promoted while the site is `reviewed`, reset status to `preview_ready` because the old human review no longer applies. If a new run is promoted after the site is `emailed`, keep status `emailed` because initial outreach already happened; do not send the initial outreach again.

### Retry model

A Retry creates a new Generation Run for the same Generated Site. It does not create a second Generated Site, does not create a second Preview Site, and is not the A/B variant model. A/B variants are a separate future feature.

If a Generation Run fails after the Generated Site repo exists, keep the repo and mark the Generated Site `generation_failed`. Do not automatically delete the repo, Vercel project, Tina project, or SQLite row as part of failure handling; deletion or Archive should be a deliberate operator action. Keeping the durable identity avoids slug reuse ambiguity, disappearing external IDs, and unclear Retry semantics.

Retry rules:

- every Retry requires a retry reason
- every Retry starts from a clean Template Site baseline, not the previous failed output
- every Retry gets its own branch and candidate deployment
- old Generation Run rows are retained
- no extra Generation Run event table is needed
- already-emailed sites can be retried, but the Orchestrator must not resend initial outreach automatically

Initial retry reasons can be loose strings or a simple enum:

```text
technical_failure
quality_retry
source_correction
prompt_experiment
post_email_fix
```

### Bootstrap: GitHub Template Repository

`apps/template-site/` gets extracted into its own GitHub repo marked as a template. The Orchestrator's bootstrap step is one API call: `POST /repos/{owner}/{template}/generate` → a new repo per Prospect. The Orchestrator clones the new repo into the run workspace, creates the `generation/run-N` branch, and hands the workspace to the agent. This intentionally creates repos before knowing whether generation will succeed; a failed generation is still easier to inspect and retry when its durable Generated Site identity already exists.

Implication for the codebase: the existing `apps/playground-site` target assumption in `prompts/create-playground-site.md` needs to become a parameter — target path is passed at runtime, not hardcoded.

### Runtime: Upstash Box (with thin-adapter caveat)

Each generation runs in an Upstash Box — a managed Docker container per job, with Claude Code and Codex pre-installed. Why Box specifically:

- Pre-installed harnesses (zero install pain).
- Per-job isolation by default (one bad run can't corrupt another).
- Pause-on-idle billing matches bursty workloads ($0.10/active CPU hour; ~$0.008/run at 5 min).
- Filesystem persists across pause — failed runs remain inspectable via SSH (matches the "retain on failure" workspace pattern).
- Free tier (10 concurrent boxes, 5 CPU hours/month) covers MVP volumes entirely.
- Decouples generation compute from the user's Mac.

**Risk: Upstash Box is in developer preview.** Pricing and API may change. Mitigation: wrap Box behind a thin `runGeneration(slug, brief)` adapter so swapping to Fly.io Machines, Modal, or self-hosted Docker later is a single-file change. Avoid architecturally depending on Box-specific features (Zod response schemas, snapshots, keep-alive billing).

**Highest-priority validation step:** confirm Codex's image-generation tool works inside an Upstash Box. The docs don't address this and image generation is the killer feature. A 30-minute spike against a trimmed-down version of the existing prompt should answer this before any infrastructure commitment.

### Execution sequencing

The Orchestrator location evolves independently of the generation environment:

1. **Phase 1:** Orchestrator on Mac, manually invoked, generations in Box.
2. **Phase 2:** Orchestrator on Mac, queue-driven (CSV in → batch out), generations in Box.
3. **Phase 3:** Orchestrator on a small cloud VM or Mac mini, queue + cron-driven, generations still in Box.

Each transition is hours of work, not days, because the Box adapter and Orchestrator state model do not change.

### Workspace lifecycle

`./runs/{slug}/` is the MVP generation workspace pattern, gitignored from the Orchestrator repo. Keep it inside the agency monorepo for simple local debugging and straightforward `workspace_path` values in SQLite; if the Orchestrator later moves to a different host or disk layout, make the workspace root configurable behind `AGENT_STUDIO_RUNS_DIR`.

- **On success:** branch pushed, result persisted, deployment data stored, local directory can be removed unless `--keep` is set.
- **On failure at any step:** retain the directory. The agent's half-finished output is the most informative thing about what went wrong.
- **On Retry:** create a fresh workspace from the clean Template Site baseline.
- `--keep` flag for development to always retain.
- Orchestrator startup should fail fast if `./runs/` is not ignored by the agency monorepo. Generated Site repos are nested Git repos only as temporary workspaces; they must never be tracked as agency-monorepo files, submodules, or gitlinks.

Local clones are cache and debugging artifacts, not the durable system of record.

### First implementation milestone

The first Orchestrator implementation should stop at **Preview Site ready for human review**.

In scope:

- create Generated Site record
- create repo from Template Site
- run first Generation Run
- validate result artifact shape
- build site
- push run branch
- create candidate deployment
- auto-promote the first successful run
- attach stable Preview URL
- store state in SQLite

Out of scope for the first milestone:

- send outreach email
- implement Migration
- implement Trial billing
- implement Sunset mechanics
- build the Operator Console UI
- build the Customer Portal

---

## Application Architecture

### Logical ownership

Keep the architectural boundaries separate even if the implementation starts small.

```text
Template Site
- reusable website substrate
- copied/generated into customer repos

Orchestrator
- owns Generated Sites, Generation Runs, Promotion, lifecycle transitions, and external side effects
- starts as CLI + SQLite
- later becomes the backend used by internal UI and jobs

Operator Console
- internal UI for agency operators
- lists Generated Sites and Generation Runs
- starts retries, promotes runs, marks reviewed, archives sites, and later handles Migration/Sunset operations
- calls Orchestrator capabilities instead of duplicating lifecycle rules

Customer Portal
- customer-facing account and billing app
- handles subscription/trial/account concerns when those exist
- may read limited Customer Site state, but should not expose generation/promotion internals

Marketing Site
- public agency homepage
- trust surface for cold email recipients who manually visit the agency domain
```

The Operator Console replaces the earlier fuzzy "Backstore" phrasing. It is not the Orchestrator; it is a client of the Orchestrator.

### Monorepo, separate deployed apps

Recommended eventual code shape:

```text
apps/
  template-site/
  orchestrator/
  operator-console/
  customer-portal/
  marketing-site/

packages/
  db/
  orchestrator-core/
  ui/
```

This is a modular monolith, not microservices. The apps can share packages and a database, but each audience gets its own web boundary:

```text
youragency.com          marketing
www.youragency.com      marketing
ops.youragency.com      Operator Console
app.youragency.com      Customer Portal
{slug}.youragency.com   Preview Sites / post-Migration redirects
```

Why not one big Next.js app? One app is faster initially, but it mixes public marketing, customer auth, and internal operator permissions in a single trust boundary. Separate Next.js apps have more setup, but cleaner auth, env vars, domains, deploy history, and accidental-exposure risk.

### Vercel deployment for monorepo apps

Use one GitHub monorepo for the agency codebase, but create separate Vercel Projects from the same repo:

```text
Vercel Project: agency-marketing
Root Directory: apps/marketing-site
Domains: youragency.com, www.youragency.com

Vercel Project: agency-ops
Root Directory: apps/operator-console
Domain: ops.youragency.com

Vercel Project: agency-app
Root Directory: apps/customer-portal
Domain: app.youragency.com
```

Vercel's Root Directory setting tells each project which app to build. A commit to the monorepo may trigger multiple projects; for MVP this is fine. Later, use Vercel's ignored build step / monorepo skipping so unrelated app changes do not rebuild everything.

Generated customer sites are different from the agency monorepo. Each Generated Site still gets its own GitHub repo and Vercel project created from the Template Site.

### Implementation sequence

Do not build all apps at once.

1. **Now:** `apps/template-site` and `apps/orchestrator`.
2. **First UI:** `apps/operator-console`, because the operator needs to inspect Generated Sites/Runs and manually promote/review/archive.
3. **Later:** `apps/customer-portal`, once billing, account, and trial management become real.
4. **Marketing:** `apps/marketing-site` when the agency apex needs to look credible. The apex should be reserved even before the site is sophisticated.

The key rule: lifecycle transitions live in Orchestrator code. Web apps call that code; they do not invent their own status mutation paths.

---

## Pricing & Business Model

### Founding Customer phase

The first 3–5 customers receive the service free for a fixed period (recommend 6 months) in exchange for:

1. Written testimonial usable on the site and in cold email.
2. Logo + city rights.
3. A 15-minute recorded reference call.
4. Google review on agency business profile.

These should be chosen *deliberately* (one per niche if possible — one HVAC, one plumber, one roofer, one electrician — so each niche has its own testimonial), and the agreement should include explicit transition language: "free for 6 months, then $Y/month unless cancelled." Don't renegotiate later.

### Subscription model: single tier, $99/mo, no setup fee

**Single tier. $99/mo. No setup fee.** The original three-tier model with setup fees and 12-month credits was dropped after surfacing a structural conflict with the Preview-Site-first flow.

**Why tiers were dropped:**

The original tiers had content-differentiating entitlements (Starter 3 pages / Pro 5–7 / Premium unlimited). But the Preview Site is generated *before* any tier choice exists — it has to be impressive to be a viable lead magnet. That forces an impossible choice at generation time:

- Generate at Starter level → Preview is less impressive, fewer wow moments.
- Generate at Pro+ → if the Customer later picks Starter, we'd have to delete pages from their live site. NPS-toxic.

There's no clean "when do they choose?" moment because the tiers were designed for the inverted flow (customer signs up → we build to their tier). Our flow goes the other way (we build the wow site → customer signs up to keep it).

Single tier resolves the conflict and defers tier design until we have real signal on which features command premium pricing. Service-only tiers (same content, different SLAs/edit allowances) were considered as a middle ground but rejected for MVP — we have zero data on which service features Customers value at higher price points; any tier design today is a guess.

**Why no setup fee:**

In the original model, setup fees ($299/$499/$999) were justified as tire-kicker filters and commitment signals. In the Free Trial model, **Migration itself is the commitment filter** — anyone who does the DNS work is committed enough. Charging $499 at trial end on top of the monthly creates a sticker-shock cliff that would kill conversion. Just charge the monthly.

**Economics:**

- $99/mo × 12 = $1,188/year, materially identical to the original blended ARPU estimate ($1,180).
- Anchored above DIY ($15–40), comparable to managed basic ($95–250), clearly below marketing-bundle agencies ($300+).
- One number simplifies the cold-email pitch and removes any decoy-tier complexity from the funnel.

**Optional sweetener (deferred):** first 50 paying Customers locked at $79/mo for life ("founding price"). Creates urgency, gives a public story for the eventual price increase, and gives early adopters a real anchor. Not committing yet — decision deferred until we've seen real cold-email response rates at $99.

**Tiers can be reintroduced** once 20–30 Customers have generated signal on which features command premium pricing. Start simple, expand later. Migrating one-tier → three-tier is easy; the reverse is painful (grandfathering, change communication).

### Displaced Spend by cohort

The pricing conversation isn't "is $99 fair for a website" — it's "is $99 worth switching from what you're already paying." Six cohorts, each requiring different pitch language:

| Cohort | What they use today | Typical $/mo | Pitch framing |
|---|---|---|---|
| **A. DIY-builder** | Wix Core, Squarespace Business, GoDaddy mid | $15–$40 | "Your Wix template is 2019. Ours is faster, modern, ranks better." (Premium framing — you're MORE expensive.) |
| **B. Local web shop / freelancer** | Custom WP + shared hosting (Bluehost, SiteGround) | $30–$100 | "Your old web guy disappeared. Same cost, actually modern, someone answers email." |
| **C. Field-service software bundle** | ServiceTitan, Housecall Pro, Jobber | $245–$398/tech + $200–$2,000 marketing add-on | Hard to dislodge — bundled with ops. Skip in MVP unless site is an active liability. |
| **D. Contractor marketing agency** | Townsquare, Thryv, Hibu | $300–$760 | "You're paying 3–5x. Here's the same site for $99." (Discount framing — easiest close.) |
| **E. Reseller agency on GoHighLevel** | Local agency white-labeling GHL | $200–$500 | Similar to D. You save them money and own the relationship. |
| **F. Enterprise marketing agency** | Scorpion, Blue Corona | $2,500–$8,000+ | Not the MVP target. Procurement, multi-location, franchise. |

**Strategic implication for outbound list building:** weight first batches toward A, B, and D. C is locked in by ops software. E is hard to identify from the outside. F is the wrong scale.

### Competitive pricing matrix (research findings)

Done-for-you contractor-focused services:

- UENI: $24.99/mo + $79 setup. (Bare-bones, more like assisted DIY.)
- Notion Design Group basic: $95/mo hosting + maintenance.
- Notion Design Group premium: $250/mo with unlimited edits.
- Most US done-for-you range: $100–$300/mo.

Bundled marketing-and-website services (not the MVP offer, but in the comparison set):

- Townsquare Interactive: $300–$500/mo.
- Thryv: $456 (Essential) to $761 (Ultimate).
- Scorpion: $2,500–$8,000+/mo (enterprise, multi-location).

DIY builders (the cohort A displacement set):

- Wix: $17 (Light) / $29 (Core) / $39 (Business) / $159 (Elite).
- Squarespace: $16 / $23 / $39 / $99.
- GoDaddy: $9.99 / $14.99.

Field-service platforms (cohort C):

- ServiceTitan: $245–$398/tech/month base, Marketing Pro add-on $200–$2,000+/month.

Agency platforms (cohort E backend):

- GoHighLevel: $97 Starter / $297 Unlimited / $497 SaaS Pro. (Resellers typically mark up 2–3x to contractor.)

One-time professional contractor site (the alternative model not chosen):

- Industry baseline: $995–$2,500 upfront.

The $99/mo Pro anchor sits cleanly: above DIY (you're done-for-them, they're not), comparable to basic managed plans, and a clear discount vs marketing-bundle agencies.

---

## Targeting Strategy

### Single niche × single Market for the first batch

Recommendation: pick one niche and one Market, generate 5–20 Preview Sites for that combination, get 3–5 Founding Customers, only then expand to a second niche in the same Market or a second Market for the same niche. Reasoning:

- Cold email copy is hyper-specific ("we work with roofers in Denver") — highest open and reply rate.
- Testimonials compound twice (same niche AND same Market) — a Denver roofer is far more likely to trust a Denver roofer's quote than an out-of-state one.
- Template, prompts, image library, and icon set can be tuned per niche before generalizing — one well-tuned niche-and-Market template wins more than four mediocre ones.
- Bounds first-month work — generating 50 previews for one slice is testable in days; trying to do four niches in parallel diffuses attention.

### Picking the first niche × Market

Decision deferred. Heuristic:

- **High average ticket** (roofing > HVAC > plumbing > electrical).
- **Visible-pain market** (many local competitors with objectively bad sites — easy to identify scrapeable list).
- **Personal angle** (you live there, know someone, have existing network) — first 5 sales are hard without it.

Default if no personal angle: roofers in a sun-belt metro Market (Phoenix, Tampa, Dallas, Denver) — high ticket, lots of storm activity, lots of competitors, dated sites.

### Niche-specific template considerations

The template needs per-niche tuning to avoid generic-everywhere mediocrity. Variables to tune:

- **Service categories** — plumbing (emergency / drain / water heater / repipe), HVAC (install / repair / maintenance / tune-up), electrical (panel / wiring / lighting / EV charger), roofing (repair / replacement / storm / inspection). Generic service lists produce sterile copy.
- **Icon set** — droplets for plumbing, bolts for electrical, wind/thermometer for HVAC, house for roofing. The `nucleoIconOptions` registry needs all four sets available, with the agent picking from the appropriate cluster.
- **Image generation prompts** — niche-specific scene prompts. "Plumber under a sink" is a different scene from "roofer on a roof." Per-niche prompt scaffolding lifts visible quality noticeably.
- **Copy tone defaults** — emergency-heavy for plumbing/electrical (24/7 leak, no power); maintenance-heavy for HVAC (tune-ups, filter changes); damage-and-insurance heavy for roofing (storm claims, inspections).

---

## Risk Register & Validation Steps

Things to validate before committing infrastructure:

1. **[Highest priority] Codex image generation inside an Upstash Box.** 30-min spike: create a Box, run Codex with a trimmed prompt, verify images get generated. If it fails, Upstash Box is out and the orchestrator falls back to local Mac execution.
2. **Extraction A/B test.** Two arms (orchestrator-driven Firecrawl vs agent-driven extraction), 5–8 fixed URLs across niches, structured rubric. Run before standardizing the pipeline.
3. **GitHub API repo-creation rate limits.** Confirm headroom for batch generations (~100 repo creations/hour ceiling, IIRC). Unlikely to bite MVP, worth knowing.
4. **Vercel Hobby project cap (100).** Bites quickly at outbound-mass scale. Plan to upgrade to Pro when approaching cap.
5. **Tina Cloud free tier limits.** 2 editors per project is fine; confirm project-count limits per agency account.
6. **Template versioning.** When the template ships a new block or bug fix, all live Customer Sites stay frozen on whatever snapshot they were generated from. Tina-edited content is preserved, but template improvements don't propagate. Not an MVP problem — becomes real around 50+ Customer Sites. Punt for now.
7. **Outbound deliverability.** Cold email volume from a new domain triggers deliverability issues fast. Use a separate sending domain, warm it up, watch DMARC/SPF. Out of scope for `agent_studio` codebase but in scope for the business.
8. **Founding Customer agreement.** Have a one-pager template ready before pitching the first one. Sets expectations both ways.

---

## Open Questions (Unresolved Branches)

Items not yet decided at the time of this writing:

- **First niche × market pick.** Heuristic agreed, specific choice pending.
- **Outbound infrastructure scope.** Is list scraping + cold email automation part of `agent_studio` the codebase, or external SaaS tools (Apollo, Instantly, Smartlead) wired up via webhooks?
- **Exact Orchestrator implementation details.** CLI framework, ORM/migration tool, logging shape, and command names. The lifecycle model is decided; the code-level tooling is not.
- **Operator Console auth and UI scope.** Separate app boundary is decided; exact auth provider, route structure, and first screen are not.
- **Customer Portal scope.** Separate future app boundary is decided; exact billing/account features wait until billing exists.
- **Founding Customer agreement specifics.** One-pager template content. Termination clauses. What happens if a Founding Customer wants to leave at month 4 (mid-contract)?
- **Dunning email sequence specifics.** Cadence, copy, exact day numbers, escape-valve instructions for repointing DNS.
- **Sunset maintenance page content and design.** Generic "Site Temporarily Unavailable" treatment; specific wording, branding (none), reactivation CTA for the Customer themselves vs. nothing for visitors.
- **"Founding price" sweetener for first 50 paying Customers.** $79/mo for life vs. standard $99 — defer until we've seen response rates.
- **Capture-and-return-old-DNS at Migration.** Whether the Migration step records the Customer's prior A/CNAME so we can include "to revert, set these back" in the trial-end and Sunset emails.

Resolved in prior grilling sessions (2026-05-24/25), moved out of this list:

- **Conversion flow** → see ## Conversion Flow.
- **Repo and DNS ownership transfer** → agency holds the stack (SaaS model); see ## Conversion Flow → Post-Migration ownership.
- **Pricing specifics** → single tier, $99/mo, no setup fee; see ## Pricing & Business Model → Subscription model.

Resolved in the lifecycle architecture session (2026-05-28), moved out of this list:

- **Generation Brief shape** → minimal `{businessName, sourceUrl, niche, market}` context object; see ## Generation Pipeline.
- **Market vs. city** → use Market for city/metro/county/multi-city targeting; see `CONTEXT.md`.
- **No deterministic preflight gates** → rely on rendered-site human review for MVP; see ## Generation Pipeline.
- **Orchestrator boundary** → Orchestrator owns lifecycle state and external side effects; coding agent owns the workspace.
- **SQLite over JSON** → SQLite is the MVP Orchestrator system of record.
- **Generated Site / Generation Run split** → durable lifecycle object vs. technical generation attempt.
- **Retry model** → same Generated Site, new Generation Run, required retry reason, clean Template Site baseline.
- **Promotion model** → successful run becomes the stable Preview Site version; first success auto-promotes, later runs require explicit Promotion.
- **Generated Site status set** → `generating`, `generation_failed`, `preview_ready`, `reviewed`, `emailed`, `migrated`, `archived`, `sunset`.
- **Lifecycle event table** → keep current status on `generated_sites`, use `generated_site_events` for transition history, no `generation_run_events`.
- **Preview URL namespace** → `{slug}.youragency.com`, with apex/`www` reserved for the Marketing Site.
- **Application boundaries** → Orchestrator, Operator Console, Customer Portal, Marketing Site, and Template Site remain separate logical boundaries.
- **Vercel monorepo deployment model** → one agency monorepo, separate Vercel Projects per web app using Root Directory; Generated Sites remain separate repos/projects.

---

## Decisions Worth Promoting to ADRs

The decisions most likely to deserve an ADR, in rough order of priority. Hold off on actually writing each until the first paying Customer is in sight — premature ADRs calcify decisions that are still soft.

1. **A/CNAME Migration mechanic (not nameserver delegation).** Hard to reverse once Customers expect their email to be untouched. Surprising-without-context for an engineer who'd default to nameserver delegation. Real trade-off (email safety vs. ongoing DNS control) decided explicitly with reference to Shopify/Squarespace/Wix conventions.
2. **Agency holds the stack post-Migration (SaaS ownership model).** Hard to reverse once marketing copy promises "we run it for you." Surprising for an engineer who'd default to transferring the repo to the Customer. Real trade-off (recurring revenue and operational simplicity vs. customer-facing ownership pitch).
3. **Free Trial, no card collected at Migration.** Hard to reverse once early Customers are on this footing. Surprising vs. the standard SMB-SaaS card-on-file pattern. Real trade-off (trust-building vs. collection efficiency) decided in favor of trust because the brand is new.
4. **Single-tier pricing for MVP, no setup fee.** Hard to reverse once Customers are signed at one price (changing pricing post-signup is socially complex). Surprising vs. the standard SaaS three-tier pattern. Real trade-off (decoy-tier psychology vs. needing real Customer data before designing tiers).
5. **Open `/admin` on Preview Sites for MVP.** Hard-to-reverse pattern once Prospects start expecting it; surprising for a security reviewer; real trade-off (alternatives were considered with explicit cost reasoning).
6. **Orchestrator owns Generated Site lifecycle state.** Worth an ADR once the Orchestrator is scaffolded because future UI/jobs should call Orchestrator transitions instead of mutating status directly. Real trade-off (central lifecycle owner vs. simpler direct writes from each app).
7. **SQLite current-state plus lifecycle events.** Worth an ADR once migrations exist because the design explicitly chooses `generated_sites.status` plus `generated_site_events` instead of timestamp/reason columns for every transition. Real trade-off (simple current queries + append-only history vs. denormalized lifecycle columns).
8. **Branch-per-Generation-Run with Promotion to main.** Worth an ADR once implemented because it shapes GitHub/Vercel workflow for every Generated Site. Real trade-off (inspectable candidate runs and stable Preview URL vs. simpler overwrite-only generation).
9. **Upstash Box as generation runtime.** Worth an ADR only if you commit deeply enough to it that swapping becomes painful. Currently mitigated by thin adapter.

(1) and (2) are the most load-bearing — they shape both the product pitch and the architecture. Write those first when the time comes.
