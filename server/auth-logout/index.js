module.exports = async function (context, req) {
  const redirectAfterLogout = `${process.env.CLIENT_URI}`; // or your React frontend
  const azureLogoutURL = `https://login.microsoftonline.com/common/oauth2/logout?post_logout_redirect_uri=${encodeURIComponent(redirectAfterLogout)}`;

  // Clear both cookies (user + codeVerifier)
  context.res = {
    status: 302,
    headers: {
      'Location': azureLogoutURL,
      'Set-Cookie': [
        'user=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax',
        'codeVerifier=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax'
      ]
    }
  };
};
