const emergencyPhones = require('../src/services/emergency-phones');

module.exports = {
  saveFamilyPhones: emergencyPhones.saveFamilyPhones,
  removeFamilyPhones: emergencyPhones.removeFamilyPhones,
  getFamilyPhones: emergencyPhones.getFamilyPhones,
};
