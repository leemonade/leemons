const _ = require('lodash');

async function updateFeedbackQuestion({ data, published, ctx }) {
  const { id, properties, ...props } = data;
  const question = await ctx.tx.db.FeedbackQuestions.findOne({ id }).lean();
  question.properties = JSON.parse(question.properties || null);

  // Si el tipo es mapa, comprobamos si ya existia un asset, si ya existia lo actualizamos, si no existia lo creamos.

  if (data.type === 'singleResponse' || data.type === 'multiResponse') {
    const toRemove = [];
    _.forEach(question.properties.responses, (response) => {
      if (response.value.image) {
        toRemove.push(response.value.image);
      }
    });

    if (properties.withImages) {
      const promises = [];
      _.forEach(properties.responses, (response, index) => {
        promises.push(
          ctx.tx.call('leebrary.assets.add', {
            asset: {
              name: `Image question Response ${index}`,
              cover: response.value.image,
              description: response.value.imageDescription,
              indexable: false,
              public: true, // TODO Cambiar a false despues de hacer la demo
            },
            published,
          })
        );
      });
      const assets = await Promise.all(promises);
      _.forEach(properties.responses, (response, index) => {
        properties.responses[index].value.image = assets[index].id;
      });
    }

    if (toRemove.length) {
      await Promise.all(_.map(toRemove, (r) => ctx.tx.call('leebrary.assets.remove', { id: r })));
    }
  }

  return ctx.tx.db.FeedbackQuestions.findOneAndUpdate(
    { id },
    {
      ...props,
      properties: JSON.stringify(properties),
    },
    { new: true, lean: true }
  );
}

module.exports = { updateFeedbackQuestion };
