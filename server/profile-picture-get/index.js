const { BlobServiceClient, StorageSharedKeyCredential, generateBlobSASQueryParameters, BlobSASPermissions } = require('@azure/storage-blob');
const { getCorsHeaders } = require('../api/utils/cors');
const { parse } = require('cookie');
const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
const containerName = 'pit-verify';

module.exports = async function (context, req) {
  const origin = req.headers.origin;
  const corsHeaders = getCorsHeaders(origin);
  const userId = req.params.userId;

  const cookies = parse(req.headers.cookie || '');
  const user = cookies.user ? JSON.parse(decodeURIComponent(cookies.user)) : null;

    if (!user) {
      context.res = {
        status: 401,
        body: { error: 'Unauthorized' }
      };
      return;
    }

  if (!userId) {
    context.res = {
      status: 400,
      body: 'Missing userId in path.'
    };
    return;
  }

  const blobName = `user-${userId}.jpg`;

  try {
    const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
    const blobServiceClient = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net`,
      sharedKeyCredential
    );

    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(blobName);

    // Generate a short-lived SAS token (5 minutes)
    const sasToken = generateBlobSASQueryParameters(
      {
        containerName,
        blobName,
        permissions: BlobSASPermissions.parse("r"), // read only
        expiresOn: new Date(new Date().valueOf() + 1* 60 * 1000) // 01 min
      },
      sharedKeyCredential
    ).toString();

    const sasUrl = `${blobClient.url}?${sasToken}`;

    context.res = {
      status: 200,
      headers: {
      ...corsHeaders,
      "Content-Type": "application/json"
      },
      body: { url: sasUrl }
    };
  } catch (err) {
    context.log('Error generating SAS URL:', err.message);
    context.res = {
      status: 500,
      body: 'Failed to retrieve image URL.'
    };
  }
};
