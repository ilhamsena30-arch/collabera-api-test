/**
 * GoRest Scenario 1
 * ---------------------------------------------------------------------------
 * Using  https://gorest.co.in/public/v2/users
 *   - Create a new employee entry with Name, Gender, Email and Status
 *     (active or inactive).
 *   - Verify the returned `id` is in numerical format.
 *
 * NOTE: POST requires a Bearer access token. Paste yours into `.env` as
 * AUTH_TOKEN (get one free at https://gorest.co.in/). Without a token the
 * API returns 401 and these tests are skipped with a helpful message.
 * ---------------------------------------------------------------------------
 */
import { expect } from 'chai';
import config from '../../../config/env.js';
import { api } from '../../helpers/api-client.js';
import { generateGoRestUserPayload } from '../../helpers/data-generators.js';
import { createEmployeeAndExpectNumericId } from '../../helpers/gorest-users.js';

const USERS_PATH = '/users';

describe('GoRest — Scenario 1: Create an employee', function () {
  this.timeout(15000);

  before(function () {
    // GoRest write operations need a Bearer token. Skip the whole suite (with
    // a clear message) if none is configured so the run doesn't hard-fail.
    if (!config.auth.token) {
      this.skip();
    }
  });

  it('creates a new employee entry and verifies the id is numerical', async function () {
    await createEmployeeAndExpectNumericId();
  });

  it('creates an employee with a fixed (deterministic) status', async function () {
    await createEmployeeAndExpectNumericId({ overrides: { status: 'active' } });
  });

  it('rejects an invalid email with 422 validation errors', async function () {
    const payload = generateGoRestUserPayload({ email: 'not-an-email' });

    const res = await api.post(USERS_PATH).send(payload);

    // GoRest returns 422 (Unprocessable Entity) when validation fails.
    expect(res.status).to.equal(422);
  });

  it('returns 401 when no/invalid token is provided', async function () {
    // Force-remove the auth header by sending a request without the injected
    // token via the raw request binding.
    const res = await api
      .post(USERS_PATH)
      .set('Authorization', '')
      .send(generateGoRestUserPayload());

    expect(res.status).to.equal(401);
  });
});
