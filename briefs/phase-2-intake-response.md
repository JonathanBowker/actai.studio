# Phase 2 Intake Response

Date: 2026-10-05  
Status: waiting for decisions before build work

## Pushback Before Building

I agree with the priority change: J5 should be first. The current `mailto:` form is a delivery risk, not just an analytics gap. I should not build the copy fixes before the contact path can actually deliver.

I would not commit the existing local changes until you confirm that is still wanted. The working tree includes the earlier copy edits, untracked generated images and the Phase 1 assessment files. I can commit them as `pre-review copy changes`, but I want that confirmed because it will include brief files and untracked images unless you tell me to exclude them.

## J5 Contact Form Delivery Options

Recommended approach: use a serverless form endpoint, not `mailto:`.

Option A: DigitalOcean App Platform backend route
Use Astro server output or a small API endpoint that sends the enquiry email through an email provider. This keeps the form on-site and gives us proper success/error states. It needs an email sending service and environment variables.

Option B: External form service
Use a hosted form provider endpoint. This is fastest, but it adds a third-party service and the privacy notice must name it.

Option C: Calendar link for booked calls, plus a small "Not sure yet" form
If you have a calendar link, primary CTAs can link out to booking. The contact form remains only for uncertain or non-booking enquiries. It still needs real delivery if it stays.

My recommendation: Option A if you want control and reliability. Option B only if speed matters more than ownership. Option C can sit alongside either, but it does not remove the need for a real form unless `/contact` becomes link-only.

I will not add dependencies, providers or third-party scripts until you approve the route.

## Decisions Needed

1. Confirm whether to commit current local changes as `pre-review copy changes`.
   Include or exclude `briefs/` and the untracked image files?

2. Choose J5 delivery approach.
   Option A DigitalOcean backend route, Option B external form service, or Option C calendar-first plus real fallback form.

3. Provide a calendar link, or confirm all booking language should become `Request a 30-minute call`.

4. Fill C1 duration.
   `Agent in the Room is a live working session with an ACT director. In [duration], we find the problem worth solving and leave you with a scoped AI direction.`

5. Pick three to five C6 sectors.
   Choose sectors where there is delivery experience or live conversation, and no client names without consent.

6. Provide C4 sources and meaning for:
   `10/10`, `80%`, `£100,000`, `100+`.
   Also confirm whether `£100,000` is price, value, saving or opportunity size.

7. Confirm T4 brand lock.
   Proposed: `Act AI Studio` in titles/body, `Act.` as sign-off, `actai.studio` only as URL. Legal footer only says `a trading name of Advanced Analytica Limited` if legally true.

8. Confirm whether Cloudflare or DigitalOcean injects analytics, email protection or other scripts in staging/production.

9. Confirm staging host for T1/T6.
   I have `https://actai-studio-6muso.ondigitalocean.app/` from the note.

## Locked Items I Can Build After Decisions

- J6: redirect `/meeting` to `/contact`, and fix pack Markdown links.
- T1: add canonical and noindex guard, including `ondigitalocean.app` hostname check.
- J1: retire overlay and route `Get in touch` to `/contact`.
- J2/J4/J3: use `Request a 30-minute call` unless a calendar link is supplied.
- C2: six nav items and `#governance`, keeping `#ripple-effects` as alias.
- C3: Option B with one decorative image and empty alt.
- C5: `Where AI earns its place.` plus option A support line, remove the forever line.
- C7: Jonny option A, Mark option B.
- C8: no new home section, link FAQ answer and Practice cards to diagnostic pages.
- T3: update privacy, including localStorage disclosure. No banner.
- T5: WCAG 2.2 AA target, with mandatory pause control.
- T7: report only.

## Proposed First Build Step After Approval

Branch: `review/j5-contact-delivery`  
Commit: `fix contact form delivery`

Before that, I need the J5 delivery route and whether to make the pre-review commit with all current local files.
