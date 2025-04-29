export default function errorHandler(err, req, res, next) {
  console.error('Error:', err.message || err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
}