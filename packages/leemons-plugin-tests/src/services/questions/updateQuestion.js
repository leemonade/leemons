const { table } = require('../tables');

async function updateQuestion(data, { transacting: _transacting } = {}) {
  const tagsService = leemons.getPlugin('common').services.tags;
  return global.utils.withTransaction(
    async (transacting) => {
      const { id, tags, properties, ...props } = data;
      const [question] = await Promise.all([
        table.questions.update(
          { id },
          {
            ...props,
            properties: JSON.stringify(properties),
          },
          { transacting }
        ),
        tagsService.setTagsToValues('plugins.tests.questionBanks', tags || [], id, {
          transacting,
        }),
      ]);
      return question;
    },
    table.questions,
    _transacting
  );
}

module.exports = { updateQuestion };
