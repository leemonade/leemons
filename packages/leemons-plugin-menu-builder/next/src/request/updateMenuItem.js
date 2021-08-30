async function updateMenuItem(menuKey, key, body) {
  return leemons.api(
    {
      url: 'menu-builder/menu/:menuKey/:key',
      allAgents: true,
      query: {
        menuKey,
        key,
      },
    },
    { method: 'POST', body }
  );
}

export default updateMenuItem;
