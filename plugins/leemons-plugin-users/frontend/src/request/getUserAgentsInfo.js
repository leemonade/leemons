async function getUserAgentsInfo(ids, options) {
  return leemons.api('v1/users/users/user-agents/info', {
    method: 'POST',
    allAgents: true,
    body: {
      ids,
      options,
    },
  });
}

export default getUserAgentsInfo;
