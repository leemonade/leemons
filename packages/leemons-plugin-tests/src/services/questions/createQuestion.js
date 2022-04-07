const { table } = require('../tables');

async function createQuestion(data, { transacting: _transacting } = {}) {
  const tagsService = leemons.getPlugin('common').services.tags;
  return global.utils.withTransaction(
    async (transacting) => {
      const { tags, ...props } = data;
      const question = await table.questions.create(props, { transacting });
      await tagsService.setTagsToValues('plugins.tests.questions', tags, question.id, {
        transacting,
      });
      return question;
    },
    table.questions,
    _transacting
  );
}

module.exports = { createQuestion };
