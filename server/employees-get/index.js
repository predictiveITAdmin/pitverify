const { parse } = require('cookie');
const { getAllEmployeesBasic } = require('../api/services/graphService');

module.exports = async function (context, req) {
   const headers = {
    'Access-Control-Allow-Origin': 'http://localhost:5173',
    'Access-Control-Allow-Credentials': 'true'
  };
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
      headers,
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
