const profilesConfig = require('../src/services/profiles-config');

module.exports = {
  getProfiles: profilesConfig.getProfiles,
  getGuardianProfile: profilesConfig.getGuardianProfile,
  getStudentProfile: profilesConfig.getStudentProfile,
  setGuardianProfile: profilesConfig.setGuardianProfile,
  setStudentProfile: profilesConfig.setStudentProfile,
};
