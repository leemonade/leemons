async function getZone(zoneKey) {
  return leemons.api(`v1/widgets/widgets/zone/${zoneKey}`, {
    allAgents: true,
    method: 'GET',
  });
}

const getZoneRequest = getZone;

export { getZone, getZoneRequest };
