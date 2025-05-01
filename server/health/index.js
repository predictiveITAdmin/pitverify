module.exports = async function (context, req) {
  const user = req.headers['x-user'] || null; 

  context.res = {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: {
      status: 'OK',
      timestamp: new Date().toISOString(),
      authenticated: !!user,
      user
    }
  };
};