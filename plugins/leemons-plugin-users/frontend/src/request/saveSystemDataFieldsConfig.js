async function saveSystemDataFieldsConfig(body) {
  return leemons.api('users/config/system-data-fields', {
    allAgents: true,
    method: 'POST',
    body,
  });
}

export default saveSystemDataFieldsConfig;
