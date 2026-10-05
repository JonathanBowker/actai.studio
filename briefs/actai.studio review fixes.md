# Brief: actai.studio review fixes

## Context
The site is Astro (v7.3.5) on DigitalOcean App Platform. Production is actai.studio. The URL under review is the staging deployment.
A review of the rendered text found the issues below. The reviewer saw no code, no mobile layout and no performance data.
Treat every finding as a hypothesis. Verify it in the repo before acting.

## How we work
Two phases. Don't skip to phase 2.

Phase 1, assess: read the repo. For each item return a verdict: Agree, Partly agree, Disagree or Need input.
Give the reason in one or two sentences. Say what you'd change and which files it touches. Make no edits. Stop and wait for me.

Phase 2, build: I'll lock items by ID. Implement only locked items. Use one branch and one commit per item. Don't deploy to production.

## Push back
I want disagreement. Push back if a fix is wrong, riskier than the problem, or clashes with the codebase.
Say so plainly and give your alternative. Don't quietly implement a worse option to avoid friction.
Add anything the review missed. If a finding is wrong, show the evidence.

## Hard rules
- Don't invent facts. No stats, client names, quotes, logos, calendar links or dates. Leave a marked placeholder and list it for me.
- No pricing anywhere on the site.
- No new dependencies or third-party scripts without asking.
- Keep Astro. No redesign. Layout and visual style stay unless an item says otherwise.
- Copy rules: British English. No em dashes. No exclamation marks. Average sentence 16 words, maximum 24. Contractions. No hedging. No marketing jargon. First-person plural, active voice.
- Banned words: leverage, robust, innovative, solutions, myriad, optimal, organisations.
- Terminology: "governed by your policies", never "trained on". "Auditable", never "audited".
- Copy items: propose two options each. I lock one. Don't edit copy until locked.

## Items

### Copy and content
C1. Offer undefined until FAQ question one. Add a two-line definition under the hero: what Agent in the Room is, how long it takes, what the client leaves with. Draw on FAQ answer one.
C2. Nav labels are abstract. Propose plain labels. Fix the "The governance" link, which points to #ripple-effects. Add FAQ to the main nav.
C3. Governance section is metaphor. "Frontier" is undefined. Rewrite using the plainer language in the FAQ risk answer. Replace the 13 identical images. Fix the alt text, which describes a figure that isn't there.
C4. Proof block. Don't invent data. Reword each stat so the label is accurate: 10/10 is satisfaction, not a result. £100,000 is ambiguous between price and value.
    Replace "Proven results" with an accurate heading. Mark every stat "needs source". Add placeholder slots for a client quote and a case study.
    Push back if you can't make the section honest without data from me.
C5. Remove "AI can do almost anything" and the "forever" line. They overclaim and contradict the FAQ.
C6. Practice section lists 15 sectors with no outcomes. Propose cutting to 3 to 5, each with one concrete outcome line. Ask me which sectors.
C7. Director taglines ("Mapping the business", "Shaping the direction") are cryptic. Propose plain replacements.
C8. The knowledge pack appears only in the FAQ. Recommend promote or cut, with reasons.

### CTA and journey
J1. Two contact paths with two taxonomies. The overlay asks for Project or Retainer, then Engage, Enable or Extend. These are never explained. /contact asks AI direction, Agent diagnostic, Agent delivery or Not sure yet.
    Recommendation: retire the plan selector and route "Get in touch" to /contact. Push back if the overlay serves a purpose I can't see.
J2. Button says "Begin the conversation". Copy says "Book a 30-minute call". Make the label match the action.
J3. No CTA in the hero. Add one.
J4. /contact is a form, not a booking. If I supply a calendar link, embed it. If not, change "Book" to "Request". Ask me.

### Technical
T1. Staging has no robots.txt and may be indexable. Add noindex for staging and a canonical to actai.studio.
    Guard the setup so noindex can't ship to production. Say how you'll do that.
T2. Title tag is just "actai.studio". Write a page-specific title and meta description for every page. Use buyer language, not "agentic systems".
T3. Privacy link missing from the home footer and the overlay form. /contact has one. Confirm /privacy content matches what the forms collect. Tell me if cookies or analytics are set before adding any banner.
T4. Naming varies: "Act AI Studio", "ACT", "actai.studio", "Act.", and "Advanced Analytica Limited" in the footer. List every variant and its location. Don't rename until I lock a choice.
T5. Accessibility: audit the auto-advancing carousels (pause control), prefers-reduced-motion, keyboard navigation, contrast on dark sections, alt text. Check that carousel clones are hidden from screen readers.
T6. Run Lighthouse on mobile and desktop. Report scores before any change.
T7. Analytics: audit what exists for form submits and CTA clicks. Report only. Add nothing without approval.

## Phase 1 output
A table: ID, verdict, reason, proposed change, files touched, what you need from me.
Then: anything the review missed, your recommended build order, and a list of every input you need from me.
Stop there.