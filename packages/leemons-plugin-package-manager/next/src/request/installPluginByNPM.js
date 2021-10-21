async function installPluginByNPM(name, version) {
  return leemons.api('package-manager/install', {
    allAgents: true,
    method: 'POST',
    body: {
      name,
      version,
    },
  });
}

export default installPluginByNPM;
