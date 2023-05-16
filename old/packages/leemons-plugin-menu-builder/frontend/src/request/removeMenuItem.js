async function removeMenuItem(menuKey, key) {
  return leemons.api(`menu-builder/menu/${menuKey}/${key}`, { allAgents: true, method: 'DELETE' });
}

export default removeMenuItem;
