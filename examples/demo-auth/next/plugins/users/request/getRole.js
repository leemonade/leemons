async function getRole(uri) {
  return leemons.api({
    url: 'users/roles/detail/:uri',
    query: {
      uri,
    },
  });
}

export default getRole;
