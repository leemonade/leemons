async function removeMenuItem(menuKey, key) {
  return leemons.api(`v1/menu-builder/menu/${menuKey}/${key}`, { allAgents: true, method: 'DELETE' });
}

export default removeMenuItem;
