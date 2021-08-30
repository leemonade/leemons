import {
  infoPluginRequest,
  installPluginByNPMRequest,
  removePluginByNPMRequest,
} from '../../request';

function installPluginByNPM(name, version) {
  return installPluginByNPMRequest(name, version);
}

function removePluginByNPM(name) {
  return removePluginByNPMRequest(name);
}

async function isPluginInstalled(name) {
  const { data } = await infoPluginRequest(name);
  return !!data;
}

async function getPluginInfo(name) {
  const { data } = await infoPluginRequest(name);
  return data;
}

export default { installPluginByNPM, removePluginByNPM, isPluginInstalled, getPluginInfo };
