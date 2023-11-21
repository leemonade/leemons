async function getDatasetForm() {
  return leemons.api('v1/families-emergency-numbers/emergencyPhones/dataset-form', {
    allAgents: true,
  });
}

export default getDatasetForm;
