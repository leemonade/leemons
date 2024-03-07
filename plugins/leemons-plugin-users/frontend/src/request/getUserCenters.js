async function getUserCenters(token) {
  return leemons.api(
    'v1/users/users/centers',
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
