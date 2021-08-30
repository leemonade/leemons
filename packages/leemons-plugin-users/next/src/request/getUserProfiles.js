async function getUserProfiles(token) {
  return leemons.api(
    'users/user/profile',
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
