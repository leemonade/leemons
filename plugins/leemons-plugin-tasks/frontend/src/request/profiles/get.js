export default function getProfiles(key) {
  const keys = Array.isArray(key) ? key : [key];

  return Promise.all(
    keys.map(async (k) => {
      const tuple = await leemons.api(`tasks/profiles/${k}`, { method: 'GET', allAgents: true });
      return { key: k, profile: tuple.profile };
    })
  );
}
