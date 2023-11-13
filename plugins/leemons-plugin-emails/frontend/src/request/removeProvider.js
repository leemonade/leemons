async function removeProvider(body) {
  return leemons.api('v1/emails/remove-provider', {
    allAgents: true,
    method: 'POST',
    body,
  });
}

export default removeProvider;
