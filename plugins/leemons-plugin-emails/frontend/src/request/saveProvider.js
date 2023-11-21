async function saveProvider(body) {
  return leemons.api('v1/emails/email/save-provider', {
    allAgents: true,
    method: 'POST',
    body,
  });
}

export default saveProvider;
