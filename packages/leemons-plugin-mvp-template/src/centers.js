async function initCenters() {
  let result = null;

  try {
    const centerA = await leemons.getPlugin('users').services.centers.add({
      name: 'Elementary School',
      description: 'Elementary school only to perform the tests',
      locale: 'en',
    });
    const centerB = await leemons.getPlugin('users').services.centers.add({
      name: 'High School',
      description: 'High school only to perform the tests',
      locale: 'en',
    });

    result = { centerA, centerB };
  } catch (err) {
    console.error(err);
  }

  return result;
}

module.exports = initCenters;
