const { prompt } = require('enquirer');
const _ = require('lodash');

module.exports = (questions) =>
  questions.reduce(async (_result, _question) => {
    let question = _question;
    const result = await _result;
    if (question.condition && !question.condition(result)) {
      return _result;
    }

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
