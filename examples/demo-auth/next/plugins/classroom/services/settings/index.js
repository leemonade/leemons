async function getSettings() {
  return leemons.api({
    url: 'classroom/settings',
    allAgents: true,
  });
}

async function updateSettings(body) {
  if (body) {
    body.configured = ['true', '1', 'on'].includes(String(body.configured));
    body.hideWelcome = ['true', '1', 'on'].includes(String(body.hideWelcome));
    delete body.created_at;
    delete body.updated_at;
    delete body.id;
  }

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

async function enableMenuItem(key) {
  return leemons.api(
    {
      url: 'classroom/settings/enable-menu-item',
      allAgents: true,
    },
    {
      method: 'POST',
      body: { key },
    }
  );
}

export default { getSettings, updateSettings, enableMenuItem };
