async function getDataForKeys(keys) {
  return leemons.api('v1/curriculum/data-for-keys', {
    allAgents: true,
    method: 'POST',
    body: { keys },
  });
}

export default getDataForKeys;
