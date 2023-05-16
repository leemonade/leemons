const { prompt } = require('enquirer');
const _ = require('lodash');

module.exports = (questions) =>
  /**
   * for each question, check if meets the condition and execute the form, then
   * resolve the previous responses and iterate to the next item
   */
  questions.reduce(async (_result, _question) => {
    let question = _question;
    const result = await _result;
    if (question.condition && !question.condition(result)) {
      return _result;
    }

    // Get custom properties that changes with the previous inputs
    if (question.custom) {
      question = {
        ...question,
        ..._.fromPairs(
          await Promise.all(
            question.custom.map(async (field) => [field.name, await field.value(result)])
          )
        ),
      };
    }
    return { ...result, ...(await prompt(question)) };
  }, {});
