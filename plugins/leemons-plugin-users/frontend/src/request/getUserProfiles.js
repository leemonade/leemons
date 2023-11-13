async function getUserProfiles(token) {
  return leemons.api(
    'v1/users/users/profile',
    token
      ? {
          headers: {
            Authorization: token,
          },
        }
      : undefined
  );
}

export default getUserProfiles;
