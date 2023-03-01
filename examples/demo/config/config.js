module.exports = {
  insecure: true,
  socketPlugin: 'socket-io', // socket-amazon
  // apiUrl: 'http://localhost:80',
  dir: {
    app: '/Users/Usuario/Sites/leemonade/leemons/examples/demo',
    plugins: 'plugins',
    frontend: 'frontend',
    env: '.env',
  },
  unwatchedDirs: ['./config/tokens'],
};
