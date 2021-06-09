module.exports = [
  {
    path: '/init',
    method: 'POST',
    handler: 'init.init',
  },
  {
    path: '/test-send',
    method: 'POST',
    handler: 'init.testSend',
  },
];
