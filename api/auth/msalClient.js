const { ConfidentialClientApplication, LogLevel } = require('@azure/msal-node');
const dotenv = require('dotenv');

dotenv.config();

const msalConfig = {
  auth: {
    clientId: process.env.AZURE_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}`,
    clientSecret: process.env.AZURE_CLIENT_SECRET,
  },
  system: {
    loggerOptions: {
      loggerCallback(loglevel, message) {
        console.log(message);
      },
      piiLoggingEnabled: false,
      logLevel: LogLevel.Info,
    }
  }
};

const msalInstance = new ConfidentialClientApplication(msalConfig);

module.exports = { msalInstance };
