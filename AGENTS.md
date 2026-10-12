# ACT Website — Development Instructions

Framework: Astro
Editor: VS Code
AI Assistant: Codex

## Development

Check the installed Astro version before using version-specific commands.

For Astro 7+, start the development server in background mode:

npx astro dev --background

Manage the server using:

npx astro dev status
npx astro dev logs
npx astro dev stop

- Check whether the server is already running before starting another.
- Reuse the existing server whenever possible.
- Do not restart the server unless necessary.
- Do not repeatedly run builds or checks.
- Use targeted checks during development.
- Run a full production build when preparing for deployment.

## Codex Efficiency

- Minimise token and context usage.
- Inspect only files relevant to the current task.
- Do not scan the entire project unless necessary.
- Avoid reading large files unnecessarily.
- Make targeted edits rather than rewriting components.
- Preserve existing functionality.
- Reuse existing components, styles and utilities.
- Avoid unnecessary refactoring.
- Do not install dependencies without approval.
- Do not generate documentation unless requested.
- Keep explanations and responses concise.
- Do not repeat information already established.
- Ask before making significant architectural changes.

## Design Rules

- Preserve the established ACT visual identity.
- Maintain existing desktop and mobile layouts unless instructed.
- Follow existing typography, spacing and colour systems.
- Preserve existing animations and interactions.
- Keep components modular and reusable.
- Avoid unnecessary libraries and dependencies.
- Prioritise performance and accessibility.

## Workflow

1. Identify the relevant files.
2. Inspect only what is necessary.
3. Make the smallest effective changes.
4. Verify the affected functionality.
5. Summarise changes in 2–3 sentences.

## Documentation

Official documentation:
https://docs.astro.build

Consult documentation only when required for the task.

Routing:
https://docs.astro.build/en/guides/routing/

Components:
https://docs.astro.build/en/basics/astro-components/

Framework Components:
https://docs.astro.build/en/guides/framework-components/

Content Collections:
https://docs.astro.build/en/guides/content-collections/

Styling:
https://docs.astro.build/en/guides/styling/

Internationalisation:
https://docs.astro.build/en/guides/internationalization/

## Important

Do not make unrelated changes.

Do not expand the scope of a task without approval.

Prioritise accuracy, minimal changes and efficient execution.