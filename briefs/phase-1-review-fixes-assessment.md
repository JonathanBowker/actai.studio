# Phase 1 Assessment: actai.studio Review Fixes

Date: 2026-10-05  
Scope: Assessment only. No code changes made for this phase.  
Note: The repo already had local changes before this assessment: `HeroSection.astro`, `LeadershipAreasSection.astro`, untracked images, and the brief file.

## Findings Table

| ID | Verdict | Reason | Proposed change | Files touched | What I need from you |
|---|---|---|---|---|---|
| C1 | Partly agree | The hero does not define Agent in the Room. The FAQ defines the offer, but it does not state a duration, so adding one would invent a fact. | Add a two-line hero support block, but use `[duration]` until confirmed. Option A: `Agent in the Room is a live working session with an ACT director. In [duration], we find the problem worth solving and leave you with a scoped AI direction.` Option B: `Agent in the Room helps you decide where AI should act. You leave with the problem, boundaries and next step clearly scoped.` | `src/components/sections/HeroSection.astro`, possibly `src/pages/index.astro` FAQ source | Confirm duration, or approve an option without duration. |
| C2 | Agree | Current nav labels are abstract. The governance link reaches the right section, but the anchor name `#ripple-effects` is not plain and FAQ is absent from main nav. | Plain label set, Option A: `What we do`, `How it works`, `Process`, `Use cases`, `Governance`, `Team`, `Proof`, `FAQ`. Option B: `Start here`, `Method`, `Process`, `Examples`, `Governance`, `Directors`, `Results`, `FAQ`. Rename the section id to `governance` or add an alias anchor. | `src/components/sections/SiteHeader.astro`, `FooterSection.astro`, `SitemapDirectorySection.astro`, `RippleEffectsSection.astro` | Lock option A or B. |
| C3 | Agree | The governance section uses `frontier`, which is undefined. It repeats the same image many times and the alt text says there is a figure, which the current abstract image may not support. | Rewrite from the FAQ risk answer. Option A: `We define access, approved knowledge, boundaries, review points and escalation rules before an agent goes live.` Option B: `Your policies set the boundaries. We shape the agent around approved knowledge, review points and escalation routes.` Use either one decorative image with empty alt, or varied images that are genuinely described. | `src/components/sections/RippleEffectsSection.astro`, possibly image assets | Choose copy option. Confirm whether this visual should stay abstract or become governance-specific. |
| C4 | Agree, with pushback | The proof section makes claims that need sources. `£100,000` can read as a price and there is no visible evidence for the figures. | Do not make this section “honest” by softening only the labels. Either supply sources or convert it into an evidence-needed section. Option A heading: `Evidence we can stand behind`. Option B heading: `What we measure`. Add `Needs source` on each stat. Add marked placeholders: `[client quote needed]`, `[case study needed]`. Reword `£100,000` to `[value source needed]` until clarified. | `src/pages/index.astro`, `src/components/sections/ResultsSection.astro` | Sources for 10/10, 80%, £100,000, 100+. Client quote and case study, or approval to mark placeholders. |
| C5 | Agree | `AI can do almost anything` overclaims. The `forever` line uses an em dash and makes a permanence claim the site cannot support. | Remove both lines or replace them. Option A: `What matters is where AI creates value and where people stay in control.` Option B: `The useful question is not what AI can do. It is where it should act.` | `src/components/sections/LeadershipIntroSection.astro`, `LeadershipAreasSection.astro` | Lock option A or B, or approve removal only. |
| C6 | Agree | The practice section uses 15 sectors and cards already include short point lists, but the volume dilutes the message. Cutting to 3 to 5 examples would make outcomes clearer. | Reduce to selected sectors with one outcome line each. Option A structure: sector, problem, outcome. Option B structure: sector, repeated work, agent support. | `src/pages/index.astro`, `src/components/sections/LeadershipAreasSection.astro` | Pick 3 to 5 sectors. I recommend Finance, Risk & Compliance, Professional Services, Retail & Ecommerce, Manufacturing & Supply. |
| C7 | Agree | `Mapping the business` and `Shaping the direction` are vague compared with the adjacent bios. | Jonny options: A `Finds the problem worth solving.` B `Turns business pressure into AI scope.` Mark options: A `Leads discovery toward the real problem.` B `Shapes the brief before build starts.` | `src/components/sections/DirectionSection.astro` | Lock one option for each director. |
| C8 | Partly agree | Knowledge packs are not only in the FAQ. They exist on dynamic agent pages and public pack files, but the home page does not introduce that journey clearly. | Recommend promote, not cut, because the pack pages and downloads already exist. Option A: add a small home section linking to agent diagnostics. Option B: add a short card in the practice section explaining the pack journey. | `src/pages/index.astro`, `src/components/sections/AgentTriageSection.astro`, possibly `SitemapDirectorySection.astro` | Confirm whether knowledge packs are part of the offer you want visible on home. |
| J1 | Agree | The overlay and `/contact` use different taxonomies. The overlay has Project/Retainer and Engage/Enable/Extend, while `/contact` uses AI direction, Agent diagnostic, Agent delivery and Not sure yet. | Retire the overlay form and route `Get in touch` to `/contact`. Pushback: keep the overlay only if it has a measurable purpose, because it currently adds form complexity without a clear route. | `src/components/sections/ContactPanel.astro`, `src/pages/index.astro`, `SiteHeader.astro` | Confirm whether the overlay has a sales or tracking purpose I cannot see. |
| J2 | Agree | Buttons say `BEGIN THE CONVERSATION`, while the copy often promises a 30-minute call. The action is currently a form or mailto, not a booking. | If no calendar link, use `Request a 30-minute call`. If calendar link is supplied, use `Book a 30-minute call`. | `SiteHeader.astro`, `FooterSection.astro`, `CallToActionSection.astro`, `ContactFormSection.astro`, `MeetingBookingSection.astro`, `AgentPackSection.astro`, sitemap links | Confirm calendar link status. |
| J3 | Agree | The hero has no CTA. The first clear action arrives later or via the header after scroll. | Add one hero CTA. Option A: `Request a 30-minute call`. Option B: `Start with the problem`. Secondary link optional: `See how it works`. | `src/components/sections/HeroSection.astro` | Lock CTA label and destination. |
| J4 | Agree | `/contact` is a form. Calling it booking is inaccurate unless a calendar embed is provided. | If you supply a calendar link, embed it after approval. If not, change `Book` to `Request`. | `ContactFormSection.astro`, `CallToActionSection.astro`, `MeetingBookingSection.astro`, page metadata | Supply calendar link or approve `Request`. |
| T1 | Agree | There is no `public/robots.txt`, no canonical tags, and no environment-based noindex guard in the repo. | Add canonical tags to pages. Add staging noindex only when an explicit staging env var or hostname matches staging. Guard production by making canonical default to `https://actai.studio` and noindex false unless `PUBLIC_SITE_ENV=staging` or a staging host is detected. | Page heads, likely a new SEO component, `astro.config.mjs`, `public/robots.txt` | Staging hostname and DigitalOcean env var names. |
| T2 | Agree | Home title is only `actai.studio`, and several descriptions use `agentic systems`. Dynamic agent pages use `Actai.Studio`. | Create page-specific titles and descriptions in buyer language. Avoid `agentic systems`. | All page heads: `index`, `contact`, `meeting`, `privacy`, `sitemap`, `agents/[slug]` | Brand spelling choice from T4. |
| T3 | Agree | Home footer lacks a privacy link. Overlay form lacks a privacy link. `/privacy` covers diagnostic packs but not the home overlay, contact form fields, or localStorage on pack gates. I found no cookies or third-party analytics scripts, but localStorage is used on agent pages. | Add privacy links to home footer and overlay if kept. Update privacy copy to cover name, email, role, company, starting point, details, route, plan and localStorage pack unlocks. No cookie banner unless analytics is added elsewhere. | `FooterSection.astro`, `ContactPanel.astro`, `PrivacyContentSection.astro`, `AgentPackSection.astro` | Confirm whether DigitalOcean injects analytics or any external tracking in staging/production. |
| T4 | Agree | Naming varies across pages, metadata, SVGs, content and footers. This affects trust and SEO. | Do not rename yet. Variants found: `Act.`, `ACT`, `ACTAI.STUDIO`, `actai.studio`, `Act AI`, `Actai.Studio`, `Act AI Studio`, `Advanced Analytica Limited`, `AdvancedAnalytica` in LinkedIn URL. Standardise once locked. | Many files: header/footer, page metadata, privacy, agent pages, public pack copy | Lock brand style and legal footer style. |
| T5 | Partly agree | The main carousel has controls and pauses on hover/focus, but has no explicit pause button. It hides distant cards from screen readers, not all inactive cards. Repeated vertical scrollers mark duplicate agent triage cards hidden, but practice duplicates are not hidden. Reduced motion exists in several places. | Add a visible pause/play control to auto-advancing carousel. Mark all inactive or duplicate carousel/scroll cards correctly. Audit dark contrast after copy changes. Add keyboard handling where card click changes slides. | `PossibilitySection.astro`, `LeadershipAreasSection.astro`, `AgentTriageSection.astro`, `RippleEffectsSection.astro`, `global.css` | None, unless you want stricter WCAG target. |
| T6 | Agree | Lighthouse can be run locally. I ran it against `http://localhost:4321`, not staging. | Baseline local scores: desktop Performance 66, Accessibility 96, Best Practices 96, SEO 91. Mobile Performance 53, Accessibility 96, Best Practices 96, SEO 91. Mobile LCP was 34.0s locally, so performance work is likely needed after content fixes. | No code files in Phase 1 | Staging URL if you want deployment scores rather than local scores. |
| T7 | Agree | There is event plumbing but no analytics script in the repo. Home dispatches `agent_card_click`; agent pages dispatch pack gate/open/download events and push to `window.dataLayer` if it exists. Contact form redirects to mailto, so form submission is not reliably measured. | Report only for now. If approved later, define the analytics destination and consent approach before adding scripts. | `src/pages/index.astro`, `src/pages/agents/[slug].astro`, `ContactFormSection.astro`, `ContactPanel.astro` | Confirm analytics provider and whether `dataLayer` is injected outside this repo. |

## Brand Variants Found

- `Act.`: logo title, hero copy, footers.
- `ACT`: header logo alt and sitemap copy.
- `ACTAI.STUDIO`: sitemap/header-style links and privacy back link.
- `actai.studio`: home title and page titles.
- `Act AI`: contact subject/description.
- `Actai.Studio`: privacy, agent metadata, consent copy and mailto subject.
- `Act AI Studio`: prior hero copy and review language.
- `Advanced Analytica Limited`: home footer and agent footer legal line.
- `AdvancedAnalytica`: LinkedIn URL text/path.

## Anything The Review Missed

- Current copy breaks several stated copy rules: em dash in `LeadershipIntroSection.astro`, banned `organisations` in FAQ and agent content, and repeated `agentic` in metadata/body copy.
- The repo contains a `/meeting` page, but most CTAs point to `/contact`. Decide whether `/meeting` remains part of the journey.
- Public pack Markdown files still say `Book a meeting: /meeting`, which conflicts with the current `/contact` path.
- The home page has a large inline script after componentisation. Later cleanup could move behaviour closer to components, but I would not do that during these review fixes.
- Current local working tree is dirty before Phase 2. I recommend either committing or stashing existing local changes before item branches begin.

## Recommended Build Order

1. T4: lock naming first, because it affects every copy and metadata item.
2. J4 and J2: decide booking versus request, then update CTAs.
3. C1, C2, C5, C7: quick copy and navigation clarity wins.
4. T1, T2, T3: SEO and privacy pass.
5. J1 and J3: contact journey simplification and hero CTA.
6. C3, T5: governance rewrite and accessibility fixes together.
7. C4: proof section only after sources or placeholder approval.
8. C6 and C8: practice/knowledge-pack journey after sector and offer decisions.
9. T6: rerun Lighthouse after build changes.
10. T7: analytics only after provider and consent decisions.

## Inputs Needed

- Confirm Agent in the Room duration, or approve copy without duration.
- Lock nav label option A or B.
- Lock governance copy option A or B, and visual direction.
- Provide sources for 10/10, 80%, £100,000 and 100+, or approve placeholders.
- Provide client quote and case study, or approve marked placeholders.
- Lock replacement for overclaim copy, or approve removal.
- Pick 3 to 5 sectors for the practice section.
- Lock director tagline replacements.
- Decide whether knowledge packs should be promoted on home.
- Confirm whether the overlay serves a purpose, or retire it.
- Supply a calendar link, or approve `Request a 30-minute call`.
- Provide staging hostname and DigitalOcean environment variable names.
- Lock brand spelling and legal footer style.
- Confirm whether analytics or tracking is injected outside this repo.
- Provide staging URL if you want Lighthouse scores against staging.
