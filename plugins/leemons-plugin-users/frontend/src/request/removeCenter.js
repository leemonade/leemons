async function removeCenter(id) {
  return leemons.api('v1/users/centers/remove', {
    allAgents: true,
    method: 'POST',
    body: { id },
  });
}

export default removeCenter;
