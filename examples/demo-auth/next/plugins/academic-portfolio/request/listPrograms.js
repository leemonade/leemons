async function listPrograms({ page, size, center }) {
  return leemons.api(`academic-portfolio/program?page=${page}&size=${size}&center=${center}`, {
    allAgents: true,
    method: 'GET',
  });
}

export default listPrograms;
