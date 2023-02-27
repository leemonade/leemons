module.exports = {
  insecure: true,
  socketPlugin: 'socket-io', // socket-amazon
  dir: {
    app: '/Users/Usuario/Sites/leemonade/leemons/examples/demo',
    plugins: 'plugins',
    frontend: 'frontend',
    env: '.env',
  },
  unwatchedDirs: ['./config/tokens'],
};
