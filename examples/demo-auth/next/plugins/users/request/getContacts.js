async function getContacts({
  toProfile = null,
  toCenter = null,
  withCenter = null,
  withProfile = null,
  centerToken = null,
} = {}) {
  let params = {
    url: 'users/user/contacts',
  };
  if (centerToken) {
    params.centerToken = centerToken;
  } else {
    params.allAgents = true;
  }
  return leemons.api(params, {
    method: 'POST',
    body: { toProfile, toCenter, withCenter, withProfile },
  });
}

export default getContacts;
