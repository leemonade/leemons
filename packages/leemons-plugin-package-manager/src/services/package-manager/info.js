async function info(name, userSession) {
  const plugin = leemons.getPlugin(name.replace('leemons-plugin-', ''));
  if (plugin) {
    return { name: plugin.name, version: plugin.version };
  }
  return null;
}

module.exports = { info };
