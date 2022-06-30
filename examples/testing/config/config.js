const path = require('path');

console.log('Launching frontend from:', path.resolve(__dirname, ''));

module.exports = {
  insecure: true,
  dir: {
    app: '/Users/Usuario/Sites/leemonade/leemons/examples/testing',
    plugins: 'plugins',
    frontend: 'frontend',
    env: '.env',
  },
};
