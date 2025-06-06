const { parse } = require('cookie');
const { getCorsHeaders } = require('../api/utils/cors');

module.exports = async function (context, req) {
  const origin = req.headers.origin;
  const corsHeaders = getCorsHeaders(origin);

  try {
    const cookies = parse(req.headers.cookie || '');
    const rawUser = cookies.user;

    if (!rawUser) {
      context.res = {
        status: 401,
          headers: {
      ...corsHeaders,
      "Content-Type": "application/json"
      },
        body: { error: 'Not authenticated' }
      };
      return;
    }

    const user = JSON.parse(decodeURIComponent(rawUser));
    context.log(user)
    context.res = {
      status: 200,
      headers: {
      ...corsHeaders,
      "Content-Type": "application/json"
      },
      body: {
        id: user.localAccountId,                   
        name: user.name,
        email: user.username
      }
    };
  } catch (err) {
    context.log.error('Error in /auth/me:', err);
    context.res = {
      status: 500,
      headers: {
      ...corsHeaders,
      "Content-Type": "application/json"
      },
      body: { error: 'Internal server error' }
    };
  }
};
