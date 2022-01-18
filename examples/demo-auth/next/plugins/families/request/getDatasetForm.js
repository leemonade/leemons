async function getDatasetForm() {
  return leemons.api('families/dataset-form', {
    allAgents: true,
  });
}

export default getDatasetForm;
