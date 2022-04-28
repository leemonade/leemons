const { table } = require('../tables');

async function createQuestion(data, { userSession, published, transacting: _transacting } = {}) {
  const tagsService = leemons.getPlugin('common').services.tags;
  return global.utils.withTransaction(
    async (transacting) => {
      const { tags, properties, ...props } = data;
      // ES: Si el tipo es map creamos el asset
      if (data.type === 'map') {
        const asset = await leemons.getPlugin('leebrary').services.assets.add(
          {
            name: `Image question`,
            cover: data.properties.image,
            indexable: true,
            public: true, // TODO Cambiar a false despues de hacer la demo
          },
          {
            published,
            userSession,
            transacting,
          }
        );
        properties.image = asset.id;
      }
      const question = await table.questions.create(
        {
          ...props,
          properties: JSON.stringify(properties),
        },
        { transacting }
      );

      await tagsService.setTagsToValues('plugins.tests.questionBanks', tags || [], question.id, {
        transacting,
      });
      return question;
    },
    table.questions,
    _transacting
  );
}

module.exports = { createQuestion };
