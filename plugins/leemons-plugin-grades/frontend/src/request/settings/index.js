const pluginPath = 'grades';

async function getSettings() {
  return leemons.api(`v1/${pluginPath}/settings`, {
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
    delete body.createdAt;
    delete body.updatedAt;
    delete body.status;
    delete body.id;
  }

  return leemons.api(`v1/${pluginPath}/settings`, { allAgents: true, method: 'POST', body });
}

async function enableMenuItem(key) {
  return leemons.api(`v1/${pluginPath}/settings/enable-menu-item`, {
    allAgents: true,
    method: 'POST',
    body: { key },
  });
}

export { getSettings, updateSettings, enableMenuItem };
