const path = require('path');
const nodeBuffer = require('buffer');

// The installed jwa dependency still expects the removed Node 26 SlowBuffer alias.
if (!nodeBuffer.SlowBuffer) {
  nodeBuffer.SlowBuffer = nodeBuffer.Buffer;
}

// dist/ ichidagi `require("src/...")` yo'llarini runtime da hal qilish
process.env.TS_NODE_PROJECT = path.join(__dirname, 'tsconfig.runtime.json');
require('tsconfig-paths/register');

require('./dist/main.js');
