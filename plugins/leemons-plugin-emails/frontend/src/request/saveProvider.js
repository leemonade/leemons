async function saveProvider(body) {
  return leemons.api('v1/emails/save-provider', {
    allAgents: true,
    method: 'POST',
    body,
  });
}

export default saveProvider;
