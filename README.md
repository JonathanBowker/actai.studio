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

## Kling Video Assets Through Claude

This repo's `.mcp.json` registers Kling's **official hosted MCP server** at
`https://kling.ai/mcp`. No third-party wrapper or local Kling server is needed.
The international endpoint is for accounts on `kling.ai`.

### Authentication and Secrets

The official MCP connection uses browser OAuth, not the Open API access-key and
secret-key pair. Sign in with the Act AI Studio Kling account and approve access.
Claude manages the OAuth credentials outside the repo; never copy them into
`.mcp.json`, this README, public assets, or source control.

The originally requested environment-variable API-key authentication is not the
documented authentication flow for this official MCP server. Do not substitute
Open API keys or manually extracted browser tokens. If using the separate Kling
Open API in another workflow, keep its keys in environment variables or the
ignored `.env`; they are not needed for this MCP connector. No secrets are
included in the shared configuration.

### Claude Code

1. Install Claude Code using Anthropic's official instructions, if needed.
2. Start `claude` from this repo, trust the workspace, and approve the `klingai`
   project MCP server. The committed `.mcp.json` already supplies the connection.
3. Run `/mcp`, select `klingai`, and complete browser sign-in with the ACT account.
4. Ask Claude to check the authenticated identity, credits and available video
   tools/models without generating anything. Verify the ACT account before
   spending credits. Do not register a duplicate server in another scope.

To recreate the project entry if it is removed:

```sh
claude mcp add --transport http klingai --scope project https://kling.ai/mcp
```

Each teammate must approve and authenticate their own client. Reconnect through
`/mcp` if the session expires; never commit another user's credential cache.

### Claude Web / Desktop Custom Connector

The repo configuration does not automatically add a connector to claude.ai.
In Claude, open **Customize > Connectors > Add > Custom > Web** (some clients
label this **Add custom connector**). Name it **ACT Kling AI**, enter
`https://kling.ai/mcp`, keep detected OAuth authentication, and sign in with the
ACT account. Enable the connector in the conversation. For Claude Team, an
organization owner must add it under **Organization settings > Connectors**;
members then connect individually. No API-key request header is required.

### Connectivity Test and Asset Workflow

After authenticated discovery succeeds, request exactly one text-to-video test:

> Generate one 5-second 16:9 video of a matte-black circular acoustic membrane
> under soft studio lighting. One subtle ripple, fixed camera, no text, no logo,
> no music and no voiceover. Use the lowest-cost compatible available model.
> Submit once, retain its generation ID, then query that task until it succeeds
> or fails. Do not retry submission if the response is ambiguous.

This is a paid generation and must use the verified ACT account. Connectivity
is confirmed only when the task succeeds and its video can be retrieved and
played. Save review assets outside `public/`; put approved, optimized videos in
`public/videos/` only when placement is requested. The AIR production brief in
`.agents/skills/kling-video/references/air-film.md` remains **10 seconds**.
Composite the original AIR SVG during editing to preserve its exact geometry.

Setup status (12 October 2026): project configuration and public OAuth discovery
verified. The MCP endpoint returns HTTP 401 without authentication and its OAuth
metadata returns HTTP 200. Claude Code is not installed on the setup machine;
Claude custom-connector registration, ACT account sign-in and the paid test
generation are still pending. No credits have been spent.

References: [Kling's official Claude Code setup](https://kling.ai/blog/claude-code-kling-mcp-food-promo-workflow?tab=ai-tools-creation),
[Claude Code MCP setup](https://code.claude.com/docs/en/mcp),
[Claude custom connectors](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp).

## Documentation

- [Astro documentation](https://docs.astro.build)
- [Spec Kit](https://github.com/github/spec-kit)
