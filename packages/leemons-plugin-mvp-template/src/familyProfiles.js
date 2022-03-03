async function setFamilyProfiles(profiles) {
  const { student, guardian } = profiles;

  try {
    const families = leemons.getPlugin('families');
    if (families) {
      await families.services.config.setGuardianProfile(guardian.id);
      await families.services.config.setStudentProfile(student.id);
    }
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  setFamilyProfiles,
};
