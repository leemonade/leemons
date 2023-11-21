async function addNodeLevels(curriculum, nodeLevels) {
  return leemons.api('v1/curriculum/node-levels', {
    allAgents: true,
    method: 'POST',
    body: {
      curriculum,
      nodeLevels,
    },
  });
}

export default addNodeLevels;
