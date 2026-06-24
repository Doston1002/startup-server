const path = require('path');

// dist/ ichidagi `require("src/...")` yo'llarini runtime da hal qilish
process.env.TS_NODE_PROJECT = path.join(__dirname, 'tsconfig.runtime.json');
require('tsconfig-paths/register');

require('./dist/main.js');
