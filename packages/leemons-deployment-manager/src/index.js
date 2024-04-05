const mixin = require('./mixin');
const { getDeploymentIDFromCTX } = require('./getDeploymentIDFromCTX');
const {
  getAutoDeploymentIDIfCanIFNotThrowError,
} = require('./getAutoDeploymentIDIfCanIFNotThrowError');
const { isCoreService } = require('./isCoreService');
const { checkIfManualPasswordIsGood } = require('./checkIfManualPasswordIsGood');
const { customCall } = require('./customCall');

module.exports = {
  LeemonsDeploymentManagerMixin: mixin,
  isCoreService,
  getDeploymentIDFromCTX,
  getAutoDeploymentIDIfCanIFNotThrowError,
  checkIfManualPasswordIsGood,
  customCall,
};
