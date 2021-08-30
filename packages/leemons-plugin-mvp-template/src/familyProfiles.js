async function setFamilyProfiles(profiles) {
  try {
    const families = leemons.getPlugin('families');
    if (families) {
      await families.services.config.setGuardianProfile(profiles.guardian.id);
      await families.services.config.setStudentProfile(profiles.student.id);
    }
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  setFamilyProfiles,
};
