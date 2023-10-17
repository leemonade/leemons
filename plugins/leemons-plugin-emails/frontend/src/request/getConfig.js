async function getConfig() {
  return leemons.api('emails/config', {
    allAgents: true,
    method: 'GET',
  });
}

export default getConfig;
