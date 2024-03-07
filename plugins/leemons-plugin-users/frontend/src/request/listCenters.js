async function listCenters(body) {
  return leemons.api('v1/users/centers', {
    waitToFinish: true,
    allAgents: true,
    method: 'POST',
    body,
  });
}

export default listCenters;
