async function removeMenuItem(menuKey, key) {
  return leemons.api(
    {
      url: 'menu-builder/menu/:menuKey/:key',
      allAgents: true,
      query: {
        menuKey,
        key,
      },
    },
    { method: 'DELETE' }
  );
}

export default removeMenuItem;
