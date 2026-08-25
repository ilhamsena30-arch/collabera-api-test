/**
 * Pluggable authentication helper.
 *
 * Two auth strategies are supported out of the box:
 *
 *   1. Static token  — set AUTH_TOKEN in .env; the token is injected as a
 *      Bearer header by the api-client wrapper automatically. No runtime call.
 *
 *   2. Dynamic login — set AUTH_USERNAME, AUTH_PASSWORD and LOGIN_ENDPOINT.
 *      `getApiToken()` performs a login at runtime, caches the token, and can
 *      refresh it. Enable by calling `enableDynamicAuth()` (see global-setup).
 *
 * JSONPlaceholder has no real auth, so by default tests are unauthenticated.
 * The design is intentionally pluggable: connect a real API and set the env
 * vars above to enable tokenised requests without touching the specs.
 */
import config from '../../config/env.js';
import { rawRequest } from './api-client.js';

/** In-memory token cache. */
let cachedToken = '';
let dynamicAuthEnabled = false;

/**
 * Enables runtime (login-based) token acquisition.
 * Call once during global setup when using username/password auth.
 */
export function enableDynamicAuth() {
  dynamicAuthEnabled = true;
}

/**
 * Returns the current bearer token, acquiring it via login if needed.
 * @returns {Promise<string>}
 */
export async function getApiToken() {
  if (dynamicAuthEnabled && !cachedToken) {
    cachedToken = await loginAndGetToken();
  }
  return cachedToken || config.auth.token || '';
}

/**
 * Performs a login request and returns the token from the payload.
 * Expected to be adapted to the real API's login contract (e.g. token field
 * name, Bearer vs raw, cookies, etc.).
 * @returns {Promise<string>}
 */
export async function loginAndGetToken() {
  const { username, password, loginEndpoint } = config.auth;

  if (!username || !password) {
    throw new Error('Dynamic auth requires AUTH_USERNAME and AUTH_PASSWORD in .env');
  }

  const res = await rawRequest().post(loginEndpoint).send({ username, password });

  if (res.status !== 200) {
    throw new Error(`Login failed with status ${res.status}`);
  }

  // Adapt to your API's contract. Common shapes:
  //   { token: '...' } | { access_token: '...' } | { data: { token: '...' } }
  const token = res.body.token || res.body.access_token || res.body.data?.token;

  if (!token) {
    throw new Error('Login response did not contain a token');
  }

  return token;
}

/**
 * Clears the cached token (e.g. in an afterEach hook when isolation is needed).
 */
export function clearTokenCache() {
  cachedToken = '';
}
