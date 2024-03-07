async function removeProvider(body) {
  return leemons.api('v1/emails/email/remove-provider', {
    allAgents: true,
    method: 'POST',
    body,
  });
}

export default removeProvider;
