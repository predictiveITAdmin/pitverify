// copyRoutes.js
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const src = join(__dirname, 'routes.json');
const dest = join(__dirname, 'dist', 'routes.json');

fs.copyFileSync(src, dest);
console.log('✅ routes.json copied to dist/');
