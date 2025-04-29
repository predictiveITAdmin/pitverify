import createHandler from 'azure-function-express';
import app from './server.js';

export default createHandler(app);