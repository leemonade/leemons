async function getProfileSysName() {
  return leemons.api('users/profile/sysName', {
    allAgents: true,
    method: 'GET',
  });
}

export default getProfileSysName;
