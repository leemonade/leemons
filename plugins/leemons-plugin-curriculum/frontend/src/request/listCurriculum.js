async function listCurriculum({ page, size, canListUnpublished = false }) {
  return leemons.api(
    `v1/curriculum/curriculum?page=${page}&size=${size}&canListUnpublished=${canListUnpublished}`,
    {
      allAgents: true,
    }
  );
}

export default listCurriculum;
