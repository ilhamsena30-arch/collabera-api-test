/** Nock helpers to mock downstream/external HTTP calls in tests. */
import nock from 'nock';

/** @param {string} host @param {string} path @param {object} payload @param {number} [status] */
export function mockGet(host, path, payload, status = 200) {
  nock(host).get(path).reply(status, payload);
}

/** @param {string} host @param {string} path @param {object} payload @param {number} [status] */
export function mockPost(host, path, payload, status = 200) {
  nock(host).post(path).reply(status, payload);
}

/** @param {string} host */
export function areMocksDone(host) {
  const pending = nock.pendingMocks();
  const pendingForHost = pending.filter((mock) => mock.startsWith(`${host}/`));
  return pendingForHost.length === 0;
}

/** Removes all Nock interceptors and restores the network. */
export function cleanupNock() {
  nock.cleanAll();
  nock.enableNetConnect();
}

/** Blocks all real network requests except allowed hosts. */
/** @param {string[]} [allowedHosts] */
export function disableRealNetwork(allowedHosts = []) {
  nock.disableNetConnect();
  for (const host of allowedHosts) {
    nock.enableNetConnect(host);
  }
}
