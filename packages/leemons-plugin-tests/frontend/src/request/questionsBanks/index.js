async function listQuestionsBanks({ page, size, published }) {
  return leemons.api(`tests/question-bank?page=${page}&size=${size}&published=${published}`, {
    allAgents: true,
    method: 'GET',
  });
}

async function saveQuestionBank(body) {
  return leemons.api('tests/question-bank', {
    allAgents: true,
    method: 'POST',
    body,
  });
}

async function getQuestionBank(id) {
  return leemons.api(`tests/question-bank/${id}`, {
    allAgents: true,
    method: 'GET',
  });
}

export { listQuestionsBanks, saveQuestionBank, getQuestionBank };
