async function saveConfig(body) {
  return leemons.api('emails/config', {
    allAgents: true,
    method: 'POST',
    body,
  });
}

export default saveConfig;
