function shortResponseIsCorrect(userResponse, question, config = {}) {
  const hasActiveTolerances = config.questionFilters?.shortResponse?.activateTolerances;

  if (!hasActiveTolerances) {
    return question.choices.map((choice) => choice.text.text).includes(userResponse);
  }

  let userResponseProcessed = userResponse;
  const { tolerateAccents, tolerateSpaces, tolerateCase } = config.questionFilters.shortResponse;

  const processedChoices = question.choices.map((choice) => {
    let processedChoice = choice.text.text;

    if (tolerateSpaces) {
      processedChoice = processedChoice.replace(/\s/g, '');
      userResponseProcessed = userResponseProcessed.replace(/\s/g, '');
    }
    if (tolerateCase) {
      processedChoice = processedChoice.toLowerCase();
      userResponseProcessed = userResponseProcessed.toLowerCase();
    }
    if (tolerateAccents) {
      processedChoice = processedChoice.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      userResponseProcessed = userResponseProcessed
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
    }

    return processedChoice;
  });

  return processedChoices.includes(userResponseProcessed);
}

module.exports = { shortResponseIsCorrect };
