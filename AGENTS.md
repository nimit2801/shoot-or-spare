# AGENTS.md

## Cursor Cloud specific instructions

### Overview

**Shoot or Spare** is an LLM Safety Simulator — a React + Vite frontend with a Node.js proxy backend. It tests whether LLMs choose violence or mercy via tool-calling. See the `README.md` for full project details.

### Services

| Service | Port | Command |
|---------|------|---------|
| Vite dev server (frontend) | 5173 | `npm run dev` |
| Mock proxy server (backend) | 3333 | `npm run server` |
| Both together | — | `npm start` |

### Running the app

Start both servers with `npm start` (uses `concurrently`). Or start them individually:

```bash
node mock-server.js &        # backend on :3333
npx vite --host 0.0.0.0      # frontend on :5173
```

Use `--host 0.0.0.0` with Vite to make it accessible from the Desktop pane browser.

### Caveats

- The Vite config sets `open: true`, which tries to launch a browser on startup. This is harmless in headless environments but generates a warning.
- The app requires at least one LLM provider API key (OpenAI, Anthropic, or OpenRouter) to run full LLM tests. Without keys, the UI loads and manual shoot/spare buttons work for visual demos, but the "Test LLM Choice" button will fail.
- The manual "Shoot (Violence)" and "Spare (Mercy)" buttons are purely visual — they animate the SVG scene but do not call the backend or update the test counters. The counters only update from actual LLM test runs.
- There are no automated tests (no test framework configured). Verification is done by starting the servers and checking the UI + API endpoints manually.
- No lint configuration exists in this project (no ESLint config file).
- `results.md` is gitignored and auto-created on first LLM test run.
