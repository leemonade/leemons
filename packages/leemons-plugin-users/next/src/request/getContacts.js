async function getContacts({ toProfile = null, centerToken = null }) {
  let params = 'users/user/contacts';
  if (centerToken)
    params = {
      url: params,
      centerToken,
    };
  return leemons.api(params, {
    method: 'POST',
    body: { toProfile },
  });
}

export default getContacts;
