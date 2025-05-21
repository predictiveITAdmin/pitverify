const { BlobServiceClient } = require('@azure/storage-blob');
const { createUploadPayload } = require('../api/utils/upload-blob');
const path = require('path');
const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const containerName = 'pit-verify';
const { getCorsHeaders } = require('../api/utils/cors');

module.exports = async function (context, req) {
  const origin = req.headers.origin;
  const corsHeaders = getCorsHeaders(origin);
  if (req.method !== 'POST') {
    context.res = { status: 405, body: 'Method Not Allowed' };
    return;
  }

  try {
    const filePath = req.body?.filePath;
    const userId = req.body?.userId;

    if (!filePath || !userId) {
      context.res = { status: 400, body: 'Missing file path or user ID' };
      return;
    }

    const { fileName, contentType, base64Image } = createUploadPayload(filePath, userId);
    const blobName = `user-${userId}${path.extname(fileName)}`;
    const buffer = Buffer.from(base64Image, 'base64');

    const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    await containerClient.createIfNotExists(); // default is private


    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.uploadData(buffer, {
      blobHTTPHeaders: { blobContentType: contentType },
    });

    context.res = { status: 200,
      headers: {
      ...corsHeaders,
      "Content-Type": "application/json"
      },
      body: 'Upload successful!' };
  } catch (err) {
    context.log('Upload error:', err.message);
    context.res = { status: 500, body: 'Upload failed.' };
  }
};
