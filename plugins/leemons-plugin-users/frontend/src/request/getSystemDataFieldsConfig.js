async function getSystemDataFieldsConfig() {
  return leemons.api('v1/users/config/system-data-fields', {
    allAgents: true,
    method: 'GET',
  });
}

export default getSystemDataFieldsConfig;
