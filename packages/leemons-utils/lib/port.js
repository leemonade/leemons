const detect = require('detect-port');

function getAvailablePort(port = process.env.PORT || 8080) {
  return detect(port).then((_port) => _port);
}

module.exports = { getAvailablePort };
