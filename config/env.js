/**
 * Reads env vars (via dotenv) and exports a frozen, validated config object.
 * Usage: `import config from '../config/env.js'`.
 */

const REQUIRED_VARS = ['BASE_URL'];

/** @returns {Readonly<Record<string, string>>} frozen config object */
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

    baseUrl: (process.env.BASE_URL || '').replace(/\/+$/, ''),
    apiPrefix: apiVersion ? `/${apiVersion.replace(/^\/+/, '')}` : '',
    apiBaseUrl: `${(process.env.BASE_URL || '').replace(/\/+$/, '')}${
      apiVersion ? `/${apiVersion.replace(/^\/+/, '')}` : ''
    }`,

    requestTimeout: Number(process.env.REQUEST_TIMEOUT) || 10000,

    auth: {
      token: process.env.AUTH_TOKEN || '',
    },

    reports: {
      mochawesomeDir: process.env.MOCHAWESOME_REPORT_DIR || 'reports/mochawesome',
      junitPath: process.env.JUNIT_REPORT_PATH || 'reports/junit/results.xml',
      allureResultsDir: process.env.ALLURE_RESULTS_DIR || 'reports/allure-results',
    },
  });
}

/** Lazily computed, cached config. */
let cached;

/** @returns {Readonly<Record<string, string>>} */
export function getConfig() {
  if (!cached) {
    cached = loadConfig();
  }
  return cached;
}

/** Default export: `import config from '../config/env.js'`. */
export default getConfig();
