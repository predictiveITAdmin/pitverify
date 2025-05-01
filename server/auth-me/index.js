const { parse } = require('cookie');

module.exports = async function (context, req) {
  const headers = {
    'Access-Control-Allow-Origin': 'http://localhost:5173',
    'Access-Control-Allow-Credentials': 'true'
  };

  try {
    const cookies = parse(req.headers.cookie || '');
    const rawUser = cookies.user;

    if (!rawUser) {
      context.res = {
        status: 401,
        headers,
        body: { error: 'Not authenticated' }
      };
      return;
    }

    const user = JSON.parse(decodeURIComponent(rawUser));
    context.res = {
      status: 200,
      headers,
      body: { name: user.name }
    };
  } catch (err) {
    context.log.error('Error in /auth/me:', err);
    context.res = {
      status: 500,
      headers,
      body: { error: 'Internal server error' }
    };
  }
};
