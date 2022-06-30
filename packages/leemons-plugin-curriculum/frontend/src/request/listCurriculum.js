async function listCurriculum({ page, size, canListUnpublished = false }) {
  return leemons.api(
    `curriculum/curriculum?page=${page}&size=${size}&canListUnpublished=${canListUnpublished}`,
    {
      allAgents: true,
    }
  );
}

export default listCurriculum;
