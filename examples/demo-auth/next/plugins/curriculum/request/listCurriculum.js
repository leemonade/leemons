async function listCurriculum({ page, size }) {
  return leemons.api(`curriculum/curriculum?page=${page}&size=${size}`, {
    allAgents: true,
  });
}

export default listCurriculum;
