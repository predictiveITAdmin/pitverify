const { getEmployeeData } = require('../api/services/graphService');
const { getCorsHeaders } = require('../api/utils/cors');


module.exports = async function (context, req) {
  const origin = req.headers.origin;
  const corsHeaders = getCorsHeaders(origin);
  try {
    const id = context.bindingData.id;
    const employee = await getEmployeeData(id);

    context.res = {
      status: 200,
       headers: {
      ...corsHeaders,
      "Content-Type": "application/json"
      },
      body: employee
    };
  } catch (err) {
    const notFound = err.message === 'User not found';
    context.res = {
      status: notFound ? 404 : 500,
      body: { error: notFound ? 'User not found' : 'Internal server error' }
    };
  }
};
