# Collaborate API Automation

Mocha + SuperTest API test automation project targeting the **GoRest** REST API (`https://gorest.co.in`).

## Executable Files

The runnable test files are the Mocha test suites:

| Scenario                                                                                      | Test file                                            |
| --------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| 1 — Create an employee and verify the returned `id` is numerical (`POST /public/v2/users`)    | `test/specs/gorest/scenario-1-create-user.test.js`   |
| 2 — Verify the first entry's `status` is only `active` or `inactive` (`GET /public/v2/users`) | `test/specs/gorest/scenario-2-verify-status.test.js` |

Supporting reusable code is in `test/helpers/`; Mocha settings are in `.mocharc.json`.

## Prerequisites

- **Node.js** ≥ 18 (tested on 20 & 22) and **npm**.

## How to Open and Execute the Test Files

1. **Open the project** in VS Code: `File → Open Folder` → select this folder.

2. **Install dependencies** (terminal):

   ```bash
   npm install
   ```

3. **Set the API access token (required for Scenario 1 only — write operations):**
   - Get a free token: https://gorest.co.in/ → **Sign in** → **Access tokens** → **Create Access Token**.
   - Paste it into the local `.env` file. The project's automation loads `.env`
     automatically via `dotenv` (configured in `.mocharc.json`). Create `.env`
     from the template if it doesn't exist yet:
     ```bash
     cp .env.example .env     # macOS / Linux
     # or copy the file manually on Windows
     ```
     Then set:
     ```dotenv
     AUTH_TOKEN=your_generated_token_here
     ```
   - **Alternative (per-run / CI):** set it as an environment variable instead of (or in addition to) `.env`:
     - **PowerShell (Windows):**
       ```powershell
       $env:AUTH_TOKEN = "your_generated_token_here"
       ```
     - **macOS / Linux (bash/zsh):**
       ```bash
       export AUTH_TOKEN=your_generated_token_here
       ```
   - ⚠️ Never commit `.env` — it is git-ignored because it contains your token.
   - `GET` requests (Scenario 2) are public and need no token.

4. **Run the tests:**

   ```bash
   npm test          # runs every suite (Scenario 1 & 2 among them)
   ```

   Or run only the GoRest scenario suites:

   ```bash
   npx mocha --grep "GoRest" --reporter spec
   ```

5. **View results:**
   - Console shows pass/skip/fail per test.
   - A Mochawesome HTML report is written to `reports/mochawesome/` — open with:
     ```bash
     npm run report
     ```

> **Note on Scenario 1:** if `AUTH_TOKEN` is unset, the POST suite is skipped
> gracefully (the API would otherwise return `401`). Scenario 2 runs regardless.

## Tip

Edit any `*.test.js` file under `test/specs/` to add or change test cases. Save and re-run `npm test`.
