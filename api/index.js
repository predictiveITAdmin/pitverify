import createHandler from 'azure-function-express';
import app from './server.js';



export const handler =  createHandler(app);