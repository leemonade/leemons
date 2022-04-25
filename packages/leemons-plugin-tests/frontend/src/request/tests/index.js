async function listTests({ page, size, published }) {
  return leemons.api(`tests/tests?page=${page}&size=${size}&published=${published}`, {
    allAgents: true,
    method: 'GET',
  });
}

async function saveTest(body) {
  return leemons.api('tests/tests', {
    allAgents: true,
    method: 'POST',
    body,
  });
}

async function getTest(id) {
  return leemons.api(`tests/tests/${id}`, {
    allAgents: true,
    method: 'GET',
  });
}

export { listTests, saveTest, getTest };
