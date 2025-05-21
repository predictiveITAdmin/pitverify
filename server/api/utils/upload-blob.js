const fs = require('fs');
const path = require('path');
const mime = require('mime-types'); // install via npm if needed

/**
 * Reads a local file and returns a structured payload for upload
 * @param {string} filePath - Absolute path to the image file
 * @param {string} userId - User identifier
 * @returns {object} - { userId, fileName, contentType, base64Image }
 */
function createUploadPayload(filePath, userId) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File does not exist: ${filePath}`);
  }

  const fileName = path.basename(filePath);
  const contentType = mime.lookup(filePath) || 'application/octet-stream';
  const base64Image = fs.readFileSync(filePath, { encoding: 'base64' });

  return {
    userId,
    fileName,
    contentType,
    base64Image,
  };
}

module.exports = { createUploadPayload };
