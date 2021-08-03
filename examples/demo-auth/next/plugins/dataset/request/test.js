async function test(key) {
  return leemons.api({
    url: 'menu-builder/menu/:key',
    allAgents: true,
    query: {
      key,
    },
  });
}

export default test;
