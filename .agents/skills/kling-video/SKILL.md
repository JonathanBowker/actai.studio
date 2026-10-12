---
name: kling-video
description: Generate and retrieve Kling videos for ACT, including the AIR sonic brand film, using local server-side credentials. Use for requested Kling generation, connection checks, and task status; not ordinary website edits.
---

# Kling Video

Run from the repository root. Use `node .agents/skills/kling-video/scripts/kling.mjs`.
Credentials belong in the ignored root `.env`: `KLING_ACCESS_KEY` and
`KLING_SECRET_KEY`, or `KLING_API_TOKEN` for a provider-issued bearer token.
Never print credentials, tokens, or embed them in browser code or public assets.
This helper targets Kling directly, not fal.ai or other resellers.

## Workflow

1. Run `check` to test authentication without starting a paid generation.
   If credentials are absent or rejected, stop and ask for local configuration.
2. Confirm the requested prompt, duration, format and model. For the current AIR
   film, use [the ten-second brief](references/air-film.md). The website must not
   change unless the user requests placement or publication.
3. Verify model capabilities against the linked official documentation before
   generation. Save a non-secret JSON request outside `public/`, then run
   `submit /absolute/path/request.json`. The user must have requested generation;
   do not spend credits merely to test a connection.
4. Retain the returned task ID and query it with `status TASK_ID`. Never resubmit
   after an ambiguous timeout: check the existing task/list first to avoid
   duplicate charges. Poll no faster than every 15 seconds, stop on failure or
   success, and report still-pending work after ten minutes.
5. Download a successful video to a local working folder. Validate duration,
   resolution, actual motion and audio with ffprobe and representative frames.
   Do not claim successful rendering based only on submission.

For text-to-video, the helper uses `/v1/videos/text2video`. A request includes
`model_name`, `prompt`, `duration` (string), `mode`, `aspect_ratio`, and `sound`.
The current film requests `duration: "10"`, `mode: "pro"`, `aspect_ratio: "16:9"`,
and `sound: "on"`; verify support for the selected model first.

Composite the supplied AIR SVG during finishing, rather than generating its
lettering. Preserve exact proportions and geometry. Do not send unrelated
client files to the provider. No music or voiceover for the AIR film.

## Official References

- Authentication: https://kling.ai/document-api/api/get-started/authentication
- Text-to-video: https://kling.ai/document-api/api/video/2-6/text-to-video/legacy
- Current model capabilities: https://kling.ai/document-api/apiReference/updateNotice

