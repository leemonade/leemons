async function getQuestionByIds(questionIds, options) {
  return leemons.api(`tests/questions/details`, {
    allAgents: true,
    method: 'POST',
    body: {
      questions: questionIds,
      options,
    },
  });
}

export { getQuestionByIds };
