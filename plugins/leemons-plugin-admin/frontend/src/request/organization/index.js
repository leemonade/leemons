import { PLUGIN_NAME } from '../../constants';

async function getOrganization() {
  return leemons.api(`${PLUGIN_NAME}/organization`);
}

async function updateOrganization(body) {
  return leemons.api(`${PLUGIN_NAME}/organization`, { method: 'POST', body });
}

export {
  getOrganization as getOrganizationRequest,
  updateOrganization as updateOrganizationRequest,
};
