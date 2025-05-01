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
    const users = await client.api('/users').top(999).select('department').get();

    const departmentCounts = {};
    users.value.forEach(user => {
      const dept = user.department || 'Unknown';
      departmentCounts[dept] = (departmentCounts[dept] || 0) + 1;
    });

    context.res = {
      status: 200,
       headers: {
      ...corsHeaders,
      "Content-Type": "application/json"
      },
      body: departmentCounts
    };
  } catch (err) {
    context.log.error('Departments error:', err);
    context.res = {
      status: 500,
      body: { error: 'Failed to fetch departments' }
    };
  }
};
