async function getProfileSysName() {
  return leemons.api('users/profile/sysName', {
    method: 'GET',
  });
}

export default getProfileSysName;
