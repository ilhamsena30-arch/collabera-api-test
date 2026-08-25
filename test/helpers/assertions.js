/**
 * Reusable Chai-based assertions to keep specs DRY and readable.
 */
import { expect } from 'chai';

/**
 * Asserts the response succeeded (2xx) and that the body is an object with
 * all `requiredKeys` present.
 * @param {import('supertest').Response} res
 * @param {string[]} [requiredKeys]
 */
export function expectSuccessWithKeys(res, requiredKeys = []) {
  expect(res.status).to.be.within(200, 299);
  expect(res.body).to.be.an('object');
  for (const key of requiredKeys) {
    expect(res.body, `body.${key}`).to.have.property(key);
  }
}

/**
 * Asserts an error response: expected status code and an Error-like body
 * containing `message` (or a custom key).
 * @param {import('supertest').Response} res
 * @param {number} status
 * @param {string} [messageProperty]
 */
export function expectError(res, status, messageProperty = 'message') {
  expect(res.status).to.equal(status);
  if (res.body && typeof res.body === 'object') {
    expect(res.body).to.have.property(messageProperty);
  }
}

/**
 * Asserts an array response of a given expected length (exact or range).
 * @param {import('supertest').Response} res
 */
export function expectArray(res) {
  expect(res.status).to.be.within(200, 299);
  expect(res.body).to.be.an('array');
}

/**
 * Asserts a paginated/envelope-shaped response.
 * By default expects `{ data: [...], ... }`.
 * @param {import('supertest').Response} res
 * @param {string} [envelopeKey]
 */
export function expectPaginated(res, envelopeKey = 'data') {
  expectSuccessWithKeys(res, [envelopeKey]);
  expect(res.body[envelopeKey]).to.be.an('array');
}

/**
 * Validates that `res.body` conforms to a subset shape described by
 * `shape` where each value is a Chai assertion string, e.g.
 *   { id: 'a number', name: 'a string' }
 * @param {import('supertest').Response} res
 * @param {Record<string, string>} shape
 */
export function expectBodyShape(res, shape) {
  expect(res.body).to.be.an('object');
  for (const [key, assertion] of Object.entries(shape)) {
    expect(res.body, `body.${key}`).to.have.property(key);
    expect(res.body[key], `body.${key} should be ${assertion}`).to.satisfy(() =>
      runChaiAssertion(res.body[key], assertion),
    );
  }
}

/**
 * Tiny helper mapping human-readable assertion strings to checks.
 * @private
 */
function runChaiAssertion(value, assertion) {
  const normalized = assertion.replace(/\s+/g, ' ').trim();
  if (/a number|an integer|a number/.test(normalized)) return typeof value === 'number';
  if (/a string/.test(normalized)) return typeof value === 'string';
  if (/a boolean/.test(normalized)) return typeof value === 'boolean';
  if (/an array/.test(normalized)) return Array.isArray(value);
  if (/an object/.test(normalized))
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  return true;
}
