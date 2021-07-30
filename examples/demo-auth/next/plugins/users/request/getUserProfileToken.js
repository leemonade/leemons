async function getUserProfileToken(id, token) {
  return leemons.api(
    {
      url: 'users/user/profile/:id/token',
      query: { id },
    },
    token
      ? {
          headers: {
            Authorization: token,
          },
        }
      : undefined
  );
}

export default getUserProfileToken;
