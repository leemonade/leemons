async function listQuestionsBanks(body) {
  return leemons.api(`v1/tests/questionsBanks/list`, {
    allAgents: true,
    method: 'POST',
    body,
  });
}

async function saveQuestionBank(body) {
  return leemons.api('v1/tests/questionsBanks', {
    allAgents: true,
    method: 'POST',
    body,
  });
}

async function getQuestionBank(id) {
  return leemons.api(`v1/tests/questionsBanks/${id}`, {
    allAgents: true,
    method: 'GET',
  });
}

async function deleteQuestionBank(id) {
  return leemons.api(`v1/tests/questionsBanks/${id}`, {
    allAgents: true,
    method: 'DELETE',
  });
}

export { listQuestionsBanks, saveQuestionBank, getQuestionBank, deleteQuestionBank };
