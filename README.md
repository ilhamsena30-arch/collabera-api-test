# Collaborate API Automation

A modern, best-practice **API Test Automation boilerplate** built with **Mocha** (ES Modules), **SuperTest**, and **Chai**. It currently targets the **GoRest** REST API (`https://gorest.co.in`) and ships runnable tests for the two candidate assessment scenarios. It is designed to be pointed at **any** REST API via environment configuration.

---

## 🎯 Assessment Scenarios (GoRest)

Target API: **https://gorest.co.in** — docs at [gorest.co.in](https://gorest.co.in/)

| #   | Scenario                                                                                                                                                                                   | Deliverable |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------- |
| 1   | Using `https://gorest.co.in/public/v2/users` — **Create** a new employee entry with Name, Gender, Email and Status (active/inactive). **Verify the returned `id` is in numerical format.** | Mocha suite |
| 2   | Using `https://gorest.co.in/public/v2/users` — **Verify the `status` for the first entry is only either `"active"` or `"inactive"`.**                                                      | Mocha suite |

> **Write operations** (POST, PUT, PATCH, DELETE) require a Bearer access token
> passed in the `Authorization` header. **Read operations** (GET) are public.
> Get a free token at https://gorest.co.in/ (see [Getting a token](#-getting-a-gorest-access-token)).

---

## ✨ Features

- **Mocha 11** with ES Modules (`import`/`export`) and root hooks / global fixtures.
- **SuperTest 7** fluent HTTP client wrapper (`test/helpers/api-client.js`).
- **Chai 6** (`expect` style) with reusable assertion helpers.
- **@faker-js/faker** dynamic payload generators + static JSON **fixtures**.
- **Nock** for mocking downstream / external HTTP calls (fully offline test runs).
- **Pluggable authentication** helper — static token or runtime login.
- **dotenv** + `cross-env` environment management (development / staging / production).
- **Reporting**: Mochawesome (HTML), JUnit XML (CI), and Allure.
- **ESLint 10** (flat config) + `eslint-plugin-mocha` + **Prettier**.
- **Husky + lint-staged** pre-commit hooks (lint & format staged files).
- **GitHub Actions** CI pipeline with artifact upload and JUnit reporting.

---

## 📦 Requirements

- **Node.js** ≥ 18 (tested on 20 & 22)
- **npm** (bundled with Node)

---

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Create your environment file (copy template)
# On Windows (PowerShell):
Copy-Item .env.example .env
# On macOS/Linux:
cp .env.example .env

# 3. Run the test suite
npm test
```

By default `npm test` runs against `https://gorest.co.in/public/v2`:

- **Scenario 2** (GET users, verify status) runs out of the box — GET is public.
- **Scenario 1** (POST employee, verify numeric id) requires an access token.
  Add yours to `.env` as `AUTH_TOKEN` (see below) or those tests will **skip**
  gracefully with a clear message.

---

## 🔑 Getting a GoRest Access Token

Scenario 1 (and any write operation) needs a Bearer token:

1. Go to https://gorest.co.in/ and click **Sign in** (GitHub / Google / Microsoft).
2. Once signed in, open **Access tokens**:
   `https://gorest.co.in/my-account/access-tokens`
3. Click **Create Access Token** (optionally tune the rate limit; default is
   90 requests/minute).
4. Copy the token into `.env`:
   ```bash
   # .env
   AUTH_TOKEN=your_generated_token_here
   ```
5. The API client injects it automatically as `Authorization: Bearer <token>`.

> Never commit a real token — `.env` is already git-ignored.

---

## 🚀 Running the Mocha test suites

```bash
npm test            # runs ALL suites against GoRest
npm run test:allure # emits Allure results
npm run report      # opens the Mochawesome HTML report
```

To run only the GoRest scenario suites:

```bash
npx mocha --grep "GoRest" --reporter spec
```

- The GoRest suites live in `test/specs/gorest/`:
  - `scenario-1-create-user.test.js` — Scenario 1
  - `scenario-2-verify-status.test.js` — Scenario 2

---

## 📁 Project Structure

```
.
├── .github/workflows/api-tests.yml   # CI pipeline
├── config/
│   └── env.js                        # Centralised, validated config loader
├── test/
│   ├── helpers/                      # Reusable test utilities
│   │   ├── api-client.js             # SuperTest wrapper (base URL, auth, logging)
│   │   ├── auth.js                   # Pluggable token / login helper
│   │   ├── assertions.js             # Common Chai assertions
│   │   ├── data-generators.js        # faker-based payload builders
│   │   ├── fixture-loader.js         # Reads JSON fixtures from disk
│   │   └── nock-mock.js              # Downstream HTTP mocking helpers
│   ├── fixtures/                     # Static reference JSON data
│   │   ├── users/
│   │   └── posts/
│   ├── specs/                        # Test suites (organised by resource)
│   │   ├── gorest/                   # GoRest assessment scenarios
│   │   │   ├── scenario-1-create-user.test.js   # Scenario 1
│   │   │   └── scenario-2-verify-status.test.js # Scenario 2
│   │   ├── auth/
│   │   └── external/
│   └── .mocha-root-hooks.js          # Root hooks: global setup/teardown + beforeEach/afterEach
├── .env.example                      # Config template (committed)
├── .mocharc.json                     # Mocha configuration
├── reporter-config.json              # mocha-multi-reporters config (Mochawesome + JUnit)
├── eslint.config.js                  # ESLint 10 flat config
├── .prettierrc / .prettierignore     # Prettier config
├── .husky/pre-commit                 # Pre-commit hook
└── package.json
```

---

## 🛠️ Scripts

| Script                       | Description                                     |
| ---------------------------- | ----------------------------------------------- |
| `npm test`                   | Run tests against the `development` environment |
| `npm run test:staging`       | Run tests against `staging`                     |
| `npm run test:production`    | Run tests against `production`                  |
| `npm run test:watch`         | Run tests in watch mode                         |
| `npm run test:single "grep"` | Run only matching tests (Mocha `--grep`)        |
| `npm run test:allure`        | Run tests emitting Allure results               |
| `npm run report`             | Merge + open the Mochawesome HTML report        |
| `npm run report:allure`      | Generate + open the Allure report               |
| `npm run lint`               | ESLint check                                    |
| `npm run lint:fix`           | ESLint autofix                                  |
| `npm run format`             | Prettier write                                  |
| `npm run format:check`       | Prettier check (used in CI)                     |

---

## 🌍 Environment Configuration

Copy `.env.example` to `.env` and adjust. Key variables:

| Variable                          | Purpose                                    |
| --------------------------------- | ------------------------------------------ |
| `BASE_URL`                        | API base URL (no trailing slash)           |
| `API_VERSION`                     | Optional version prefix, e.g. `/v1`        |
| `REQUEST_TIMEOUT`                 | Per-request timeout (ms)                   |
| `AUTH_TOKEN`                      | Static bearer token (optional)             |
| `AUTH_USERNAME` / `AUTH_PASSWORD` | Credentials for dynamic login (optional)   |
| `LOGIN_ENDPOINT`                  | Login path used by the dynamic auth helper |

Choose the active environment with `NODE_ENV` (the npm scripts set this via `cross-env`).

### Pointing at a different API

1. Set `BASE_URL` (and `API_VERSION`) in `.env`.
2. If the API requires a static token, set `AUTH_TOKEN` — the `api-client`
   wrapper injects it automatically as a `Bearer` header.
3. If it uses username/password login, set `AUTH_USERNAME`, `AUTH_PASSWORD`,
   and `LOGIN_ENDPOINT`. Adapt `loginAndGetToken()` in
   `test/helpers/auth.js` to your API's login response contract.
4. Update or add spec suites under `test/specs/`.

---

## 🔐 Authentication

The auth helper supports two strategies:

- **Static token** — set `AUTH_TOKEN`; injected as `Authorization: Bearer <token>`.
- **Dynamic login** — set credentials + `LOGIN_ENDPOINT`; a token is obtained at
  runtime and cached (see `enableDynamicAuth()` in global setup).

JSONPlaceholder has no real auth, so the included auth suite demonstrates the
pattern and skips gracefully when no token is configured.

---

## 🧪 Writing a New Test

```js
import { expect } from 'chai';
import { api } from '../../helpers/api-client.js';
import { generateUserPayload } from '../../helpers/data-generators.js';

describe('POST /users', function () {
  it('creates a user', async function () {
    const res = await api.post('/users').send(generateUserPayload());
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('id');
  });
});
```

Save it under `test/specs/<resource>/<name>.test.js` — Mocha discovers it via the
`test/**/*.test.js` glob in `.mocharc.json`.

---

## 📊 Reports

After a run:

- **Mochawesome**: `reports/mochawesome/*.json` (+ HTML) — open with `npm run report`.
- **JUnit**: `reports/junit/results.xml` — consumed by CI / Jenkins / Azure DevOps.
- **Allure**: run `npm run test:allure`, then `npm run report:allure`.

---

## 🤝 Contributing / Best Practices

- Organise suites **by resource** (`users`, `auth`, `orders`), not by HTTP verb.
- Keep request/assertion logic in `helpers/` — never duplicate it in specs.
- Use `data-generators` for dynamic data and `fixtures` for stable reference data.
- Never commit real secrets — only `.env.example` is committed.
- Pre-commit hooks run ESLint + Prettier on staged files automatically.

---

## 📄 License

MIT
