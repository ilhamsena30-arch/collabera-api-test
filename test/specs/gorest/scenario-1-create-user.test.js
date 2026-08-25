/**
 * GoRest Scenario 1: Create an employee and verify id is numerical.
 * POST https://gorest.co.in/public/v2/users (requires Bearer token in .env).
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
    if (!config.auth.token) {
      // eslint-disable-next-line mocha/no-pending-tests
      this.skip(); // write ops need a token; skip when none configured
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

    expect(res.status).to.equal(422);
  });

  it('returns 401 when no/invalid token is provided', async function () {
    const res = await api
      .post(USERS_PATH)
      .set('Authorization', '')
      .send(generateGoRestUserPayload());

    expect(res.status).to.equal(401);
  });
});
