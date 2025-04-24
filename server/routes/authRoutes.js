import express from 'express';
import passport from '../auth/auth.js';

const router = express.Router();

// Step 1: Redirect to Azure AD
router.get('/openid', passport.authenticate('azuread-openidconnect'));

// Step 2: Handle callback from Azure
router.get(
  '/openid/return',
  passport.authenticate('azuread-openidconnect', { failureRedirect: '/' }),
  (req, res) => {
    // Successfully logged in
    res.redirect('http://localhost:5173');
  }
);

// API to check if user is authenticated
router.get('/me', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ name: req.user.displayName || req.user.name || 'User' });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('https://login.microsoftonline.com/common/oauth2/logout?post_logout_redirect_uri=http://localhost:5173');
  });
});

export default router;
