async function install(name, version, userSession) {
  console.log(name, version, leemons.utils);
  try {
    const a = `yarn remove ${name}`;
    const b = `yarn add ${name}@${version}`;
    leemons.utils.stopAutoServerReload();
    const exec = await leemons.utils.getExeca().command(b);
    console.log('Bien', exec);
    leemons.utils.startAutoServerReload();
    leemons.utils.reloadServer();
  } catch (e) {
    console.error('Pete', e);
    throw e;
  }
}

async function remove(name, userSession) {
  console.log(name, version, leemons.utils);
  try {
    const exec = await leemons.utils.getExeca().command(`yarn remove ${name}`);
    console.log('Bien', exec);
  } catch (e) {
    console.error('Pete', e);
    throw e;
  }
}

module.exports = { install };
