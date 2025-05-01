const { msalInstance } = require('../api/auth/msalClient');
const { parse } = require('cookie');

const REDIRECT_URI = `${process.env.AUTH_URI}/api/auth/redirect`;

module.exports = async function (context, req) {
  try {
    const cookies = parse(req.headers.cookie || '');
    const codeVerifier = context.bindingData?.codeVerifier || cookies.codeVerifier;

    if (!codeVerifier) {
      context.res = {
        status: 400,
        body: 'Missing codeVerifier. Make sure session or cookie is set.'
      };
      return;
    }

    const tokenRequest = {
      code: req.query.code,
      scopes: ['User.Read'],
      redirectUri: REDIRECT_URI,
      codeVerifier
    };

    const tokenResponse = await msalInstance.acquireTokenByCode(tokenRequest);

    // Mimic session: return a Set-Cookie header with user info
    const userData = JSON.stringify(tokenResponse.account);
    const cookie = `user=${encodeURIComponent(userData)}; Path=/; HttpOnly; SameSite=None; Secure`;

    context.res = {
      status: 302,
      headers: {
        'Set-Cookie': cookie,
        'Location': `${process.env.CLIENT_URI}/`
      }
    };
  } catch (err) {
    context.log.error('Redirect error:', err);
    context.res = {
      status: 500,
      body: 'Authentication failed'
    };
  }
};
