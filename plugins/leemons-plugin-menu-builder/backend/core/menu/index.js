/* eslint-disable global-require */

module.exports = {
  ...require('./add'),
  ...require('./exist'),
  ...require('./remove'),
  ...require('./getIfHasPermission'),
};
