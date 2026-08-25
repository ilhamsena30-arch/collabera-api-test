/**
 * Shared GoRest user helpers. Lives outside test files to satisfy the
 * `mocha/no-exports` lint rule.
 */
import { expect } from 'chai';
import { api } from './api-client.js';
import { generateGoRestUserPayload } from './data-generators.js';

const USERS_PATH = '/users';

/**
 * Creates a GoRest user and asserts the returned id is a positive integer.
 * @param {object} [options]
 * @param {Record<string, unknown>} [options.overrides]
 * @returns {Promise<{payload: object, created: object}>}
 */
export async function createEmployeeAndExpectNumericId({ overrides = {} } = {}) {
  const payload = generateGoRestUserPayload(overrides);
  const res = await api.post(USERS_PATH).send(payload);

  expect(res.status).to.equal(201);
  expect(res.body).to.be.an('object');
  expect(res.body).to.have.property('id');
  expect(res.body.id).to.be.a('number');
  expect(Number.isInteger(res.body.id)).to.equal(true); // numeric, not a string

  expect(res.body.name).to.equal(payload.name);
  expect(res.body.gender).to.equal(payload.gender);
  expect(res.body.email).to.equal(payload.email);
  expect(res.body.status).to.equal(payload.status);

  return { payload, created: res.body };
}
