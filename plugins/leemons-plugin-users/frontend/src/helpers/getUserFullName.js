function getUserFullName(user) {
  const name = user.name?.trim() ?? null;
  const surname = user.surnames?.trim() ?? null;
  const secondSurname = user.secondSurname?.trim() ?? null;

  const surnames = [secondSurname, surname].filter(Boolean).join(' ');
  const fullName = [surnames, name].filter(Boolean).join(', ');

  return fullName.trim();
}

export default getUserFullName;
