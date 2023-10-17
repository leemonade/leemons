async function removeCenter(id) {
  return leemons.api('users/centers/remove', {
    allAgents: true,
    method: 'POST',
    body: { id },
  });
}

export default removeCenter;
