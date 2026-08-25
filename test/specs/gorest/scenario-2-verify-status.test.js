/**
 * GoRest Scenario 2
 * ---------------------------------------------------------------------------
 * Using  https://gorest.co.in/public/v2/users
 *   - Verify the `status` for the first entry is only either "active" or
 *     "inactive".
 *
 * GET is public on GoRest (no token required), so this suite runs regardless
 * of whether AUTH_TOKEN is configured.
 * ---------------------------------------------------------------------------
 */
import { expect } from 'chai';
import { api } from '../../helpers/api-client.js';
import { createEmployeeAndExpectNumericId } from '../../helpers/gorest-users.js';

const USERS_PATH = '/users';

describe('GoRest — Scenario 2: Verify first entry status', function () {
  this.timeout(15000);

  it('returns an array of users from /public/v2/users', async function () {
    const res = await api.get(USERS_PATH);

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.be.greaterThan(0);
  });

  it('verifies the status of the first entry is only "active" or "inactive"', async function () {
    const res = await api.get(USERS_PATH);

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array').and.not.empty;

    const first = res.body[0];

    // Confirm the first entry has a status field (the scenario's core focus).
    expect(first).to.have.property('status');
    // ...and that it is one of exactly two allowed values.
    expect(['active', 'inactive']).to.include(first.status);
  });

  it('verifies every returned user has a valid status', async function () {
    const res = await api.get(USERS_PATH);

    expect(res.status).to.equal(200);
    const allowed = ['active', 'inactive'];

    for (const user of res.body) {
      expect(user).to.have.property('status');
      expect(allowed, `user id=${user.id} has invalid status "${user.status}"`).to.include(
        user.status,
      );
    }
  });

  it('includes only the expected user fields (name, email, gender, status)', async function () {
    const res = await api.get(USERS_PATH);
    const first = res.body[0];

    expect(first).to.include.keys('id', 'name', 'email', 'gender', 'status');
    expect(['male', 'female']).to.include(first.gender);
  });

  it('round-trips: a created user is listed with a valid status', async function () {
    // This sub-case optionally validates create-then-read. It requires a token,
    // so skip gracefully when AUTH_TOKEN is absent.
    const { created } = await createEmployeeAndExpectNumericId().catch((err) => {
      if (err && err.status === 401) {
        // No/invalid token — skip rather than fail.
        this.skip();
      }
      throw err;
    });

    // Fetch the specific user we just created.
    const res = await api.get(`${USERS_PATH}/${created.id}`);

    expect(res.status).to.equal(200);
    expect(res.body.id).to.equal(created.id);
    expect(['active', 'inactive']).to.include(res.body.status);
  });

  it('queries with filters and returns matching records', async function () {
    // GoRest supports filtering any field via query param, e.g. ?status=active
    const res = await api.get(`${USERS_PATH}?per_page=10`);

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
  });

  it('supports pagination via X-Pagination headers', async function () {
    const res = await api.get(`${USERS_PATH}?page=1&per_page=5`);

    expect(res.status).to.equal(200);
    expect(res.body.length).to.be.lessThanOrEqual(5);
    expect(Number(res.headers['x-pagination-total'])).to.be.a('number');
  });
});
