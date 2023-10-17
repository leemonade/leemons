async function getSystemDataFieldsConfig() {
  return leemons.api('users/config/system-data-fields', {
    allAgents: true,
    method: 'GET',
  });
}

export default getSystemDataFieldsConfig;
