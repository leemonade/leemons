module.exports = async ({ scripts, isInstalled }) => {
  // ES: Ejecuta el archivo install.js solo la primera vez (Cuando en base de datos aun no esta marcado como instalado)
  if (!isInstalled) {
    await scripts.install();
  }
  // ES: Ejecuta el archivo init.js (Solo usarse para cosas que se necesiten hacer a cada ver que se inicie la plataforma)
  await scripts.init();
};
