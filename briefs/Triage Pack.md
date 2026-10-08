# Triage Pack: build spec for Codex

Version 0.1. Draft from the Agent in the Room session of 3 October 2026. Target: the Act.studio Astro site.

## 1. Purpose

A visitor finds the nerve, sees the agent that answers it, and downloads a self-help pack in exchange for contact details. The pack runs in their own Claude or ChatGPT. It works like NHS 111: self-help up to the point they know they need us. Then it points them to Jonny and Mark.

No pricing appears anywhere in this build.

## 2. Homepage section

- A section headed with the hook question: "Where is your time going that it shouldn't be?"
- A carousel of six cards, framed as examples, not the full list.
- Each card carries a nerve heading, a one-line description and a "That sounds like me" button.
- The button links to that agent's individual page.
- Copy states the issue itself. It never addresses a role by name ("CFO, here is your agent" is wrong).

### The six cards

| Card | Covers | Nerve (DRAFT wording, room to confirm) |
| --- | --- | --- |
| Chat Assistant | Knowledge-based chat on brand, compliance, regulation and education | Your people keep answering the same questions. |
| Process Automation | Lead intake, document management, email handling | Leads, forms and inboxes eat hours and still go cold. |
| Document and Knowledge Production | Document automation (PDF, PowerPoint, Word), knowledge packs | Skilled people spend their week building documents. |
| Media | Casting, object capture, storyboarding, production, stitching, approval | Every shoot and edit takes longer and costs more than it should. |
| Compliance and Risk | Regulatory monitoring and horizon scanning, due diligence | You don't know what exposure is building until it's a finding. |
| Workforce | Recruitment, interview placement, onboarding, skills | Hiring, onboarding and skills gaps drain time before work starts. |

Compliance and Risk is a different nerve from the others. It is hidden exposure, not lost time.

## 3. Individual agent page (one per card)

Route: `/agents/[slug]`. Content comes from a content collection, one entry per agent.

Each entry has four fields, in this order:

1. **Name.** The agent title.
2. **Function.** What it does, in one or two sentences.
3. **Problem.** Written as time lost or risk hidden. Never a feature list. This is the nerve stated as the issue.
4. **Solution.** What the agent does about it, in plain terms. It shows we know how to fix it. It doesn't explain how.

Example (Process Automation, lead intake):
- Name: Lead Intake Agent.
- Function: manages the full life cycle of an incoming business lead.
- Problem: leads arrive through forms and inboxes, sit untouched, and go cold.
- Solution: the agent takes the lead, pushes it into the database, follows up by email and keeps the CRM current until the lead closes.

Below the four fields: a short "what's inside the pack" list, the gate form and the download.

## 4. The gate

- Fields: name, email, consent to be contacted. All three required.
- Consent is an unticked checkbox with plain wording.
- Gate wording: contact details in exchange for the self-help pack.
- On submit, the download unlocks. No page reload to a different route.
- Store submissions with the agent slug, timestamp and consent flag. Storage target is a build decision for Codex. Flag it back before choosing.
- UK GDPR applies. Link a privacy notice from the form.

## 5. The download

After the gate, the visitor sees two buttons:

- Open in Claude
- Open in ChatGPT

The visitor chooses. Each button loads the pack. A plain zip download link sits beside them as a fallback.

Codex to confirm how each tool accepts a pre-loaded pack and report any limit. Don't assume a deep link exists.

## 6. The pack (zip, one per agent)

Flat files only, no folders. Contents:

| File | Purpose |
| --- | --- |
| `cover.md` | One short page: what this is, three steps to use it, the nerve, a call to action. |
| `prompt.md` | The diagnostic prompt. Fixed structure, per-agent variables below. |
| `agent-knowledge.md` | What the agent does, the problem it removes, how it fits a business. Source for the Q&A. |

### Fixed structure of `prompt.md`

1. States the use case it is locked to.
2. Asks the prospect questions one at a time, each short, with a likely answer they can accept or change.
3. Keeps going until the real problem surfaces. Stops when a point is settled.
4. Stays on the use case. If the prospect drifts, it steers back.
5. Once the problem is clear, invites questions about the agent and answers from `agent-knowledge.md`.
6. Drops a short call to action at natural points throughout.
7. Closes by writing the transcript to a text file and telling the prospect to email it to `{{CONTACT_EMAIL}}`.
8. Last line: speak to Jonny and Mark, with `{{BOOKING_LINK}}`.

### Per-agent variables

- `{{USE_CASE_NAME}}`
- `{{OPENING_FRAMING}}`
- `{{LOCKED_SUBJECT}}`
- `{{CONTACT_EMAIL}}`
- `{{BOOKING_LINK}}`

Everything else is identical across packs.

### Opening questions (spine, every pack)

1. What is the process doing now?
2. What is wrong or missing?
3. Does a human need to stay in it throughout, step in at checkpoints, or only give input up front?
4. What does success look like?

Follow-ups: tools in use, whether budget is allocated, who else is affected, how urgent it is.

### Pack copy rules

- The prospect sees "questions" and "diagnostic". The word "grilling" and the technique's source stay internal.
- The pack shares what we know about their business. It doesn't tell them how to fix it.
- Transcript emailing is visible and instructed. Nothing is captured covertly.

## 7. Design notes

- Each landing page looks like a branded document, not a form page.
- The email instructions inside the pack are branded: do this, do that, do that.
- Reference for structure only: the Spark site (layout, report download). Study it. Don't copy it.

## 8. Build order

1. Content collection and the four-field agent schema.
2. Six agent pages with draft copy.
3. Homepage carousel.
4. Gate form and storage.
5. Pack generator: template plus variables producing one zip per agent.
6. Claude and ChatGPT load buttons.
7. Analytics on card click, gate submit and download.

## 9. Not in this build

- Function filter (marketing, sales, HR, logistics and so on). Agents will later be tagged against functions and filtered, not duplicated.
- Role layer (CEO, CFO, chief legal, chief risk, head of recruitment). Same agent, role-specific nerve lines.
- Detail pages for the granular agents.

## 10. Open items (room to decide, not Codex)

- Final nerve wording for all six cards. The table above is draft.
- Whether Chat Assistant stays one agent across brand, compliance, regulation and education, or splits.
- Allocation of the sixteen granular agents into the six pages: Casting, Object Capture, Storyboarding, Media Production, Stitching, Media Approval, Interview Placement, Document Automation, Knowledge Packer, Horizon Scanning, Document Management, Lead Intake, Email Reading, Compliance Watch, Due Diligence, Chat Assistant.
- Contact email address and booking link.
- Whether six cards is the right number for a first-time visitor.
- Whether the gate suppresses downloads from senior executives.
- Whether competitor pricing visibility reopens the no-pricing rule. Out of scope here.