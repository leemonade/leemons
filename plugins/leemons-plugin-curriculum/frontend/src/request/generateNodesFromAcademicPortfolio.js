async function generateNodesFromAcademicPortfolio(curriculumId) {
  return leemons.api(`v1/curriculum/curriculum/${curriculumId}/generate`, {
    allAgents: true,
    method: 'POST',
  });
}

export default generateNodesFromAcademicPortfolio;
