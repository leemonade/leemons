function stringMatch(str1, str2, { partial = false, bothWays = false }) {
  if (typeof str1 !== 'string' || typeof str2 !== 'string') {
    return false;
  }

  const cleanStr1 = str1
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  const cleanStr2 = str2
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  if (partial) {
    return cleanStr1.includes(cleanStr2) || (bothWays && cleanStr2.includes(cleanStr1));
  }

  return cleanStr1 === cleanStr2;
}

export { stringMatch };
