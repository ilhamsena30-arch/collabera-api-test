/**
 * Centralised environment configuration loader.
 *
 * Reads variables from `process.env` (populated by `dotenv`) and exports a
 * frozen, validated config object consumed by the rest of the test suite.
 *
 * Usage:
 *   import config from '../config/env.js';
 *   const { baseUrl } = config;
 */

const REQUIRED_VARS = ['BASE_URL'];

/**
 * The single source of truth for runtime configuration.
 * @returns {Readonly<Record<string, string>>} frozen config object
 */
export function loadConfig() {
  const missing = REQUIRED_VARS.filter((name) => !process.env[name]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variable(s): ${missing.join(
        ', ',
      )}. Copy .env.example to .env and set the values.`,
    );
  }

  const env = process.env.NODE_ENV || 'development';
  const apiVersion = (process.env.API_VERSION || '').trim();

  return Object.freeze({
    env,
    isCI: process.env.CI === 'true',

    // Base URL of the API under test.
    baseUrl: (process.env.BASE_URL || '').replace(/\/+$/, ''),

    // Optional API version prefix, e.g. "/v1".
    apiPrefix: apiVersion ? `/${apiVersion.replace(/^\/+/, '')}` : '',

    // Full base URL including any version prefix.
    apiBaseUrl: `${(process.env.BASE_URL || '').replace(/\/+$/, '')}${
      apiVersion ? `/${apiVersion.replace(/^\/+/, '')}` : ''
    }`,

    requestTimeout: Number(process.env.REQUEST_TIMEOUT) || 10000,

    // Authentication (pluggable) — see helpers/auth.js.
    auth: {
      token: process.env.AUTH_TOKEN || '',
      username: process.env.AUTH_USERNAME || '',
      password: process.env.AUTH_PASSWORD || '',
      loginEndpoint: process.env.LOGIN_ENDPOINT || '/auth/login',
    },

    // Reporting paths.
    reports: {
      mochawesomeDir: process.env.MOCHAWESOME_REPORT_DIR || 'reports/mochawesome',
      junitPath: process.env.JUNIT_REPORT_PATH || 'reports/junit/results.xml',
      allureResultsDir: process.env.ALLURE_RESULTS_DIR || 'reports/allure-results',
    },
  });
}

/** Pre-computed config for lazily-loaded, memoized access. */
let cached;

/**
 * Returns the cached config, computing it on first access.
 * @returns {Readonly<Record<string, string>>}
 */
export function getConfig() {
  if (!cached) {
    cached = loadConfig();
  }
  return cached;
}

/** Default export for ergonomic `import config from '../config/env.js'`. */
export default getConfig();
