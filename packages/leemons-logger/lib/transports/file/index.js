const { transports } = require('winston');
const format = require('../../format');
const resolveFile = require('./resolveFile');

module.exports = ({ id, folder = 'logs', filename = 'latest.log' }) =>
  // Get the desired file safely and create a transport for it
  resolveFile({ id, folder, filename }).then(
    (file) => new transports.File({ filename: file.filename, format: format() })
  );
