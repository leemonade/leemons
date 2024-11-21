function getUserFullName(user, options = { singleSurname: false }) {
  const name = user.name?.trim() ?? null;
  const surname = user.surnames?.trim() ?? null;
  const secondSurname = user.secondSurname?.trim() ?? null;

  if (options.singleSurname && name && surname) {
    const surnameParts = surname.split(' ');
    const firstSurname = surnameParts[0];
    return `${firstSurname}, ${name}`;
  }

  const surnames = [surname, secondSurname].filter(Boolean).join(', ');
  const fullName = [surnames, name].filter(Boolean).join(', ');

  return fullName.trim();
}

export default getUserFullName;
