async function getUserProfileToken(id, token) {
  return leemons.api(
    `users/user/profile/${id}/token`,
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
