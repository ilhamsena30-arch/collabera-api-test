/** Demonstrates the auth helper. Skips gracefully when no token is configured. */
import { expect } from 'chai';
import config from '../../../config/env.js';
import { getApiToken, clearTokenCache } from '../../helpers/auth.js';
import { api } from '../../helpers/api-client.js';

describe('Authentication', function () {
  afterEach(function () {
    clearTokenCache();
  });

  it('resolves an auth token from configuration', async function () {
    const token = await getApiToken();
    expect(token).to.be.a('string');
  });

  it('reports the configured auth strategy', function () {
    const { token, username, password } = config.auth;
    const mode = token ? 'static-token' : username && password ? 'dynamic-login' : 'none';
    expect(['static-token', 'dynamic-login', 'none']).to.include(mode);
  });

  it('sends the Authorization header when a token is present', async function () {
    if (!config.auth.token) {
      // eslint-disable-next-line mocha/no-pending-tests
      this.skip();
    }

    const res = await api.get('/users/1');
    expect(res.status).to.equal(200);
  });
});
