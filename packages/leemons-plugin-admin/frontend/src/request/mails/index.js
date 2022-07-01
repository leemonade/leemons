/* eslint-disable import/prefer-default-export */
import { PLUGIN_NAME } from '../../constants';

async function getMailProviders() {
  return leemons.api(`${PLUGIN_NAME}/mail/providers`);
}

export { getMailProviders as getMailProvidersRequest };
