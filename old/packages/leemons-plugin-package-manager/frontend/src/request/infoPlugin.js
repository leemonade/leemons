async function infoPlugin(name) {
  return leemons.api('package-manager/info', {
    allAgents: true,
    method: 'POST',
    body: {
      name,
    },
  });
}

export default infoPlugin;
