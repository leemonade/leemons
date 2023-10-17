async function generateNodesFromAcademicPortfolio(curriculumId) {
  return leemons.api(`curriculum/curriculum/${curriculumId}/generate`, {
    allAgents: true,
    method: 'POST',
  });
}

export default generateNodesFromAcademicPortfolio;
