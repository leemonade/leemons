async function listCenters(body) {
  return leemons.api('users/centers', {
    allAgents: true,
    method: 'POST',
    body,
  });
}

export default listCenters;
