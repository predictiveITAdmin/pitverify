const { parse } = require('cookie');
const { getAllEmployeesBasic } = require('../api/services/graphService');
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

    const data = await getAllEmployeesBasic();

    context.res = {
      status: 200,
       headers: {
      ...corsHeaders,
      "Content-Type": "application/json"
      },
      body: data
    };
  } catch (err) {
    context.log.error('Error in /employees:', err);
    context.res = {
      status: 500,
      body: { error: 'Internal server error' }
    };
  }
};
