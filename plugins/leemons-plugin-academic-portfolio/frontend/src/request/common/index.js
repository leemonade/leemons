async function getStudentsByTags(tags, center) {
  return leemons.api(`academic-portfolio/students/by/tags`, {
    allAgents: true,
    method: 'POST',
    body: {
      tags,
      center,
    },
  });
}

export { getStudentsByTags };
