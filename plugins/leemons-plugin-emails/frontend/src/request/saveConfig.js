async function saveConfig(body) {
  return leemons.api('v1/emails/config', {
    allAgents: true,
    method: 'POST',
    body,
  });
}

export default saveConfig;
