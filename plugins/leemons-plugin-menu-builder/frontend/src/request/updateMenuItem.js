async function updateMenuItem(menuKey, key, body) {
  return leemons.api(`v1/menu-builder/menu/${menuKey}/${key}`, {
    allAgents: true,
    method: 'POST',
    body,
  });
}

export default updateMenuItem;
