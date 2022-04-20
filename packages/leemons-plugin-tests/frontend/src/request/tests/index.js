async function listTests({ page, size, published }) {
  return leemons.api(`tests/tests?page=${page}&size=${size}&published=${published}`, {
    allAgents: true,
    method: 'GET',
  });
}

export { listTests };
