async function getUserProfileToken(id, token) {
  return leemons.api(
    `v1/users/users/profile/${id}/token`,
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
