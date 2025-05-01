const crypto = require('crypto');
const { msalInstance } = require('../api/auth/msalClient');

function base64URLEncode(buffer) {
  return buffer.toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function sha256(buffer) {
  return crypto.createHash('sha256').update(buffer).digest();
}

const REDIRECT_URI = `${process.env.AUTH_URI}/api/auth/redirect`;

module.exports = async function (context, req) {
  try {
    // Generate PKCE code verifier and challenge
    const codeVerifier = base64URLEncode(crypto.randomBytes(32));
    const codeChallenge = base64URLEncode(sha256(Buffer.from(codeVerifier)));

    const authCodeUrlParameters = {
      scopes: ['openid', 'profile', 'User.Read'],
      redirectUri: REDIRECT_URI,
      codeChallenge,
      codeChallengeMethod: 'S256'
    };

    const authUrl = await msalInstance.getAuthCodeUrl(authCodeUrlParameters);

    // Set a cookie with codeVerifier (temporary, not secure in prod)
    const cookie = `codeVerifier=${codeVerifier}; Path=/; HttpOnly; SameSite=Lax`;

    context.res = {
      status: 302,
      headers: {
        'Set-Cookie': cookie,
        'Location': authUrl
      }
    };
  } catch (error) {
    context.log.error('Login redirect error:', error);
    context.res = {
      status: 500,
      body: 'Failed to initiate login'
    };
  }
};