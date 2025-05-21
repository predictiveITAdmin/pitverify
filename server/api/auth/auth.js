const express = require('express');
const { msalInstance } = require('./msalClient');
const crypto = require('crypto');

const router = express.Router();
const REDIRECT_URI = 'http://localhost:3001/auth/redirect';

// Utility: base64URL and SHA256 (PKCE)
function base64URLEncode(buffer) {
  return buffer.toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}
function sha256(buffer) {
  return crypto.createHash('sha256').update(buffer).digest();
}

// Step 1: Initiate Azure login
router.get('/login', (req,res, next) => {
  const codeVerifier = base64URLEncode(crypto.randomBytes(32));
  const codeChallenge = base64URLEncode(sha256(Buffer.from(codeVerifier)));

  req.session.codeVerifier = codeVerifier;

  req.session.save(async (err) => {
    if (err) {
      console.error("Failed to save session before redirect:", err);
      return next(err);
    }

    try {
      const authCodeUrlParameters = {
        scopes: ["openid", "profile", "User.ReadWrite"],
        redirectUri: REDIRECT_URI,
        codeChallenge,
        codeChallengeMethod: 'S256'
      };

      const authUrl = await msalInstance.getAuthCodeUrl(authCodeUrlParameters);
      res.redirect(authUrl);
    } catch (error) {
      console.error("Failed to generate auth URL:", error);
      res.status(500).send("Failed to initiate authentication");
    }
  });
});

// Step 2: Handle redirect from Azure
router.get('/redirect', async (req,res) => {
  console.log('Received code:', req.query.code);
  console.log('Session codeVerifier exists:', !!req.session.codeVerifier);
  const code = req.query.code;
  const codeVerifier = req.session.codeVerifier;
  console.log(`Session Details: ${req.session}`);

  if (!codeVerifier) {
    return res.status(400).send('Missing code verifier in session');
  }

  const tokenRequest = {
    code,
    scopes: ["User.Read"],
    redirectUri: REDIRECT_URI,
    codeVerifier
  };

  try {
    const tokenResponse = await msalInstance.acquireTokenByCode(tokenRequest);
    req.session.user = tokenResponse.account;

    req.session.save(() => {
      res.redirect('http://localhost:5173');
    });
  } catch (error) {
    console.error('Token acquisition failed:', error);
    res.status(500).send('Authentication error');
  }
});

// Step 3: Check current session
router.get('/me', (req,res) => {
  if (req.session.user) {
    res.json({ name: req.session.user.name });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

// Step 4: Logout
router.get('/logout', (req,res) => {
  req.session.destroy(() => {
    res.redirect('https://login.microsoftonline.com/common/oauth2/logout?post_logout_redirect_uri=http://localhost:5173');
  });
});

module.exports = router;
