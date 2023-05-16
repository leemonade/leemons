async function getMenu(key) {
  return leemons.api(`menu-builder/menu/${key}`, { allAgents: true });
}

export default getMenu;
