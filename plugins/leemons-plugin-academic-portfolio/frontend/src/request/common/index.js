async function getStudentsByTags(tags, center) {
  return leemons.api(`v1/academic-portfolio/common/students/by/tags`, {
    allAgents: true,
    method: 'POST',
    body: {
      tags,
      center,
    },
  });
}

export { getStudentsByTags };
