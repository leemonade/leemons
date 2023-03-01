module.exports = {
  insecure: true,
  socketPlugin: 'mqtt-aws-iot', // mqtt-aws-iot | mqtt-socket-io
  // apiUrl: 'http://localhost:80',
  dir: {
    app: '/Users/Usuario/Sites/leemonade/leemons/examples/demo',
    plugins: 'plugins',
    frontend: 'frontend',
    env: '.env',
  },
  unwatchedDirs: ['./config/tokens'],
};
