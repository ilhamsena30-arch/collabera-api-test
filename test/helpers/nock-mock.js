/**
 * Helpers for mocking downstream / external HTTP calls with Nock.
 *
 * Use these when you want to isolate your API under test from third-party
 * dependencies (e.g. payment providers, external auth, webhooks).
 *
 * Nock intercepts at the http/https module level. All mocks defined for a
 * host are removed by `cleanupNock`, which is wired into the root hooks so
 * state never leaks across specs.
 */
import nock from 'nock';

/**
 * Defines a mock for a GET request and returns the resolved payload.
 * @param {string} host e.g. 'https://api.external.com'
 * @param {string} path e.g. '/v1/status'
 * @param {object} payload response body
 * @param {number} [status]
 */
export function mockGet(host, path, payload, status = 200) {
  nock(host).get(path).reply(status, payload);
}

/**
 * Defines a mock for a POST request.
 * @param {string} host
 * @param {string} path
 * @param {object} payload
 * @param {number} [status]
 */
export function mockPost(host, path, payload, status = 200) {
  nock(host).post(path).reply(status, payload);
}

/**
 * Returns true if every pending mock for the given host has been consumed.
 * @param {string} host
 * @returns {boolean}
 */
export function areMocksDone(host) {
  const pending = nock.pendingMocks();
  const pendingForHost = pending.filter((mock) => mock.startsWith(`${host}/`));
  return pendingForHost.length === 0;
}

/**
 * Removes all Nock interceptors and restores the HTTP stack.
 * Safe to call in afterEach/after hooks.
 */
export function cleanupNock() {
  nock.cleanAll();
  nock.enableNetConnect();
}

/**
 * Blocks all real network requests except for a denylist of hosts.
 * Call in global setup to make tests deterministic and offline-safe.
 * @param {string[]} [allowedHosts]
 */
export function disableRealNetwork(allowedHosts = []) {
  nock.disableNetConnect();
  for (const host of allowedHosts) {
    nock.enableNetConnect(host);
  }
}
