async function getDatasetForm() {
  return leemons.api({
    url: 'families-emergency-numbers/dataset-form',
    allAgents: true,
  });
}

export default getDatasetForm;
