async function removeProvider(body) {
  return leemons.api('emails/remove-provider', {
    allAgents: true,
    method: 'POST',
    body,
  });
}

export default removeProvider;
