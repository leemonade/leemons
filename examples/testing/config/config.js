const path = require('path');

console.log('Launching frontend from:', path.resolve(__dirname, ''));

module.exports = {
  insecure: true,
  dir: {
    app: path.resolve(__dirname, '..'),
    plugins: 'plugins',
    frontend: 'frontend',
    env: '.env',
  },
};
