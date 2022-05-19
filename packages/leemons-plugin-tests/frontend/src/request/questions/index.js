async function getQuestionByIds(questionIds) {
  return leemons.api(`tests/questions/details`, {
    allAgents: true,
    method: 'POST',
    body: {
      questions: questionIds,
    },
  });
}

export { getQuestionByIds };
