/**
 * Mocha root-hook plugin (loaded via `require` in `.mocharc.json`).
 * Exposes a `mochaHooks` object with global setup/teardown + per-test hooks.
 */
import config from '../config/env.js';
import { cleanupNock, disableRealNetwork } from './helpers/nock-mock.js';
import { enableDynamicAuth, clearTokenCache } from './helpers/auth.js';

export const mochaHooks = {
  beforeAll() {
    if (config.auth.username && config.auth.password) {
      enableDynamicAuth();
      console.log('[setup] Dynamic auth enabled.');
    }
    if (process.env.BLOCK_EXTERNAL_NETWORK === 'true') {
      disableRealNetwork([]);
      console.log('[setup] External network calls blocked (offline mode).');
    }

    console.log(
      `[setup] Suite starting | env=${config.env} | baseUrl=${config.apiBaseUrl} | isCI=${config.isCI}`,
    );
  },

  afterAll() {
    cleanupNock();
    console.log('[teardown] Suite finished; cleanup complete.');
  },

  beforeEach() {
    clearTokenCache(); // avoid auth state leaking between tests
  },

  afterEach() {
    cleanupNock(); // remove Nock mocks / restore network between tests
  },
};
