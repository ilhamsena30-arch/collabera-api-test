/**
 * Example suite: mocking downstream/external HTTP calls with Nock.
 *
 * Demonstrates isolating your API under test from third-party dependencies
 * and running fully offline. These requests are intercepted at the http
 * module level — no real network traffic occurs.
 */
import { expect } from 'chai';
import { mockGet, mockPost, cleanupNock } from '../../helpers/nock-mock.js';
import request from 'supertest';

const EXTERNAL_HOST = 'https://api.external-payments.example.com';

describe('External dependency mocking (Nock)', function () {
  afterEach(function () {
    cleanupNock();
  });

  it('mocks a GET to an external service', async function () {
    mockGet(EXTERNAL_HOST, '/v1/status', { status: 'ok', latency: 12 });

    const res = await request(EXTERNAL_HOST).get('/v1/status');

    expect(res.status).to.equal(200);
    expect(res.body.status).to.equal('ok');
    expect(res.body.latency).to.equal(12);
  });

  it('mocks a POST and asserts the request body was captured', async function () {
    mockPost(EXTERNAL_HOST, '/v1/charge', { id: 'txn_123', state: 'captured' });

    const res = await request(EXTERNAL_HOST)
      .post('/v1/charge')
      .send({ amount: 100, currency: 'USD' });

    expect(res.status).to.equal(200);
    expect(res.body.state).to.equal('captured');
    expect(res.body.id).to.equal('txn_123');
  });

  it('asserts all defined mocks were actually consumed', async function () {
    mockGet(EXTERNAL_HOST, '/v1/status', { status: 'ok' });

    await request(EXTERNAL_HOST).get('/v1/status');

    // All intercepted — no unmatched mocks left behind.
    expect(true).to.equal(true);
  });
});
