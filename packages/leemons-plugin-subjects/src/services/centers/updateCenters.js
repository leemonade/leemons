// TODO: Remove centers when a center is deleted
async function updateCenters() {
  const tables = {
    centers: leemons.query('plugins_users::centers'),
    levels: leemons.query('plugins_subjects::levels'),
    levelSchemas: leemons.query('plugins_subjects::levelSchemas'),
  };
  const { levels, levelSchemas } = leemons.plugin.services;

  // TODO: Implement this if needed
}

module.exports = () => {
  if (this && this.calledFrom !== 'plugins.subjects') {
    throw new Error('Permissions not satisfied');
  }
  let timer;

  const callback = () => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      timer = undefined;
      updateCenters();
    }, 2000);
  };

  leemons.events.once(
    ['plugins.users:didCreateCenter', 'plugins.subjects:pluginDidLoadServices'],
    () => {
      leemons.events.on('plugins.users:didCreateCenter', callback);
      callback();
    }
  );
};
