async function addCenter(body) {
  return leemons.api('users/centers/add', {
    allAgents: true,
    method: 'POST',
    body,
  });
}

export default addCenter;
