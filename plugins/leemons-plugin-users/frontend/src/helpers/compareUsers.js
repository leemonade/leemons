function compareBySurnamesAndName(a, b) {
  const surnameResult = a.surnames?.localeCompare(b.surnames);
  return surnameResult === 0 ? a.name?.localeCompare(b.name) : surnameResult;
}

module.exports.compareBySurnamesAndName = compareBySurnamesAndName;
