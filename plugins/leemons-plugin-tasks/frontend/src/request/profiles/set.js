export default function setProfiles(key, profile) {
  if (Array.isArray(key)) {
    return leemons.api(`tasks/profiles`, { method: 'POST', body: { profiles: key } });
  }
  return Promise.all(
    leemons.api(`tasks/profiles/${key}/${profile}`, { method: 'POST', allAgents: true })
  );
}
