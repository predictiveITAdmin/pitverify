const { getEmployeeData } = require('../api/services/graphService');

module.exports = async function (context, req) {
   const headers = {
    'Access-Control-Allow-Origin': 'http://localhost:5173',
    'Access-Control-Allow-Credentials': 'true'
  };
  try {
    const id = context.bindingData.id;
    const employee = await getEmployeeData(id);

    context.res = {
      status: 200,
      headers,
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
