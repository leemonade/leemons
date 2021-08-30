async function install(name, version, userSession) {
  leemons.utils.stopAutoServerReload();
  // TODO Add record of who and when installed
  await leemons.utils.getExeca().command(`yarn add ${name}@${version}`);
  leemons.utils.startAutoServerReload();
  leemons.utils.reloadServer();
  return true;
}

module.exports = { install };
