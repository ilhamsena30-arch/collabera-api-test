/** SuperTest wrapper with base URL, auth injection, timeout and optional logging. */
import request from 'supertest';
import config from '../../config/env.js';

const LOG_REQUESTS = process.env.LOG_API_REQUESTS === 'true';

/** @param {import('supertest').Test} test */
function applyAuthHeader(test) {
  if (config.auth.token) {
    test.set('Authorization', `Bearer ${config.auth.token}`);
  }
  return test;
}

/** @param {import('supertest').Test} test */
function applyRequestLogging(test) {
  if (LOG_REQUESTS) {
    test.then(
      (res) => console.log(`[API] ${test.method} ${test.url} -> ${res.status}`),
      (err) => console.error(`[API] ${test.method} ${test.url} FAILED`, err.message),
    );
  }
  return test;
}

/** @param {string} method HTTP method @param {string} path relative path */
function apiRequest(method, path) {
  const test = request(config.apiBaseUrl)[method](path);
  test.set('Accept', 'application/json');
  applyAuthHeader(test);
  test.timeout(config.requestTimeout);
  return applyRequestLogging(test);
}

/** HTTP verb facade: api.get('/users'), api.post('/users').send(body), etc. */
export const api = {
  get: (path) => apiRequest('get', path),
  post: (path) => apiRequest('post', path),
  put: (path) => apiRequest('put', path),
  patch: (path) => apiRequest('patch', path),
  delete: (path) => apiRequest('delete', path),
};

/** Raw SuperTest access for one-off/advanced requests. */
export function rawRequest() {
  return request(config.apiBaseUrl).set('Accept', 'application/json');
}
