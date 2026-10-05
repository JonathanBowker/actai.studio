# Agent in the Room Section Report

Date: 5 October 2026

## A1 and A2 build

### Diff summary

- Kept the hero headline, subline and one primary call button.
- Kept `See Agent in the Room` below the button and linked it to `#agent-in-the-room`.
- Retained the 55% black hero scrim. Lighthouse reports 100 accessibility and passes the contrast audit.
- Replaced the Method introduction with the locked heading, lead and four ordered steps.
- Added `#method` as an alias at the same section position.
- Kept the existing carousel captions unchanged and changed its visible caption to `Inside the session`.
- Kept the closing line and call button.
- Updated the main navigation, footer and sitemap to use Agent in the Room and the new anchor.

### Files touched

- `src/components/sections/HeroSection.astro`
- `src/components/sections/PossibilitySection.astro`
- `src/components/sections/SiteHeader.astro`
- `src/components/sections/FooterSection.astro`
- `src/pages/sitemap.astro`

### Conflicts found

The instruction to keep Astro fully static conflicts with the approved SES form and hostname-based production safeguards. The contact endpoint needs Node, while the shared DigitalOcean deployment needs request-host detection to separate production from staging. I kept Astro and added no dependencies, but did not remove the Node runtime.

The unchanged carousel still contains old internal-flow language, including `interrogates the technical problem`. Jonny's current bio still says `live design tree methodology`. Both conflict with the new hard rules, but P1 and P4 explicitly say not to edit before approval.

## P1 carousel captions

### Option A: direct sequence

1. We bring the agreed brief into the room.
2. The agent asks one clear question.
3. Your people answer from experience.
4. Our experts keep the session focused.
5. The agent asks the next question.
6. The room adds the context that matters.
7. We agree what should happen next.
8. The agreed direction moves to the build.

### Option B: client perspective

1. Everyone starts from the same brief.
2. The first question opens the conversation.
3. Your people bring the business context.
4. We keep each answer tied to the problem.
5. The room works through one question at a time.
6. Different perspectives make the direction clearer.
7. We agree the direction together.
8. Our labs take forward what the room agrees.

Recommendation: Option A. It follows the locked process without exposing internal mechanics.

## P2 FAQ

The first answer conflicts because it names one ACT director, omits the brief and says nothing about the route to build.

### Answer one, option A

`Agent in the Room™ is an AI-led, expertise-driven working session. One or two of our experts join your people with an agent programmed on your brief. It questions the room one question at a time. We steer the session, agree the direction and take that work to our labs.`

### Answer one, option B

`Agent in the Room™ turns a clear brief into a working session with your people. We programme an agent on the brief, then bring it into the room with one or two experts. The agent questions the room one question at a time while we steer the session. What we agree goes to our labs to be built.`

Recommendation: Option B. It explains the product through the same four-stage process as the section.

`Do we need to know which agent we want before we speak?` does not conflict. It correctly starts with the business problem rather than a chosen agent. I recommend leaving it unchanged.

`How do we get started?` is incomplete. It says the call produces a scope, while the locked process says it produces the brief. It also omits recording and transcription.

### Getting started, option A

`Request a 30-minute call. We record and transcribe it, then steer the conversation until we've got a clear brief. If you decide to continue, we programme the agent and arrange the session.`

### Getting started, option B

`Start with a 30-minute call. We use the conversation to define the problem and create the brief. You then decide whether we programme the agent and arrange the session.`

Recommendation: Option A, once P3 is complete.

## P3 recording and privacy

### Contact statement, option A

`We record and transcribe the 30-minute call. We use the transcript to prepare the brief and programme the agent if you decide to continue.`

### Contact statement, option B

`This call is recorded and transcribed. We use the transcript to agree your brief. If you continue, we also use it to brief the AI agent.`

Recommendation: Option B. It separates the immediate purpose from the optional next stage.

### Privacy wording, option A

`We record and transcribe the first 30-minute call. We use the recording and transcript to define your brief and, if you continue, to brief the AI agent. [Recording and transcription provider: Jonny to confirm] and [AI provider: Jonny to confirm] process this information for us. We keep it for [retention period: Jonny to confirm]. Our lawful basis is [Jonny to confirm].`

### Privacy wording, option B

`Before the first call, we explain that it will be recorded and transcribed. [Recording and transcription provider: Jonny to confirm] processes the call. We use the transcript to create your brief. If you continue, [AI provider: Jonny to confirm] also processes it to brief the agent. We keep the recording and transcript for [retention period: Jonny to confirm]. Our lawful basis is [Jonny to confirm].`

Recommendation: Option B. It gives each provider and purpose a clear place without inventing legal details.

The privacy notice should also identify any international transfer and its safeguard. The ICO requires privacy information to state the lawful basis, recipients, retention information and applicable international transfers. See the [ICO right-to-be-informed guidance](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/individual-rights/the-right-to-be-informed/what-privacy-information-should-we-provide/) and [ICO lawful-basis guidance](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/lawful-basis/a-guide-to-lawful-basis/).

## P4 director bio

### Option A

`Through Agent in the Room™, he turns business problems into clear briefs and directs what gets built.`

### Option B

`He leads Agent in the Room™, shaping business pressure into a clear brief and a practical direction for the build.`

Recommendation: Option A. It is plainer and maps directly to Jonny's role in the locked process.

## Inputs and omissions

- Confirm the recording and transcription provider.
- Confirm every AI provider that receives the transcript.
- Confirm where each provider processes and stores the data.
- Confirm the retention period and lawful basis with legal advice.
- Confirm whether participants can take the call without recording.
- Confirm whether the on-site or video session is also recorded. The locked process only says the first call is recorded.
- Add an operational notice before recording begins, not only website copy.
