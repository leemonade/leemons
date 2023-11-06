async function getMenu(key) {
  return leemons.api(`v1/menu-builder/menu/${key}`, { allAgents: true });
}

export default getMenu;
