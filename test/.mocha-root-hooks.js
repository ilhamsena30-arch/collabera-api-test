/**
 * Root hook plugin — runs global setup/teardown and per-test hooks.
 *
 * Loaded via the `require` array in `.mocharc.json`. Mocha expects a named
 * export `mochaHooks` (an object or function resolving to an object of hooks).
 */
import config from '../config/env.js';
import { cleanupNock, disableRealNetwork } from './helpers/nock-mock.js';
import { enableDynamicAuth, clearTokenCache } from './helpers/auth.js';

export const mochaHooks = {
  // Global setup — runs once before the full suite.
  beforeAll() {
    // Enable runtime login-based auth if credentials were provided.
    if (config.auth.username && config.auth.password) {
      enableDynamicAuth();
      console.log('[setup] Dynamic auth enabled.');
    }

    // Optionally block real network calls except the API under test.
    // Set BLOCK_EXTERNAL_NETWORK=true in .env to enable.
    if (process.env.BLOCK_EXTERNAL_NETWORK === 'true') {
      disableRealNetwork([]);
      console.log('[setup] External network calls blocked (offline mode).');
    }

    console.log(
      `[setup] Suite starting | env=${config.env} | baseUrl=${config.apiBaseUrl} | isCI=${config.isCI}`,
    );
  },

  // Global teardown — runs once after the full suite completes.
  afterAll() {
    cleanupNock();
    console.log('[teardown] Suite finished; cleanup complete.');
  },

  // Runs before each top-level test in every file.
  beforeEach() {
    // Fresh token cache so auth state never leaks between tests.
    clearTokenCache();
  },

  // Runs after each top-level test in every file.
  afterEach() {
    // Clean up Nock mocks and re-enable the network so a leftover interceptor
    // never bleeds into the next test.
    cleanupNock();
  },
};
