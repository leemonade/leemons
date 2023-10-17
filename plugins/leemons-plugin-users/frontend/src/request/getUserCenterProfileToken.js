async function getUserCenterProfileToken(centerId, profileId, token) {
  return leemons.api(
    `users/user/center/${centerId}/profile/${profileId}/token`,
    token
      ? {
          headers: {
            Authorization: token,
          },
        }
      : undefined
  );
}

export default getUserCenterProfileToken;
