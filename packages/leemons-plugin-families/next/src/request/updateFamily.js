async function updateFamily(body) {
  return leemons.api('families/update', {
    allAgents: true,
    method: 'POST',
    body,
  });
}

export default updateFamily;
