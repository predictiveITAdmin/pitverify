// copyRoutes.js
const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, 'client', 'routes.json');
const dest = path.join(__dirname, 'client', 'dist', 'routes.json');

fs.copyFileSync(src, dest);
console.log('✅ routes.json copied to dist/');
