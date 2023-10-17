const pluginPath = 'academic-portfolio';

async function isConfigProfiles() {
  return leemons.api(`${pluginPath}/settings/profiles/is-config`, {
    allAgents: true,
  });
}

async function getProfiles() {
  return leemons.api(`${pluginPath}/settings/profiles`, {
    allAgents: true,
  });
}

async function setProfiles(body) {
  return leemons.api(`${pluginPath}/settings/profiles`, {
    allAgents: true,
    method: 'PUT',
    body,
  });
}

async function getSettings() {
  return leemons.api(`${pluginPath}/settings`, {
    allAgents: true,
  });
}

async function updateSettings(values) {
  const body = values;

  if (values) {
    body.configured = ['true', '1', 'on'].includes(String(body.configured));
    body.hideWelcome = ['true', '1', 'on'].includes(String(body.hideWelcome));
    delete body.created_at;
    delete body.updated_at;
    delete body.status;
    delete body.id;
  }

  return leemons.api(`${pluginPath}/settings`, { allAgents: true, method: 'POST', body });
}

async function enableMenuItem(key) {
  return leemons.api(`${pluginPath}/settings/enable-menu-item`, {
    allAgents: true,
    method: 'POST',
    body: { key },
  });
}

export { getSettings, updateSettings, enableMenuItem, isConfigProfiles, getProfiles, setProfiles };
