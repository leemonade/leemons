async function getDataForKeys(keys) {
  return leemons.api('curriculum/data-for-keys', {
    allAgents: true,
    method: 'POST',
    body: { keys },
  });
}

export default getDataForKeys;
