const { table } = require('../tables');

async function updateQuestion(data, { userSession, published, transacting: _transacting } = {}) {
  const tagsService = leemons.getPlugin('common').services.tags;
  return global.utils.withTransaction(
    async (transacting) => {
      const { id, tags, properties, ...props } = data;

      // Si el tipo es mapa, comprobamos si ya existia un asset, si ya existia lo actualizamos, si no existia lo creamos.
      if (data.type === 'map') {
        const question = await table.findOne({ id });
        question.properties = JSON.parse(question.properties);
        if (question.properties.image) {
          const asset = await leemons.getPlugin('leebrary').services.assets.update(
            {
              id: question.properties.image,
              name: `Image question - ${question.id}`,
              cover: data.properties.image,
            },
            {
              published,
              userSession,
              transacting,
            }
          );
          properties.image = asset.id;
        } else {
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
          properties.image = asset.id;
        }
      }
      const [updatedQuestion] = await Promise.all([
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
      return updatedQuestion;
    },
    table.questions,
    _transacting
  );
}

module.exports = { updateQuestion };
