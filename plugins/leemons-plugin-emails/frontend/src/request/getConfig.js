async function getConfig() {
  return leemons.api('v1/emails/config', {
    allAgents: true,
    method: 'GET',
  });
}

export default getConfig;
