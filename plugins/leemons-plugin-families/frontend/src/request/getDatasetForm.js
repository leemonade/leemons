async function getDatasetForm() {
  return leemons.api('v1/families/families/dataset-form', {
    allAgents: true,
  });
}

export default getDatasetForm;
