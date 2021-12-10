async function getContacts({
  toProfile = null,
  toCenter = null,
  withCenter = null,
  withProfile = null,
  centerToken = null,
} = {}) {
  const params = {};
  if (centerToken) {
    params.centerToken = centerToken;
  } else {
    params.allAgents = true;
  }
  return leemons.api('users/user/contacts', {
    ...params,
    method: 'POST',
    body: { toProfile, toCenter, withCenter, withProfile },
  });
}

export default getContacts;
