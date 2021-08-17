async function getSettings() {
  return leemons.api({
    url: 'classroom/settings',
    allAgents: true,
  });
}

export default { getSettings };
