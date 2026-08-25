/** SuperTest wrapper for the GoRest API (base URL, auth header, timeout, logging). */
import request from 'supertest';

const BASE_URL = 'https://gorest.co.in/public/v2'; // GoRest v2
const REQUEST_TIMEOUT = 10000;
const LOG_REQUESTS = process.env.LOG_API_REQUESTS === 'true';

/** @param {import('supertest').Test} test */
function applyAuthHeader(test) {
  // Static bearer token, injected when AUTH_TOKEN env var is present.
  if (process.env.AUTH_TOKEN) {
    test.set('Authorization', `Bearer ${process.env.AUTH_TOKEN}`);
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
  const test = request(BASE_URL)[method](path);
  test.set('Accept', 'application/json');
  applyAuthHeader(test);
  test.timeout(REQUEST_TIMEOUT);
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
  return request(BASE_URL).set('Accept', 'application/json');
}
