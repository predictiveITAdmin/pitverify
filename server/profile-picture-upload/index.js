const { BlobServiceClient } = require('@azure/storage-blob');
const { getCorsHeaders } = require('../api/utils/cors');
const path = require('path');

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const containerName = 'pit-verify';

module.exports = async function (context, req) {
  const origin = req.headers.origin;
  const corsHeaders = getCorsHeaders(origin);

  try {
    const userId = req.query.userId || req.headers['x-user-id'];
    const contentType = req.headers['content-type'];

    if (req.method === 'OPTIONS') {
      context.res = {
        status: 204,
        headers: {
          ...corsHeaders,
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      };
      return;
    }

    if (!userId || !req.body || !contentType) {
      context.res = {
        status: 400,
        headers: corsHeaders,
        body: 'Missing userId, file, or content type'
      };
      return;
    }
    console.log(req.bufferBody)
    const blobName = `user-${userId}${guessExtension(contentType)}`;
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    await containerClient.createIfNotExists();

    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.uploadData(req.bufferBody, {
      blobHTTPHeaders: { blobContentType: contentType }
    });

    context.res = {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      },
      body: 'Upload successful!'
    };
  } catch (err) {
    context.log('Upload error:', err.message);
    context.res = {
      status: 500,
      headers: corsHeaders,
      body: 'Upload failed.'
    };
  }
};

/**
 * Basic extension guess from MIME type
 */
function guessExtension(contentType) {
  switch (contentType) {
    case 'image/jpeg': return '.jpg';
    case 'image/png': return '.png';
    case 'image/webp': return '.webp';
    default: return '';
  }
}
