async function installPluginByNPM(name, version) {
  return leemons.api('v1/package-manager/install', {
    allAgents: true,
    method: 'POST',
    body: {
      name,
      version,
    },
  });
}

export default installPluginByNPM;
