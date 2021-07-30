async function test(key) {
  return leemons.api({
    url: 'menu-builder/menu/:key',
    allUsers: true,
    query: {
      key,
    },
  });
}

export default test;
