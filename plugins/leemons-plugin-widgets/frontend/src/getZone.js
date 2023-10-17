async function getZone(zoneKey) {
  return leemons.api(`widgets/zone/${zoneKey}`, {
    allAgents: true,
    method: 'GET',
  });
}

const getZoneRequest = getZone;

export { getZone, getZoneRequest };
