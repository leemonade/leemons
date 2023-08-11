const _ = require('lodash');
const { table } = require('../tables');

async function createFeedbackQuestion(
  data,
  { userSession, published, transacting: _transacting } = {}
) {
  return global.utils.withTransaction(
    async (transacting) => {
      const { tags, clues, properties, ...props } = data;

      if (data.type === 'singleResponse' || data.type === 'multiResponse') {
        if (properties.withImages) {
          const promises = [];
          _.forEach(properties.responses, (response, index) => {
            promises.push(
              leemons.getPlugin('leebrary').services.assets.add(
                {
                  name: `Image question Response ${index}`,
                  cover: response.value.image,
                  description: response.value.imageDescription,
                  indexable: false,
                  public: true, // TODO Cambiar a false despues de hacer la demo
                },
                {
                  published,
                  userSession,
                  transacting,
                }
              )
            );
          });
          const assets = await Promise.all(promises);
          _.forEach(properties.responses, (response, index) => {
            response.value.image = assets[index].id;
          });
        }
      }

      return table.feedbackQuestions.create(
        {
          ...props,
          properties: JSON.stringify(properties),
        },
        { transacting }
      );
    },
    table.feedbackQuestions,
    _transacting
  );
}

module.exports = { createFeedbackQuestion };
