/**
 * SuperTest-based API client wrapper.
 *
 * Provides a pre-configured request facade so specs don't repeat base URL,
 * headers, auth injection, or logging on every call.
 *
 * Usage:
 *   import { api } from './api-client.js';
 *   const res = await api.get('/users/1');
 *   const res = await api.post('/users').send(payload);
 */
import request from 'supertest';
import config from '../../config/env.js';

/** Enabled by default; disable in CI noise-sensitive setups via env. */
const LOG_REQUESTS = process.env.LOG_API_REQUESTS === 'true';

/**
 * Adds the Authorization header if an auth token is available.
 * @param {import('supertest').Test} test
 * @returns {import('supertest').Test}
 */
function applyAuthHeader(test) {
  if (config.auth.token) {
    test.set('Authorization', `Bearer ${config.auth.token}`);
  }
  return test;
}

/**
 * Optionally logs the outgoing request for debugging.
 * @param {import('supertest').Test} test
 * @returns {import('supertest').Test}
 */
function applyRequestLogging(test) {
  if (LOG_REQUESTS) {
    // Log after the request completes.
    test.then(
      (res) => console.log(`[API] ${test.method} ${test.url} -> ${res.status}`),
      (err) => console.error(`[API] ${test.method} ${test.url} FAILED`, err.message),
    );
  }
  return test;
}

/**
 * Builds a request bound to the configured API base URL.
 * @param {string} method HTTP method
 * @param {string} path relative path (e.g. '/users/1')
 * @returns {import('supertest').Test}
 */
function apiRequest(method, path) {
  const test = request(config.apiBaseUrl)[method](path);
  test.set('Accept', 'application/json');
  applyAuthHeader(test);
  test.timeout(config.requestTimeout);
  return applyRequestLogging(test);
}

/**
 * Convenience facade mirroring the common HTTP verbs.
 * @example
 *   api.get('/users')        api.post('/users').send(body)
 *   api.put('/users/1')      api.patch('/users/1')
 *   api.delete('/users/1')
 */
export const api = {
  get: (path) => apiRequest('get', path),
  post: (path) => apiRequest('post', path),
  put: (path) => apiRequest('put', path),
  patch: (path) => apiRequest('patch', path),
  delete: (path) => apiRequest('delete', path),
};

/**
 * Raw access to SuperTest for advanced / one-off requests.
 * @returns {import('supertest').SuperTest}
 */
export function rawRequest() {
  return request(config.apiBaseUrl).set('Accept', 'application/json');
}
