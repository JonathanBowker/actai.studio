# Build brief: Discovery Pack kit (v2)

## What this is

A zip a prospect uploads to a ChatGPT Project (or custom GPT) or a Claude Project. The AI reads the pack and runs the ten-question discovery interview with them, by voice or text. At the end it produces a completed answers file the prospect emails or transfers to Advanced Analytica. No network calls, no hosted backend, no auth. The pack must work from uploaded files and project instructions alone.

Source content is the locked "Discovery pack, draft two" text, reproduced in full under Appendix A. Use it verbatim. Don't rewrite the questions, descriptors, probes or close wording except where this brief says otherwise.

## Open decisions (resolve before build)

**1. Consent line.** The first thing the prospect hears. Build whichever Jonny locks:

- **A.** Reference the existing data processing agreement on the AA website by link, ask for a yes, continue.
- **B.** Standalone spoken consent line, names and roles only, ask for a yes, continue.

Either way the agent writes the consent response, option used and timestamp into the output file. Keep the consent line in its own file so it can be swapped without touching the interview.

**2. Output form.** Default is one markdown file per session. Neither ChatGPT nor Claude can produce a downloadable zip inside a project chat without code execution. Don't write any prompt that claims to zip. If Jonny wants a zip, that's `parse_answers.py` on his side.

## Deliverable

`aa-discovery-pack-v2.zip` containing:

```
aa-discovery-pack-v2/
  README.md                      human instructions for the prospect
  MANIFEST.yaml                  pack metadata, file index, version, platform targets
  AGENTS.md                      the agent's operating instructions (system prompt)
  prompts/
    00-consent.md                consent line, option A or B
    01-opener-make.md
    01-opener-work.md
    02-questions.md              questions 1 to 10, descriptors, probes
    03-close.md                  two-part close, voice then text
    04-output-template.md        the answers file the agent must produce
  platform/
    chatgpt-project-instructions.md
    chatgpt-custom-gpt-config.md
    claude-project-instructions.md
  scripts/
    validate_pack.py             checks manifest matches files, prompts complete
    build_zip.py                 produces the zip from the source tree
    parse_answers.py             Jonny's side: returned answers files to structured JSON
  examples/
    sample-answers-make.md
    sample-answers-work.md
  LICENCE.txt
  CHANGELOG.md
```

## File specs

### README.md (for the prospect)

Plain language, under 300 words. Covers: what this is, how to load it into ChatGPT or Claude (two short numbered sequences, one per platform), how to start ("say: start discovery"), that it takes about twenty minutes, that you can do it by voice, and what happens at the end (turn voice off, type the package command, email the file). States that several people in the business can each run their own session. No pricing. No marketing language.

### MANIFEST.yaml

```yaml
pack: aa-discovery-pack
version: 2.0.0
owner: Advanced Analytica Ltd
contact: jonathan@advancedanalytica.co.uk
doors: [make, work]
question_count: 10
probe_limit_per_question: 1
consent_option: A | B
package_trigger: "package my answers"
platforms: [chatgpt-project, chatgpt-custom-gpt, claude-project]
files:
  - path: AGENTS.md
    role: system
    sha256: ...
  - path: prompts/00-consent.md
    role: consent
    sha256: ...
  # one entry per file
output:
  format: markdown
  template: prompts/04-output-template.md
  filename_pattern: "{session_id}.md"
  return_to: jonathan@advancedanalytica.co.uk
```

`validate_pack.py` must fail if any listed file is missing or any hash mismatches.

### AGENTS.md (the system prompt)

The core file. Write it so it pastes into Claude Project instructions or ChatGPT Project instructions without edits. Requirements:

**Identity and scope**
- "You are running the Advanced Analytica discovery interview." No persona, no name.
- If asked anything outside the interview, say it can't help with that here and return to the current question.
- Process only what's in the conversation. Don't infer or add facts about the business.

**Sequence**
- Consent, then name and role, then door selection, then opener, then questions 1 to 10 in order, then close part one, then wait, then close part two on trigger.
- Door selection: ask whether they want to make something or work a process. Accept either word or an obvious synonym. If unclear after one clarification, default to `work`.
- Session ID is `{initials}-{YYYYMMDD}-{door}`.

**One probe rule**
- Each question gets exactly one push-back. After the probe, accept whatever comes back and move on. Never loop. State this as a hard constraint and repeat it beside the question list.
- Question 10 exception: "nothing, this is new" needs no probe.

**Conduct**
- One question at a time. Don't preview the list. Progress markers only as "question three of ten".
- Plain, short, no praise of answers, no summarising back what they said.
- Record each answer internally. Don't show the running record until close part two.

**Voice handling**
- The agent can't reliably detect voice mode. Treat the platform file as authoritative: `platform/*.md` state whether the deployment is voice-capable. If so, assume voice until the typed trigger arrives.
- In voice, read the descriptor only if the prospect asks "what do you mean". In text, show the descriptor under the question.

**Close and output**
- Close part one is spoken and ends the interview. Produce nothing else until the typed trigger.
- `package my answers` is the only phrase that produces the output file. "Send it back", "finish", "done" and similar get close part one repeated, once, then silence.
- On trigger, produce the answers file from `04-output-template.md` in a single code block, followed by the filename and return instruction. Never claim to have sent, saved or zipped anything.

### prompts/02-questions.md

The ten questions as locked, structured as:

```
## Q{n}
QUESTION: ...
DESCRIPTOR: ...
PROBE_IF: ...
PROBE: ...
```

Machine-readable enough that `validate_pack.py` can count ten and confirm each has one probe. Q10 has `PROBE: none`.

### prompts/03-close.md

**Part one, spoken, ends the interview:**

"That's all ten. Turn voice off now and switch to text. When you're back, type: package my answers."

Then wait. If the prospect keeps talking, repeat once, then wait.

**Part two, text, on trigger `package my answers`:**

Output the answers file, then:

"Save this as a file named `{session_id}.md`. Email it to jonathan@advancedanalytica.co.uk, or drop it in the shared folder if Advanced Analytica gave you one. We'll come back with what we've found, what we'd build, and what it costs."

### prompts/04-output-template.md

```
# AA Discovery Answers
session_id:
name:
role:
business:
door: make | work
consent: {option} | {yes/no} | {timestamp}
opener_answer:
q1_goal:
q2_six_months:
q3_metric:
q4_owner_and_signoff:
q5_information_location:
q6_rules:
q7_systems_and_constraints:
q8_team_and_tacit_knowledge:
q9_first_version:
q10_blockers:
probes_used: [question numbers where the probe fired]
completed_at:
```

Fixed keys, no renaming. `parse_answers.py` depends on them.

### platform/

Three short files. Each states exactly what goes where: project name, instructions field (paste AGENTS.md), files to upload (whole pack), conversation starter ("start discovery"), and whether voice is available on that surface. The custom GPT file adds: browsing, code and image capabilities off, knowledge files listed.

### scripts/

Python 3.11, stdlib only, no dependencies.

- `validate_pack.py`: manifest hash check, ten questions present, each with question, descriptor and probe fields, consent file matches `consent_option`, output template keys match the parser's expected keys, `package_trigger` appears in both AGENTS.md and `03-close.md`. Exit non-zero on any failure.
- `build_zip.py`: regenerates hashes into MANIFEST.yaml, runs validate, writes the zip. Deterministic file order.
- `parse_answers.py`: takes one or more returned answers files or a directory, emits JSON. Flags missing keys and empty answers. Groups records by business for multi-stakeholder reconciliation. For Jonny's side, not the prospect.

### examples/

Two completed answers files, one per door, fictional businesses. Used to test `parse_answers.py` and to show the prospect the end state.

## Acceptance tests

1. `python scripts/validate_pack.py` passes on a clean tree.
2. `python scripts/build_zip.py` produces a zip that passes validation when unzipped elsewhere.
3. `python scripts/parse_answers.py examples/` returns two valid JSON records with no missing-key warnings.
4. Paste AGENTS.md into a fresh Claude Project with the pack uploaded. Say "start discovery". Agent asks consent, then name and role, then door, then opener.
5. Give a one-word answer to Q1. Agent probes once. Give a second vague answer. Agent moves to Q2 with no second probe.
6. Answer Q10 with "nothing, this is new". No probe fires.
7. After Q10, agent gives the turn-voice-off instruction and produces no output file.
8. Type "done". Agent repeats the instruction once and produces nothing.
9. Type "package my answers". File appears in one code block with every key present, followed by the filename and email instruction.
10. Repeat tests 4 to 9 in a ChatGPT Project.

## Out of scope

Hosted web app, email sending, zip creation inside the chat, authentication, pricing output, analysis of answers. The AI collects. Jonny reviews.

## Appendix A: locked interview content

OPENER (make): Tell me about the thing you want to make.
OPENER (work): Tell me about the process you want to work.
Descriptor: It might be a video, a campaign, a brand refresh, or content you put out regularly. Or it might be a process your business lives on: lettings, orders, compliance, invoicing, onboarding, or an assistant that holds knowledge your team needs.
Probe: If the answer is a category word only with no specifics, ask once: "Say more, what would that actually look like day to day?"

1. What's the one business goal this needs to serve?
Descriptor: Growing revenue in one line of business. Cutting the time a job takes. Reducing errors or complaints. Winning a type of customer you don't win today. Meeting a regulation you're struggling with.
Probe: If they pick an example verbatim with no detail: "Which part of the business, and how would you measure it?"

2. What should be different in six months if it works?
Descriptor: Describe the business after, not the project. Fewer people chasing paperwork. Content going out weekly instead of monthly. Tenants getting answers the same day.
Probe: If vague: "What would you physically notice walking in on a Monday?"

3. How will you know? What number moves?
Descriptor: Days to complete. Enquiries per week. Cost per job. Views, sign-ups, repeat orders.
Probe: If no metric: "If you don't track that yet, what would you want to start counting?"

4. Who owns this day to day, and who signs it off?
Descriptor: The person who'd use it every day, and the person who approves the money and the risk.
Probe: If one name only: "And who signs off the budget or the risk, if that's someone else?"

5. Where does the information for this live now, and who holds it?
Descriptor: Spreadsheets, email threads, a CRM, a shared drive, paper files, someone's head.
Probe: If a system name only: "Is that complete, or is some of it still in someone's head or in email?"

6. What rules does this work have to respect?
Descriptor: Brand guidelines, contracts and licences, sector regulation, data protection, claims you can't make.
Probe: If "nothing really" or "the usual": "What's the one rule that, if broken, would actually cause a problem?"

7. What systems or channels does it touch, and which can't change?
Descriptor: Accounts package, property system, website, social channels, email.
Probe: If systems named but no constraints: "Which of those is fixed, and which would you happily replace?"

8. Who on your team would work alongside it, and what do they know?
Descriptor: What they're good at, what they're tired of doing, what knowledge isn't written down anywhere.
Probe: If a role only: "What do they know that isn't written down anywhere?"

9. What's the first small version you'd accept?
Descriptor: One report. One video. One step handled without a human. Small enough to see in weeks.
Probe: If the whole finished thing: "What's the smallest piece of that you'd be glad to see working first?"

10. What's got in the way before?
Descriptor: Previous attempts, software that never got used, agencies that didn't land, people who pushed back.
Probe: none. "Nothing, this is new" is a valid answer.

---

Consent option is still open. Lock A or B and this goes to Codex as is.