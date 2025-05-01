const { parse } = require('cookie');
const { getGraphClient } = require('../api/services/masl');
const { getCorsHeaders } = require('../api/utils/cors');
module.exports = async function (context, req) {
  const origin = req.headers.origin;
  const corsHeaders = getCorsHeaders(origin);
  try {
    const cookies = parse(req.headers.cookie || '');
    const user = cookies.user ? JSON.parse(decodeURIComponent(cookies.user)) : null;

    if (!user) {
      context.res = {
        status: 401,
        body: { error: 'Unauthorized' }
      };
      return;
    }

    const client = getGraphClient();
    const users = await client.api('/users').top(999).select('accountEnabled', 'id', 'givenName').get();

    const total = users.value.length;
    const active = users.value.filter(u => u.accountEnabled).length;
    const inactive = total - active;

    context.res = {
      status: 200,
      headers: {
      ...corsHeaders,
      "Content-Type": "application/json"
    },
      body: { total, active, inactive }
    };
  } catch (err) {
    context.log.error('Summary error:', err);
    context.res = {
      status: 500,
      body: { error: 'Failed to fetch summary' }
    };
  }
};
