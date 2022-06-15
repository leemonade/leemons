const pluginPath = 'admin';

async function getSettings() {
  return leemons.api(`${pluginPath}/settings`);
}

async function updateSettings(values) {
  const body = values;

  if (values) {
    body.configured = ['true', '1', 'on'].includes(String(body.configured));
    delete body.created_at;
    delete body.updated_at;
    delete body.status;
    delete body.id;
  }

  return leemons.api(`${pluginPath}/settings`, { method: 'POST', body });
}

async function setLanguages(langs, defaultLang) {
  const body = { langs, defaultLang };

  return leemons.api(`${pluginPath}/settings/languages`, { method: 'POST', body });
}

export {
  getSettings as getSettingsRequest,
  updateSettings as updateSettingsRequest,
  setLanguages as setLanguagesRequest,
};
