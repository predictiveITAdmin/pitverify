const { createAzureFunctionHandler } = require('azure-function-express');
const app = require('./server');

module.exports = createAzureFunctionHandler(app);
