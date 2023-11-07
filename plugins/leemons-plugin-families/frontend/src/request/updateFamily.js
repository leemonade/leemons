async function updateFamily(body) {
  return leemons.api('v1/families/families/update', {
    allAgents: true,
    method: 'POST',
    body,
  });
}

export default updateFamily;
