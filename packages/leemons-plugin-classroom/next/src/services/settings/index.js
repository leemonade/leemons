async function getSettings() {
  return leemons.api({
    url: 'classroom/settings',
    allAgents: true,
  });
}

async function updateSettings(body) {
  return leemons.api(
    {
      url: 'classroom/settings',
      allAgents: true,
    },
    {
      method: 'POST',
      body,
    }
  );
}

export default { getSettings, updateSettings };
