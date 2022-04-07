async function listQuestionsBanks({ page, size }) {
  return leemons.api(`tests/question-bank?page=${page}&size=${size}`, {
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
