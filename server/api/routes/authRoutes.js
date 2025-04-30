const express = require('express');
const { msalInstance } = require('../auth/msalClient');
const crypto = require('crypto');

const router = express.Router();
const REDIRECT_URI = 'http://localhost:3001/auth/redirect';

function base64URLEncode(buffer) {
  return buffer.toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function sha256(buffer) {
  return crypto.createHash('sha256').update(buffer).digest();
}

// Step 1: Login request (redirect to Azure)
router.get('/login', (req, res) => {
  const codeVerifier = base64URLEncode(crypto.randomBytes(32));
  const codeChallenge = base64URLEncode(sha256(Buffer.from(codeVerifier)));
  req.session.codeVerifier = codeVerifier;

  const authCodeUrlParameters = {
    scopes: ["openid", "profile", "User.Read"],
    redirectUri: REDIRECT_URI,
    codeChallenge,
    codeChallengeMethod: 'S256'
  };

  msalInstance.getAuthCodeUrl(authCodeUrlParameters)
    .then((response) => res.redirect(response))
    .catch((error) => res.status(500).send(error.toString()));
});

// Step 2: Redirect handler (after login)
router.get('/redirect', async (req, res) => {
  const tokenRequest = {
    code: req.query.code,
    scopes: ["User.Read"],
    redirectUri: REDIRECT_URI,
    codeVerifier: req.session.codeVerifier
  };

  try {
    const tokenResponse = await msalInstance.acquireTokenByCode(tokenRequest);
    req.session.user = tokenResponse.account;
    res.redirect('http://localhost:5173');
  } catch (error) {
    console.error('Token acquisition failed:', error);
    res.status(500).send('Authentication error');
  }
});

// Step 3: Session check
router.get('/me', (req, res) => {
  if (req.session.user) {
    res.json({ name: req.session.user.name });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

// Step 4: Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('https://login.microsoftonline.com/common/oauth2/logout?post_logout_redirect_uri=http://localhost:5173');
  });
});

module.exports = router;
