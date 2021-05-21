const console = require('./console');
const file = require('./file');

module.exports = async ({ id }) => [
  console(),
  await file({ id, folder: 'logs', filename: 'latest.log' }),
];
