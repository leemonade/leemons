async function events() {
  leemons.events.once(
    ['plugins.assignables:pluginDidLoadServices', 'plugins.leebrary:init-menu'],
    async () => {
      leemons.events.emit('init-plugin');
    }
  );
  // TODO cuando se cambie el profesor de la clase en academic -portfolio se lance un evento que pille assignable para quitarle el permiso al profesor sobre los eventos y darselo al nuevo profesor
}

module.exports = events;
