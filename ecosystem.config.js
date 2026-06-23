const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

module.exports = {
  apps: [
    {
      name: 'startup-server',
      script: 'dist/main.js',
      cwd: __dirname,
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      node_args: '-r tsconfig-paths/register',
      env_file: path.join(__dirname, '.env'),
      env: {
        NODE_ENV: 'production',
        PORT: process.env.PORT || 8000,
        TS_NODE_PROJECT: path.join(__dirname, 'tsconfig.runtime.json'),
      },
      error_file: path.join(__dirname, 'logs', 'pm2-error.log'),
      out_file: path.join(__dirname, 'logs', 'pm2-out.log'),
    },
  ],
};
