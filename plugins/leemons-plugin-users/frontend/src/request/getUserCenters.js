async function getUserCenters(token) {
  return leemons.api(
    'users/user/centers',
    token
      ? {
          headers: {
            Authorization: token,
          },
        }
      : undefined
  );
}

export default getUserCenters;
