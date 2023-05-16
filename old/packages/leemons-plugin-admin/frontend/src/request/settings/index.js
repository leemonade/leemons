import { PLUGIN_NAME } from '../../constants';

async function getSettings() {
  return leemons.api(`${PLUGIN_NAME}/settings`);
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

  return leemons.api(`${PLUGIN_NAME}/settings`, { method: 'POST', body });
}

async function getLanguages() {
  return leemons.api(`${PLUGIN_NAME}/settings/languages`);
}

async function setLanguages(langs, defaultLang) {
  const body = { langs, defaultLang };

  return leemons.api(`${PLUGIN_NAME}/settings/languages`, { method: 'POST', body });
}

async function signup(values) {
  const body = {
    email: values.email,
    password: values.password,
    locale: values.locale,
  };

  return leemons.api(`${PLUGIN_NAME}/settings/signup`, { method: 'POST', body });
}

export {
  getSettings as getSettingsRequest,
  updateSettings as updateSettingsRequest,
  setLanguages as setLanguagesRequest,
  getLanguages as getLanguagesRequest,
  signup as signupRequest,
};
