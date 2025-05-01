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
    const today = new Date();
    const lastMonth = new Date(today.setDate(today.getDate() - 30)).toISOString();

    const users = await client.api('/users')
      .filter(`createdDateTime ge ${lastMonth}`)
      .select('displayName,createdDateTime')
      .top(999)
      .get();

    context.res = {
      status: 200,
      headers: {
      ...corsHeaders,
      "Content-Type": "application/json"
      },
      body: users.value
    };
  } catch (err) {
    context.log.error('New hires error:', err);
    context.res = {
      status: 500,
      body: { error: 'Failed to fetch new hires' }
    };
  }
};
