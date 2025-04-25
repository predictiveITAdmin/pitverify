import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import errorHandler from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import statsRoutes from './routes/statsRoutes.js'


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



// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
