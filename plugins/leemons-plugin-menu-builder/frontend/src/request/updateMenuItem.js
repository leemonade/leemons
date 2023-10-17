async function updateMenuItem(menuKey, key, body) {
  return leemons.api(`menu-builder/menu/${menuKey}/${key}`, {
    allAgents: true,
    method: 'POST',
    body,
  });
}

export default updateMenuItem;
