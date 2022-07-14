/* eslint-disable import/prefer-default-export */
import { PLUGIN_NAME } from '../../constants';

async function getMailProviders() {
  return leemons.api(`${PLUGIN_NAME}/mail/providers`);
}

async function getPlatformEmail() {
  return leemons.api(`${PLUGIN_NAME}/mail/platform`);
}

async function savePlatformEmail(email) {
  return leemons.api(`${PLUGIN_NAME}/mail/platform`, {
    allAgents: true,
    method: 'POST',
    body: { email },
  });
}

export {
  getMailProviders as getMailProvidersRequest,
  getPlatformEmail as getPlatformEmailRequest,
  savePlatformEmail as savePlatformEmailRequest,
};
