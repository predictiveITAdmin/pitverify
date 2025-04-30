const { Client } = require('@microsoft/microsoft-graph-client');
const { ClientSecretCredential } = require('@azure/identity');
require('isomorphic-fetch');
const dotenv = require('dotenv');
dotenv.config();

const tenantId = process.env.AZURE_TENANT_ID;
const clientId = process.env.AZURE_CLIENT_ID;
const clientSecret = process.env.AZURE_CLIENT_SECRET;

const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);

function getGraphClient() {
  return Client.initWithMiddleware({
    authProvider: {
      getAccessToken: async () => {
        const token = await credential.getToken('https://graph.microsoft.com/.default');
        return token.token;
      }
    }
  });
}

module.exports = { getGraphClient };
