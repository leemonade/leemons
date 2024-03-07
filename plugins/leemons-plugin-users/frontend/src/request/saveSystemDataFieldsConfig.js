async function saveSystemDataFieldsConfig(body) {
  return leemons.api('v1/users/config/system-data-fields', {
    allAgents: true,
    method: 'POST',
    body,
  });
}

export default saveSystemDataFieldsConfig;
