async function infoPlugin(name) {
  return leemons.api('deployment-manager/info', {
    allAgents: true,
    method: 'POST',
    body: {
      name,
    },
  });
}

export default infoPlugin;
