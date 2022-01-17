async function addNodeLevels(curriculum, nodeLevels) {
  return leemons.api('curriculum/node-levels', {
    allAgents: true,
    method: 'POST',
    body: {
      curriculum,
      nodeLevels,
    },
  });
}

export default addNodeLevels;
