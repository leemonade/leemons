const detect = require('detect-port');

function getAvailablePort(port = process.env.PORT || 8080) {
  return detect(port);
}

module.exports = { getAvailablePort };
