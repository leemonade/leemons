async function getDatasetForm() {
  return leemons.api({
    url: 'families/dataset-form',
    allAgents: true,
  });
}

export default getDatasetForm;
