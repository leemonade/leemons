async function install(name, version, userSession) {
  // console.log('PARAMOS AUTO RECARGA');
  leemons.utils.stopAutoServerReload();
  // TODO Add record of who and when installed
  // console.log('VAMOS A INSTALAR');
  await leemons.utils.getExeca().command(`yarn add ${name}@${version}`);
  // console.log('INSTALADO');
  await global.utils.timeoutPromise(1000);
  // console.log('INICIAMOS AUTO RECARGA');
  leemons.utils.startAutoServerReload();
  // console.log('RECARGAMOS');
  leemons.utils.reloadServer();
  return true;
}

module.exports = { install };
