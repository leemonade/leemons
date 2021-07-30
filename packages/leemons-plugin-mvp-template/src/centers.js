async function initCenters() {
  try {
    const leemon = await leemons.getPlugin('users').services.centers.add({
      name: 'Villa limones',
      description: 'Los mejores limones del lugar',
      locale: 'es',
    });
    const orange = await leemons.getPlugin('users').services.centers.add({
      name: 'Villa naranja',
      description: 'Todas sus naranjas son una caca',
      locale: 'en',
    });
    return { leemon, orange };
  } catch (err) {
    console.error(err);
  }
}

module.exports = initCenters;
