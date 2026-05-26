# MVP Strategy Research

Findings from the grilling session on 2026-05-24/25. Covers product shape, generation pipeline, pricing, and the open risks that still need validation.

The product is an automated agency that rebuilds local-service contractor websites (plumbing, HVAC, electrical, roofing) and pitches the rebuild as a lead magnet — full live Preview Site as cold-outreach payload, conversion to a tiered subscription. Generation runs in cloud containers (Upstash Box) using existing coding-agent harnesses (Codex / Claude Code) against the in-repo Tina CMS template.

For canonical terminology see [`CONTEXT.md`](../CONTEXT.md).

---

## Product Shape

### Lead magnet: full live Preview, not a screenshot or landing page

Each Prospect gets a fully browsable Preview Site hosted at `{slug}.preview.youragency.com`. The "wow" of the cold outreach depends on the prospect being able to *click around* a working version of their site — not a screenshot, not a landing page, not a video walkthrough. Landing-page-only is too easy to dismiss as a mockup.

The Preview's Tina admin route is open access for the MVP. This is a consciously accepted tail-risk: cert transparency logs leak the subdomain inventory, and a competitor could in principle edit a Preview to damage a Prospect's reputation. Mitigation is one line of code (a one-time per-site code in the cold-email URL gating `/admin`) and can be added later if abuse materializes. At MVP volumes, the risk is small.

### Provisioning: eager full-stack at generation time

Every generation produces a complete operating stack: GitHub repo + Vercel project + Tina Cloud project + live custom subdomain. The cold-email link resolves to a working site instantly. Lazy ("deploy on first click") was rejected — the 60–120s deploy wait at first-click bounces the most attention-precious moment of the funnel. The wasted-infra cost of unclicked previews is small (a paused project costs nothing); the wasted-attention cost of a slow first click is enormous.

### URL: wildcard subdomain of the agency domain

Wildcard CNAME (`*.preview.youragency.com`) pointing at Vercel. Each generation gets a Vercel custom domain assigned via the Vercel API. Random `vercel.app` URLs read as spam in cold email — branded subdomains read as a real pitch. Migration to in-house hosting later is DNS-only.

### Trigger mode: outbound mass for MVP, self-serve later

Cold-email-driven outbound for the first 90 days. No public form, no signup flow, no captcha — generations are kicked off from a scraped list, the Prospect's first touchpoint is the email. Self-serve (ad-driven landing page → form → site) is the v2 expansion once outbound is validated.

The implication: there is no customer-facing dashboard, signup flow, or onboarding UI in the MVP. The "simple dashboard" that's eventually needed is post-payment Customer territory only.

---

## Conversion Flow

The path from "Prospect clicks the email CTA" to "paying Customer." Modeled as a SaaS funnel (Shopify/Wix/Squarespace mental model), not as an agency sales process. The conversion event is the **Migration** — the moment the Prospect's real domain resolves to the site — not a button click or a signed contract.

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

`{slug}.preview.youragency.com` is configured as a permanent 301 redirect to the Customer's real domain at Migration completion. This:

- Cleans up the security concern of a shadow site with stale auth state.
- Handles anyone who bookmarked the preview link.
- Costs nothing — a few lines of Vercel config.

---

## Generation Pipeline

### Extraction: hand URL directly to the agent, with two arms in parallel

Selected approach: URL → coding agent, agent decides what to read and how deep. The agent can call Firecrawl as a tool for HTML→markdown conversion. The argument for this over a deterministic pre-extraction step is that it minimizes pipeline code and lets the agent's judgment drive content depth, which matches the "use the cheap powerful harness, write less code" thesis.

Quality is gated by **post-generation visual review of the live Preview before the email is sent** — not by intermediate brief review. The brief tells you less than the rendered site; if the site looks good, the brief was good.

**A/B test planned for early validation.** Two arms:

- **Arm 1 (orchestrator-driven):** Firecrawl scrapes the Source URL up-front, passes structured markdown to the agent, agent generates from that input.
- **Arm 2 (agent-driven):** Agent receives only the URL plus Firecrawl as a tool, decides what subpages to read and how deep.

Test rig:

- 5–8 fixed Source URLs spread across the four niches and across "good / mediocre / dumpster fire."
- Same harness on both sides (don't compare Codex-Arm-1 against Claude-Code-Arm-2).
- Same Firecrawl as page-rendering tool on both sides (so the variable being tested is *who decides what to extract*, not extraction quality itself).
- Rubric: name/phone/address accuracy, service-list completeness, copy specificity (cites real proof points from source), invented-fact rate, total runtime cost.

The rubric itself becomes a reusable generation-quality check for ongoing operations.

### Pre-flight validation

The orchestrator's input contract is **`{business_name, business_url, niche, city}`**, not bare URL. The pre-flight check confirms the Source URL is alive, has real content (not parked/coming-soon), the business name appears recognizably in the rendered page, niche keywords are present, and geography matches the expected city. Cheap to implement, cheap to run, and catches the most damaging failure mode (generating a beautiful site for the wrong business or for a defunct URL).

### Bootstrap: GitHub Template Repository

`apps/template-site/` gets extracted into its own GitHub repo marked as a template. The orchestrator's bootstrap step is one API call: `POST /repos/{owner}/{template}/generate` → a new repo per Prospect. The orchestrator clones the new repo into `runs/{slug}/`, the agent runs against that directory, then commits and pushes.

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

The orchestrator location (where the dispatching process runs) evolves independently of the generation environment (always Upstash Box from day one):

1. **Phase 1:** Orchestrator on Mac, manually invoked, generations in Box.
2. **Phase 2:** Orchestrator on Mac, queue-driven (CSV in → batch out), generations in Box.
3. **Phase 3:** Orchestrator on a small cloud VM or Mac mini, queue + cron-driven, generations still in Box.

Each transition is hours of work, not days, because the Box adapter doesn't change.

### Workspace lifecycle

`./runs/{slug}/` is the generation workspace pattern, gitignored from the orchestrator repo.

- **On success** (commit pushed + Vercel deploy green + Tina connected): nuke the local directory. Canonical copy is on GitHub.
- **On failure at any step:** retain the directory. The agent's half-finished output is the most informative thing about what went wrong.
- `--keep` flag for development to always retain.
- Re-runs (e.g., prompt tweaked) re-clone from GitHub; bandwidth is cheap.

Local clones are *cache*, not state.

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

### Single niche × single metro for the first batch

Recommendation: pick one niche and one metro, generate 5–20 Preview Sites for that combination, get 3–5 paying Founding Customers, only then expand to a second niche (same metro) or a second metro (same niche). Reasoning:

- Cold email copy is hyper-specific ("we work with roofers in Denver") — highest open and reply rate.
- Testimonials compound twice (same niche AND same metro) — a Denver roofer is far more likely to trust a Denver roofer's quote than an out-of-state one.
- Template, prompts, image library, and icon set can be tuned per niche before generalizing — one well-tuned niche-and-metro template wins more than four mediocre ones.
- Bounds first-month work — generating 50 previews for one slice is testable in days; trying to do four niches in parallel diffuses attention.

### Picking the first niche × metro

Decision deferred. Heuristic:

- **High average ticket** (roofing > HVAC > plumbing > electrical).
- **Visible-pain market** (many local competitors with objectively bad sites — easy to identify scrapeable list).
- **Personal angle** (you live there, know someone, have existing network) — first 5 sales are hard without it.

Default if no personal angle: roofers in a sun-belt metro (Phoenix, Tampa, Dallas, Denver) — high ticket, lots of storm activity, lots of competitors, dated sites.

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

- **First niche × metro pick.** Heuristic agreed, specific choice pending.
- **Outbound infrastructure scope.** Is list scraping + cold email automation part of `agent_studio` the codebase, or external SaaS tools (Apollo, Instantly, Smartlead) wired up via webhooks?
- **Orchestrator code shape.** Node/TypeScript surface area. Commands. State machine. Logging. Job queue choice (e.g., simple SQLite-backed vs Redis).
- **Founding Customer agreement specifics.** One-pager template content. Termination clauses. What happens if a Founding Customer wants to leave at month 4 (mid-contract)?
- **Dunning email sequence specifics.** Cadence, copy, exact day numbers, escape-valve instructions for repointing DNS.
- **Sunset maintenance page content and design.** Generic "Site Temporarily Unavailable" treatment; specific wording, branding (none), reactivation CTA for the Customer themselves vs. nothing for visitors.
- **"Founding price" sweetener for first 50 paying Customers.** $79/mo for life vs. standard $99 — defer until we've seen response rates.
- **Capture-and-return-old-DNS at Migration.** Whether the Migration step records the Customer's prior A/CNAME so we can include "to revert, set these back" in the trial-end and Sunset emails.

Resolved this session (2026-05-25), moved out of this list:

- **Conversion flow** → see ## Conversion Flow.
- **Repo and DNS ownership transfer** → agency holds the stack (SaaS model); see ## Conversion Flow → Post-Migration ownership.
- **Pricing specifics** → single tier, $99/mo, no setup fee; see ## Pricing & Business Model → Subscription model.

---

## Decisions Worth Promoting to ADRs

The decisions most likely to deserve an ADR, in rough order of priority. Hold off on actually writing each until the first paying Customer is in sight — premature ADRs calcify decisions that are still soft.

1. **A/CNAME Migration mechanic (not nameserver delegation).** Hard to reverse once Customers expect their email to be untouched. Surprising-without-context for an engineer who'd default to nameserver delegation. Real trade-off (email safety vs. ongoing DNS control) decided explicitly with reference to Shopify/Squarespace/Wix conventions.
2. **Agency holds the stack post-Migration (SaaS ownership model).** Hard to reverse once marketing copy promises "we run it for you." Surprising for an engineer who'd default to transferring the repo to the Customer. Real trade-off (recurring revenue and operational simplicity vs. customer-facing ownership pitch).
3. **Free Trial, no card collected at Migration.** Hard to reverse once early Customers are on this footing. Surprising vs. the standard SMB-SaaS card-on-file pattern. Real trade-off (trust-building vs. collection efficiency) decided in favor of trust because the brand is new.
4. **Single-tier pricing for MVP, no setup fee.** Hard to reverse once Customers are signed at one price (changing pricing post-signup is socially complex). Surprising vs. the standard SaaS three-tier pattern. Real trade-off (decoy-tier psychology vs. needing real Customer data before designing tiers).
5. **Open `/admin` on Preview Sites for MVP.** Hard-to-reverse pattern once Prospects start expecting it; surprising for a security reviewer; real trade-off (alternatives were considered with explicit cost reasoning).
6. **Upstash Box as generation runtime.** Worth an ADR only if you commit deeply enough to it that swapping becomes painful. Currently mitigated by thin adapter.

(1) and (2) are the most load-bearing — they shape both the product pitch and the architecture. Write those first when the time comes.
