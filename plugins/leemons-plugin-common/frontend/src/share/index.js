const shared = {};

export function share(plugin, name, func) {
  if (!shared[plugin.toLowerCase()]) shared[plugin.toLowerCase()] = {};
  shared[plugin.toLowerCase()][name.toLowerCase()] = func;
}

export function getShare(plugin, name) {
  // console.log(shared, plugin, name);
  return shared?.[plugin.toLowerCase()]?.[name.toLowerCase()];
}

export function existsShare(plugin, name) {
  return !!shared?.[plugin.toLowerCase()]?.[name.toLowerCase()];
}
