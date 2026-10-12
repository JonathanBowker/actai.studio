# Agent in the Room Section Report

Date: 5 October 2026

## A1 and A2 build

### Diff summary

- Kept the hero headline, subline, single call button and `See Agent in the Room` link.
- Kept the link target as `#agent-in-the-room` and the legacy `#method` alias.
- Retained the 55% black hero scrim, which passes the Lighthouse contrast audit.
- Updated the four-step section to the locked call, preparation, workshop and build process.
- Removed the video call option from the section and renamed its visible caption `Inside the workshop`.
- Updated the sitemap summary to use the same four-step terminology.
- Left the eight carousel captions unchanged pending P1 approval.

### Files touched

- `src/components/sections/PossibilitySection.astro`
- `src/pages/sitemap.astro`
- `briefs/agent-in-the-room-section-report.md`

### Conflicts found

The instruction to keep Astro static conflicts with the approved SES contact form. Its server endpoint requires the existing Node adapter. I kept the approved Node deployment and added no dependencies.

The unchanged carousel contains `interrogates the technical problem`, and Jonny's bio says `live design tree methodology`. Both breach the hard rules, but P1 and P4 say to propose before editing.

The FAQ still defines Agent in the Room as a `session`. This conflicts with the locked public term `workshop`, but P2 says to propose before editing.

No workshop-related video call option appears elsewhere. Two references to video calls occur in the Meeting Intelligence diagnostic. They describe the client's ordinary meetings, not Agent in the Room, so they should remain.

## P1 carousel captions

### Option A: direct sequence

1. We bring the agreed brief into the workshop.
2. Your people and our experts gather in the room.
3. The prepared agent joins the conversation.
4. The agent asks one clear question.
5. Your people answer from experience.
6. Our experts keep the workshop focused.
7. We agree what should happen next.
8. The agreed direction moves to the build.

### Option B: client perspective

1. Everyone starts from the same brief.
2. We meet face to face for the workshop.
3. The prepared agent joins your people.
4. One clear question opens the conversation.
5. Your people bring the business context.
6. We keep each answer tied to the problem.
7. We agree the direction together.
8. Our labs take forward what the room agrees.

Recommendation: Option A. It follows the public process in a direct sequence.

## P2 FAQ

The first answer conflicts with the locked process. It calls the product a session, mentions only one director, and omits the call, preparation and build.

### Answer one, option A

`Agent in the Room™ begins with a recorded 30-minute call that gives us a clear brief. If you continue, we prepare an agent on that brief. We then bring it into a face-to-face workshop with your people and one or two of our experts. What we agree goes to our labs, where we build it.`

### Answer one, option B

`Agent in the Room™ is a face-to-face workshop built around a brief agreed during a recorded 30-minute call. If you continue, we prepare the agent before the workshop. One or two of our experts join your people and steer the conversation. What we agree goes to our labs, where we build it.`

Recommendation: Option A. It explains all four steps in order.

`Do we need to know which agent we want before we speak?` does not conflict. It correctly starts with the business problem rather than a chosen agent. I recommend leaving it unchanged.

`How do we get started?` conflicts with the locked process. It says the call produces a scope rather than the brief, and does not disclose recording.

### Getting started, option A

`Request a 30-minute call. We record and transcribe it, then steer the conversation until we've got a clear brief. If you continue, we prepare the agent and arrange the face-to-face workshop.`

### Getting started, option B

`Start with a recorded 30-minute call. We use the conversation to define the problem and create the brief. You then decide whether we prepare the agent and arrange the face-to-face workshop.`

Recommendation: Option A, once the P3 privacy wording is approved.

## P3 recording and privacy

### Contact statement, option A

`We record and transcribe the 30-minute call. We use the transcript to agree your brief and prepare the agent if you continue.`

### Contact statement, option B

`This call is recorded and transcribed. We use the transcript to create your brief. If you continue, we also use it to prepare the AI agent.`

Recommendation: Option B. It separates the immediate purpose from the optional next step.

### Privacy wording, option A

`We record and transcribe the first 30-minute call. We use the recording and transcript to define your brief and, if you continue, prepare the AI agent. [Recording and transcription provider: Jonny to confirm] and [AI provider: Jonny to confirm] process this information for us. We keep it for [retention period: Jonny to confirm]. Our lawful basis is [Jonny to confirm].`

`The face-to-face workshop may include confidential or sensitive business information. We use that information to agree what should be built. [Workshop information retention: Jonny to confirm]. [Workshop information lawful basis: Jonny to confirm].`

### Privacy wording, option B

`Before the first call, we explain that it will be recorded and transcribed. [Recording and transcription provider: Jonny to confirm] processes the call. We use the transcript to create your brief. If you continue, [AI provider: Jonny to confirm] also processes it to prepare the agent. We keep the recording and transcript for [retention period: Jonny to confirm]. Our lawful basis is [Jonny to confirm].`

`People may discuss confidential or sensitive business information during the face-to-face workshop. We use it to direct the agreed build. [Whether workshop information is recorded or retained: Jonny to confirm]. [Workshop information lawful basis: Jonny to confirm].`

Recommendation: Option B. It distinguishes each provider, purpose and unresolved decision.

The final notice must name the providers and state where they process and store data. Any international transfer and safeguard also needs confirming.

## P4 director bio

### Option A

`Jonny Bowker is a Law Society of Scotland accredited AI Expert and practitioner. He has worked across Fortune 500 companies and mid-caps. Through Agent in the Room™, he turns business problems into clear briefs and directs what gets built.`

### Option B

`Jonny Bowker is a Law Society of Scotland accredited AI Expert and practitioner, working across Fortune 500 companies and mid-caps. He leads Agent in the Room™, shaping business pressure into a clear brief and a practical direction for the build.`

Recommendation: Option A. It is plainer, avoids the banned word in the current bio and keeps every sentence within the copy limit.

## Inputs and omissions

- Confirm the recording and transcription provider.
- Confirm every AI provider that receives the transcript.
- Confirm where each provider processes and stores the data.
- Confirm the retention period and lawful basis with legal advice.
- Confirm whether participants can take the call without recording.
- Confirm whether workshop information is recorded or otherwise retained.
- Add an operational notice before recording begins, not only website copy.
