/**
 * Auth helper. Two strategies:
 *  - Static token: set AUTH_TOKEN (injected by api-client automatically).
 *  - Dynamic login: set AUTH_USERNAME/AUTH_PASSWORD/LOGIN_ENDPOINT.
 */
import config from '../../config/env.js';
import { rawRequest } from './api-client.js';

let cachedToken = '';
let dynamicAuthEnabled = false;

/** Enables runtime login-based token acquisition (call once in setup). */
export function enableDynamicAuth() {
  dynamicAuthEnabled = true;
}

/** @returns {Promise<string>} current bearer token, logging in if enabled & cached empty. */
export async function getApiToken() {
  if (dynamicAuthEnabled && !cachedToken) {
    cachedToken = await loginAndGetToken();
  }
  return cachedToken || config.auth.token || '';
}

/** Logs in and returns a token. Adapt token field / shape to your API. */
export async function loginAndGetToken() {
  const { username, password, loginEndpoint } = config.auth;

  if (!username || !password) {
    throw new Error('Dynamic auth requires AUTH_USERNAME and AUTH_PASSWORD in .env');
  }

  const res = await rawRequest().post(loginEndpoint).send({ username, password });

  if (res.status !== 200) {
    throw new Error(`Login failed with status ${res.status}`);
  }

  // Common shapes: { token } | { access_token } | { data: { token } }
  const token = res.body.token || res.body.access_token || res.body.data?.token;

  if (!token) {
    throw new Error('Login response did not contain a token');
  }

  return token;
}

/** Clears the cached token (e.g. in an afterEach for isolation). */
export function clearTokenCache() {
  cachedToken = '';
}
