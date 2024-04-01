const mixin = require('./mixin');
const { getDeploymentIDFromCTX } = require('./getDeploymentIDFromCTX');
const {
  getAutoDeploymentIDIfCanIFNotThrowError,
} = require('./getAutoDeploymentIDIfCanIFNotThrowError');
const { isCoreService } = require('./isCoreService');
const { validateInternalPrivateKey } = require('./validateInternalPrivateKey');

module.exports = {
  LeemonsDeploymentManagerMixin: mixin,
  isCoreService,
  getDeploymentIDFromCTX,
  getAutoDeploymentIDIfCanIFNotThrowError,
  validateInternalPrivateKey,
};
