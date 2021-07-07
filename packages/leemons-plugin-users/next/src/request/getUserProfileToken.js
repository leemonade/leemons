async function getUserProfileToken(id) {
  return leemons.api({
    url: 'users/user/profile/:id/token',
    query: { id },
  });
}

export default getUserProfileToken;
