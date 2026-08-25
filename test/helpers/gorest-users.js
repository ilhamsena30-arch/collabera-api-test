/**
 * GoRest user operation helpers shared across scenario suites.
 * Kept OUT of `.test.js` files so lint rule `mocha/no-exports` stays happy.
 */
import { expect } from 'chai';
import { api } from './api-client.js';
import { generateGoRestUserPayload } from './data-generators.js';

const USERS_PATH = '/users';

/**
 * Scenario 1 (core) — create an employee and assert the returned id is numeric.
 *
 * @param {object} [options]
 * @param {Record<string, unknown>} [options.overrides] field overrides for the payload
 * @returns {Promise<{payload: object, created: object}>}
 */
export async function createEmployeeAndExpectNumericId({ overrides = {} } = {}) {
  const payload = generateGoRestUserPayload(overrides);

  const res = await api.post(USERS_PATH).send(payload);

  // A successful create returns 201 Created.
  expect(res.status).to.equal(201);

  // The response body should echo the created employee.
  expect(res.body).to.be.an('object');

  // Verify the id is present and in numerical format (a number).
  expect(res.body).to.have.property('id');
  expect(res.body.id).to.be.a('number');
  // Number.isInteger guarantees an actual integer, not a float/string.
  expect(Number.isInteger(res.body.id)).to.equal(true);

  // Confirm the rest of the payload round-trips.
  expect(res.body.name).to.equal(payload.name);
  expect(res.body.gender).to.equal(payload.gender);
  expect(res.body.email).to.equal(payload.email);
  expect(res.body.status).to.equal(payload.status);

  return { payload, created: res.body };
}
