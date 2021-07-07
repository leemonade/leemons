async function getMenu(key) {
  return leemons.api({
    url: 'menu-builder/menu/:key',
    query: {
      key,
    },
  });
}

export default getMenu;
