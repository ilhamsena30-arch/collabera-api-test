/** Reusable Chai assertions to keep specs DRY. */
import { expect } from 'chai';

/** Asserts a 2xx response whose body is an object with all requiredKeys present. */
/** @param {import('supertest').Response} res @param {string[]} [requiredKeys] */
export function expectSuccessWithKeys(res, requiredKeys = []) {
  expect(res.status).to.be.within(200, 299);
  expect(res.body).to.be.an('object');
  for (const key of requiredKeys) {
    expect(res.body, `body.${key}`).to.have.property(key);
  }
}

/** Asserts an error status and that the body has a message-like property. */
/** @param {import('supertest').Response} res @param {number} status @param {string} [messageProperty] */
export function expectError(res, status, messageProperty = 'message') {
  expect(res.status).to.equal(status);
  if (res.body && typeof res.body === 'object') {
    expect(res.body).to.have.property(messageProperty);
  }
}

/** @param {import('supertest').Response} res */
export function expectArray(res) {
  expect(res.status).to.be.within(200, 299);
  expect(res.body).to.be.an('array');
}

/** Asserts an envelope/paginated shape, e.g. `{ data: [...] }`. */
/** @param {import('supertest').Response} res @param {string} [envelopeKey] */
export function expectPaginated(res, envelopeKey = 'data') {
  expectSuccessWithKeys(res, [envelopeKey]);
  expect(res.body[envelopeKey]).to.be.an('array');
}

/** Asserts body matches a shape map, e.g. `{ id: 'a number' }`. */
/** @param {import('supertest').Response} res @param {Record<string, string>} shape */
export function expectBodyShape(res, shape) {
  expect(res.body).to.be.an('object');
  for (const [key, assertion] of Object.entries(shape)) {
    expect(res.body, `body.${key}`).to.have.property(key);
    expect(res.body[key], `body.${key} should be ${assertion}`).to.satisfy(() =>
      runChaiAssertion(res.body[key], assertion),
    );
  }
}

/** Maps human-readable assertion strings to type checks. */
/** @private */
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
