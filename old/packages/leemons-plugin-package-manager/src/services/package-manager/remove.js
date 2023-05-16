async function remove(name, userSession) {
  leemons.utils.stopAutoServerReload();
  // TODO Add record of who and when installed
  await leemons.utils.getExeca().command(`yarn remove ${name}`);
  leemons.utils.startAutoServerReload();
  leemons.utils.reloadServer();
  return true;
}

module.exports = { remove };
