// utils/cors.js
const allowedOrigins = [
  "https://gentle-stone-089c4d30f.6.azurestaticapps.net",
  "http://localhost:5173"
];

function getCorsHeaders(origin) {
  if (allowedOrigins.includes(origin)) {
    return {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Credentials": "true"
    };
  }

  return {
    "Access-Control-Allow-Origin": "null"
  };
}

module.exports = { getCorsHeaders };
