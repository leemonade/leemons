async function listCenters(body) {
  return leemons.api('users/centers', {
    waitToFinish: true,
    allAgents: true,
    method: 'POST',
    body,
  });
}

export default listCenters;
