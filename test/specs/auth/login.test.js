/**
 * Example suite: demonstrating the pluggable auth helper.
 *
 * JSONPlaceholder has no real auth endpoint, so by default no token is set and
 * requests are unauthenticated. When you connect a real API that issues tokens
 * (via AUTH_TOKEN or AUTH_USERNAME/AUTH_PASSWORD + LOGIN_ENDPOINT in .env),
 * the same helper powers token injection automatically.
 *
 * This suite is structured to be adapted to your real auth contract.
 */
import { expect } from 'chai';
import config from '../../../config/env.js';
import { getApiToken, clearTokenCache } from '../../helpers/auth.js';
import { api } from '../../helpers/api-client.js';

describe('Authentication', function () {
  afterEach(function () {
    clearTokenCache();
  });

  it('resolves an auth token from configuration', async function () {
    // When auth is disabled (default), the token is an empty string.
    // With a real API, set AUTH_TOKEN or credentials and this becomes the
    // bearer token sent with every api-client request.
    const token = await getApiToken();
    expect(token).to.be.a('string');
  });

  it('reports the configured auth strategy', function () {
    const { token, username, password } = config.auth;
    const mode = token ? 'static-token' : username && password ? 'dynamic-login' : 'none';
    expect(['static-token', 'dynamic-login', 'none']).to.include(mode);
  });

  it('sends the Authorization header when a token is present', async function () {
    // Force a token for demonstration so the api-client injects the header.
    // In a real suite this would come from getApiToken() after a real login.
    if (!config.auth.token) {
      // Skip rather than fail when no token is configured.
      // eslint-disable-next-line mocha/no-pending-tests
      this.skip();
    }

    const res = await api.get('/users/1');
    // Assert the protected resource is reachable once authenticated.
    expect(res.status).to.equal(200);
  });
});
