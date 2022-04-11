async function listQuestionsBanks({ page, size }) {
  return leemons.api(`tests/question-bank?page=${page}&size=${size}`, {
    allAgents: true,
    method: 'GET',
  });
}

async function createQuestionBank(body) {
  return leemons.api('tests/question-bank', {
    allAgents: true,
    method: 'POST',
    body,
  });
}

async function updateQuestionBank(body) {
  return leemons.api('tests/question-bank', {
    allAgents: true,
    method: 'PUT',
    body,
  });
}

export { listQuestionsBanks, createQuestionBank, updateQuestionBank };
