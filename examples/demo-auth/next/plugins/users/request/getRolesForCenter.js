async function getRolesForCenter(center) {
  return leemons.api({
    url: 'users/roles-for-center/:center',
    query: {
      center,
    },
  });
}

export default getRolesForCenter;
