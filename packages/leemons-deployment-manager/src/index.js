const mixin = require('./mixin');
const { getDeploymentIDFromCTX } = require('./getDeploymentIDFromCTX');
const {
  getAutoDeploymentIDIfCanIFNotThrowError,
} = require('./getAutoDeploymentIDIfCanIFNotThrowError');
const { isCoreService } = require('./isCoreService');

module.exports = {
  LeemonsDeploymentManagerMixin: mixin,
  isCoreService,
  getDeploymentIDFromCTX,
  getAutoDeploymentIDIfCanIFNotThrowError,
};
