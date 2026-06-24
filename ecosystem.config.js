const path = require('path');

module.exports = {
  apps: [
    {
      name: 'startup-server',
      script: path.join(__dirname, 'server.js'),
      cwd: __dirname,
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      env_file: path.join(__dirname, '.env'),
      env: {
        NODE_ENV: 'production',
        PORT: process.env.PORT || 8000,
      },
      error_file: path.join(__dirname, 'logs', 'pm2-error.log'),
      out_file: path.join(__dirname, 'logs', 'pm2-out.log'),
    },
  ],
};
