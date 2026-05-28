# Agent Studio

An automated agency that generates SEO-optimized, modern websites for local-service contractors (plumbing, HVAC, electrical, roofing) as a lead magnet, then converts and hosts those sites for paying customers.

## Language

**Template Site**:
The foundational Next.js + Tina CMS starter that every generated site is built from. Lives at `apps/template-site/`. Themeable through content and global JSON; React components, Tina schemas, and routes are not touched per-business.
_Avoid_: Starter, base site, boilerplate.

**Generated Site**:
A concrete site instance produced by running the generation agent against the Template Site for a specific contractor. Exists as a standalone GitHub repo + Vercel project + Tina Cloud project.
_Avoid_: Built site, output site, instance.

**Preview Site**:
A Generated Site in its pre-conversion lifecycle stage. Hosted on `{slug}.youragency.com`, has open `/admin` access to Tina for the MVP, no custom domain. Shown to Prospects as the lead magnet.
_Avoid_: Demo, sample, mockup.

**Slug**:
The human-readable subdomain identifier for a Generated Site. Derived primarily from the Prospect's business name; Market is used only when needed to avoid ambiguity or collision. A Slug is not the Prospect's legal identity.
_Avoid_: Site ID, subdomain, tenant name.

**Customer Site**:
A [[generated-site]] after [[migration]] has completed — i.e., the Prospect's real domain now resolves to the site. Same underlying repo/Vercel project/Tina project as the [[preview-site]] it transitioned from; Migration is a DNS event, not a regeneration. Payment timing relative to Migration is a separate concern (see pricing decisions).
_Avoid_: Live site, production site, real site.

**Prospect**:
A contractor whose Preview Site has been generated but whose Migration has not completed.
_Avoid_: Lead, target, candidate.

**Customer**:
A Prospect whose Migration has completed. Payment, Free Trial, and subscription status are separate from the Customer lifecycle identity. Has a Customer Site and Tina editor access.
_Avoid_: Client, user, account.

**Source URL**:
The contractor's existing website URL. The agent treats the Source URL as primary evidence for business identity, services, contact info, brand cues, and service-area details when populating the Generated Site. The Source URL is one field in the [[generation-brief]], not the whole brief.
_Avoid_: Old site, original site, input site.

**Generation Brief**:
The minimal operator-provided intent object used to start a Generated Site run. Contains the Prospect's business name, Source URL, niche, and Market. The Generation Brief is context for the agent, not a deterministic validation contract; the Source URL remains the primary evidence source.
_Avoid_: Creative brief, customer profile, extraction summary.

**Generation Run**:
A single attempt by the Orchestrator and coding agent to produce or revise a Generated Site from a Generation Brief. A Generated Site may have multiple Generation Runs when a failed or unsatisfactory result is retried.
_Avoid_: Job, build, attempt.

**Retry**:
A subsequent Generation Run for the same Generated Site after a failed or unsatisfactory result. A Retry is not a new Generated Site and does not create a second Preview Site; A/B variants are a separate future concept.
_Avoid_: Rerun, variant, duplicate.

**Promotion**:
The act of making a successful Generation Run the version that backs the stable Preview Site. The first successful Generation Run may be promoted automatically; later Promotions replace the currently published run without changing the Prospect-facing Preview Site URL.
_Avoid_: Publish, merge, release.

**Market**:
The primary local area the Preview Site should be pitched into, such as a city, metro, county, or multi-city service area. A Market is not necessarily the Prospect's entire service area; the agent may extract additional served locations from the Source URL.
_Avoid_: City, territory, region.

**Orchestrator**:
The internal operator system that creates and advances Generated Sites through their lifecycle. It owns the durable record of a Generated Site and coordinates external systems such as generation compute, GitHub, Vercel, Tina Cloud, email, Migration, Trial, and Sunset.
_Avoid_: Admin app, pipeline runner, control plane.

**Operator Console**:
The internal UI used by agency operators to inspect and control Generated Sites, Generation Runs, Promotions, reviews, outreach state, Migration, Archive, and Sunset. The Operator Console uses Orchestrator capabilities; it does not own lifecycle rules independently.
_Avoid_: Backstore, admin app, dashboard.

**Customer Portal**:
The customer-facing account surface for billing, subscription, trial, and account management. It is distinct from the Customer Site and from Tina's `/admin` editing experience.
_Avoid_: Customer dashboard, app, editor.

**Marketing Site**:
The public agency website hosted at the agency's apex and `www` domains. It explains and legitimizes the agency; it is not a Preview Site or Customer Site.
_Avoid_: Homepage, landing page, public app.

**Founding Customer**:
A [[customer]] in the first 3–5 onboarding cohort who receives the service free for a fixed period in exchange for testimonials, logo rights, and a recorded reference call. Distinct from paying customers in lifecycle and pricing, not in product entitlement.
_Avoid_: Design partner, beta customer, pilot user, free user.

**Displaced Spend**:
What the [[prospect]] is paying *today* for their current website situation (DIY builder subscription, freelancer maintenance fee, marketing agency retainer, etc.). The reference price against which the offer is compared in the conversion pitch, not the abstract "fair price" of a website.
_Avoid_: Current cost, baseline, existing fee.

**Migration**:
The event of pointing the [[prospect]]'s real domain (e.g., `acmeplumbing.com`) at their [[generated-site]]. The lifecycle transition from [[preview-site]] to [[customer-site]] — the moment of conversion. Mechanically: addition of A and CNAME DNS records at the Prospect's existing registrar (their nameservers are untouched, so MX/email is structurally safe). Two operator-facing paths exist: Concierge Migration (we drive it on a screenshare) and Self-Serve Migration (Prospect follows registrar-specific instructions).
_Avoid_: Domain switch, DNS cutover, go-live.

**Concierge Migration**:
A [[migration]] performed by an agency operator on a screenshare with the [[prospect]], typically a 15-min call. The primary path for the first cohort of Customers; lets the operator learn each registrar's quirks first-hand before writing self-serve instructions. The Prospect retains registrar ownership; the operator only adds the A/CNAME records on their behalf.
_Avoid_: Done-for-you setup, white-glove migration.

**Self-Serve Migration**:
A [[migration]] performed by the [[prospect]] following registrar-specific written instructions, without a synchronous call. Reserved for the technically-confident slice of Prospects; the rest book a [[concierge-migration]].
_Avoid_: DIY migration, manual setup.

**Archive**:
The act of retiring an unconverted Preview Site from active outreach or review. Archive applies before Migration; it does not take a Customer Site offline and is distinct from Sunset.
_Avoid_: Sunset, delete, cleanup.

**Free Trial**:
The 30-day period beginning the moment a [[migration]] completes successfully (Vercel reports the [[customer]]'s domain as verified). During the Free Trial, the [[customer-site]] is fully live at the Customer's real domain with no payment collected. At trial end, the Customer either pays (transitions to ongoing billing) or the site is [[sunset]]. No credit card is collected at Migration; this is a deliberate trust mechanic for a new brand. [[founding-customer]]s have an analogous but extended period (6 months free) governed by their separate contract rather than the standard Trial mechanics.
_Avoid_: Demo period, evaluation period, grace period.

**Sunset**:
The act of taking a [[customer-site]] offline when payment is not collected by Free Trial end (or when a paying [[customer]] cancels). Mechanically: Vercel project paused, custom-domain serving switches to a "site offline" page hosted by us. The Customer's domain is *not* touched (their A/CNAME records remain pointed at us; they can repoint to their previous hosting at any time). Data is retained for a grace window before deletion.
_Avoid_: Shutdown, takedown, deletion.
