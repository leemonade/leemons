async function getUserCenterProfileToken(centerId, profileId, token) {
  return leemons.api(
    `v1/users/users/center/${centerId}/profile/${profileId}/token`,
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
