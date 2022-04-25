async function listQuestionsBanks(body) {
  return leemons.api(`tests/question-bank/list`, {
    allAgents: true,
    method: 'POST',
    body,
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
