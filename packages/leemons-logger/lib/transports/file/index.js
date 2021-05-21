const {
  transports,
  format: { combine, metadata, json, uncolorize },
} = require('winston');
const defaultFormat = require('../../format');
const resolveFile = require('./resolveFile');

module.exports = ({ id, folder, filename, format = null }) => {
  let _format = format;
  if (!format) {
    _format = defaultFormat;
  }
  // Get the desired file safely and create a transport for it
  return resolveFile({ id, folder, filename }).then(
    (file) =>
      new transports.File({
        filename: file.filename,
        timestamp: true,
        format: combine(
          _format(),
          uncolorize(),
          metadata({ fillExcept: ['level', 'message', 'labels', 'timestamp'] }),
          json()
        ),
      })
  );
};
