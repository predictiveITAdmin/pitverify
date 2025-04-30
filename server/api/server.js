const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const session = require('express-session');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const statsRoutes = require('./routes/statsRoutes');

dotenv.config();
const app = express();
const port = process.env.PORT || 3001;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

app.use(session({
  secret: 'secure-session',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    sameSite: 'lax'
  }
}));

console.log("CLIENT_ID:", process.env.CLIENT_ID);
console.log("CLIENT_SECRET length:", process.env.CLIENT_SECRET?.length || 'MISSING');
console.log("AUTHORITY:", process.env.AUTHORITY);

app.use('/auth', authRoutes);
app.use('/employees', employeeRoutes);
app.use('/stats', statsRoutes);
app.use(errorHandler);

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    authenticated: !!req.session.user,
    user: req.session.user?.name || null
  });
});

// Start server (only when running locally, not in Azure)
if (!process.env.AZURE_FUNCTIONS_ENVIRONMENT) {
  app.listen(port, () => {
    console.log(`Server running locally at http://localhost:${port}`);
  });
}

module.exports = app;