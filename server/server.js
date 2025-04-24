import express from 'express';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import passport from './auth/auth.js';
import authRoutes from './routes/authRoutes.js';
import { getGraphClient } from './masl.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Auth Routes
app.use('/auth', authRoutes);

// Protected Graph API functions
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ error: 'Unauthorized' });
}

async function getAllEmployeesBasic() {
  try {
    const client = getGraphClient();
    const res = await client.api('/users')
      .select('displayName,employeeId,id')
      .top(999)
      .get();
    return res.value;
  } catch (err) {
    console.error('Error fetching employee list:', err.message);
    return { error: err.message || 'Internal Server Error', code: 500 };
  }
}

async function getEmployeeData(id) {
  try {
    const client = getGraphClient();
    const res = await client.api('/users')
      .filter(`id eq '${id}'`)
      .select('displayName,employeeId,id,accountEnabled,displayName,jobTitle,officeLocation,preferredLanguage,id,userPrincipalName')
      .get();
    if (res.value.length === 0) {
      return { error: 'User not found', code: 404 };
    }
    return res.value[0];
  } catch (err) {
    console.error('Error fetching employee data:', err.message);
    return { error: err.message || 'Internal Server Error', code: 500 };
  }
}

// Protected Routes
app.get('/employees', isAuthenticated, async (req, res) => {
  const result = await getAllEmployeesBasic();
  result.error
    ? res.status(result.code || 500).json(result)
    : res.json(result);
});

app.get('/employees/:id', isAuthenticated, async (req, res) => {
  const id = req.params.id;
  const result = await getEmployeeData(id);
  result.error
    ? res.status(result.code || 500).json(result)
    : res.json(result);
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
