async function getProfileSysName() {
  return leemons.api('v1/users/profiles/sysName', {
    allAgents: true,
    method: 'GET',
  });
}

export default getProfileSysName;
