# actai.studio

Astro site for `actai.studio`.

## Requirements

- Node.js `>=22.12.0`
- pnpm
- Python `>=3.11` and `uv` for Spec Kit

## Setup

```sh
pnpm install
```

## Development

Run the Astro dev server in background mode:

```sh
astro dev --background
```

Manage the background server with:

```sh
astro dev status
astro dev logs
astro dev stop
```

## Commands

| Command | Action |
| :-- | :-- |
| `pnpm dev` | Starts the Astro dev server |
| `pnpm build` | Builds the production site to `./dist/` |
| `pnpm preview` | Previews the production build locally |
| `pnpm astro ...` | Runs Astro CLI commands |

## Speckit

This project uses GitHub Spec Kit for spec-driven feature work. Install the Specify CLI with `uv`:

```sh
uv tool install specify-cli
specify version
```

Initialize Speckit in this existing project from the repository root:

```sh
specify init --here --force --integration codex --integration-options="--skills"
```

Use the Speckit workflow for new features:

1. Define or update project principles with `$speckit-constitution`.
2. Write the feature specification with `$speckit-specify`.
3. Resolve ambiguity with `$speckit-clarify`.
4. Generate the implementation plan with `$speckit-plan`.
5. Break the work into tasks with `$speckit-tasks`.
6. Check consistency with `$speckit-analyze`.
7. Implement with `$speckit-implement`.
8. Reconcile remaining work with `$speckit-converge`.

Speckit infrastructure lives under `.specify/`, Codex skills live under `.agents/skills/`, and feature artifacts are created under `specs/`.

## Project Structure

```text
/
├── .agents/
│   └── skills/
├── .specify/
├── public/
├── src/
│   └── pages/
│       └── index.astro
├── astro.config.mjs
├── package.json
└── README.md
```

Astro exposes `.astro` and `.md` files in `src/pages/` as routes. Static assets belong in `public/`.

## Documentation

- [Astro documentation](https://docs.astro.build)
- [Spec Kit](https://github.com/github/spec-kit)
