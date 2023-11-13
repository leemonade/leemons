async function removePluginByNPM(name) {
  return leemons.api('v1/package-manager/remove', {
    allAgents: true,
    method: 'POST',
    body: {
      name,
    },
  });
}

export default removePluginByNPM;
