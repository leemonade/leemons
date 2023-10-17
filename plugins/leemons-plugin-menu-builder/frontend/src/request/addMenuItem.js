async function addMenuItem(body) {
  return leemons.api(`menu-builder/menu/${body.menuKey}/add-item`, {
    allAgents: true,
    method: 'POST',
    body,
  });
}

export default addMenuItem;
