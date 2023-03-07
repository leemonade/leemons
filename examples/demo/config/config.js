module.exports = {
  insecure: true,
  socketPlugin: 'mqtt-aws-iot', // mqtt-aws-iot | mqtt-socket-io
  apiUrl: 'http://localhost:8080', // 'https://leemons-dev-elb-513324738.eu-central-1.elb.amazonaws.com',
  dir: {
    app: '/Users/Usuario/Sites/leemonade/leemons/examples/demo',
    plugins: 'plugins',
    frontend: 'frontend',
    env: '.env',
  },
  unwatchedDirs: ['./config/tokens'],
};
