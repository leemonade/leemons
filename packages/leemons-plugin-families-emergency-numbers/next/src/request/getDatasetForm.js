async function getDatasetForm() {
  return leemons.api('families-emergency-numbers/dataset-form', {
    allAgents: true,
  });
}

export default getDatasetForm;
