module.exports = {
  insecure: true,
  socketPlugin: {{socketPlugin}}, // 'mqtt-socket-io' | 'mqtt-aws-iot'
  apiUrl: {{apiUrl}},
  dir: {
    plugins: 'plugins',
    frontend: 'frontend',
    env: '.env',
  },
};
