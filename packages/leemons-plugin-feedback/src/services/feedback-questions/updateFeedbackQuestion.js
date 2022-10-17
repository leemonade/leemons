const _ = require('lodash');
const { table } = require('../tables');

async function updateFeedbackQuestion(
  data,
  { userSession, published, transacting: _transacting } = {}
) {
  return global.utils.withTransaction(
    async (transacting) => {
      const { id, properties, ...props } = data;
      const question = await table.feedbackQuestions.findOne({ id });
      question.properties = JSON.parse(question.properties);

      // Si el tipo es mapa, comprobamos si ya existia un asset, si ya existia lo actualizamos, si no existia lo creamos.

      if (data.type === 'singleResponse' || data.type === 'multiResponse') {
        const toRemove = [];
        _.forEach(question.properties.responses, (response) => {
          if (response.value.image) {
            toRemove.push(response.value.image);
          }
        });

        if (data.withImages) {
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
            properties.responses[index].value.image = assets[index].id;
          });
        }

        if (toRemove.length) {
          await Promise.all(
            _.map(toRemove, (r) =>
              leemons.getPlugin('leebrary').services.assets.remove(r, {
                userSession,
                transacting,
              })
            )
          );
        }
      }

      return table.feedbackQuestions.update(
        { id },
        {
          ...props,
          properties: JSON.stringify(properties),
        },
        { transacting }
      );
    },
    table.questions,
    _transacting
  );
}

module.exports = { updateFeedbackQuestion };
