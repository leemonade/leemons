const { table } = require('../tables');

async function createQuestion(data, { userSession, published, transacting: _transacting } = {}) {
  const tagsService = leemons.getPlugin('common').services.tags;
  return global.utils.withTransaction(
    async (transacting) => {
      const { tags, properties, ...props } = data;
      delete properties.image;
      const question = await table.questions.create(
        {
          ...props,
          properties: JSON.stringify(properties),
        },
        { transacting }
      );

      // ES: Si el tipo es map creamos el asset
      if (data.type === 'map') {
        const asset = await leemons.getPlugin('leebrary').services.assets.add(
          {
            name: `Image question - ${question.id}`,
            cover: data.properties.image,
          },
          {
            published,
            userSession,
            transacting,
          }
        );
        await table.questions.update(
          { id: question.id },
          {
            properties: JSON.stringify({ ...properties, image: asset.id }),
          },
          { transacting }
        );
      }

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
