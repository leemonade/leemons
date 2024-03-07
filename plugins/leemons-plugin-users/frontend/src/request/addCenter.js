async function addCenter(body) {
  return leemons.api('v1/users/centers/add', {
    allAgents: true,
    method: 'POST',
    body,
  });
}

export default addCenter;
