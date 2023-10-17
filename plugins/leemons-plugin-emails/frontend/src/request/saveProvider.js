async function saveProvider(body) {
  return leemons.api('emails/save-provider', {
    allAgents: true,
    method: 'POST',
    body,
  });
}

export default saveProvider;
