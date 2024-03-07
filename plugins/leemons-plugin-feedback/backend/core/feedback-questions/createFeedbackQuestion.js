const _ = require('lodash');

async function createFeedbackQuestion({ data, published, ctx }) {
  const { tags, clues, properties, ...props } = data;

  if (data.type === 'singleResponse' || data.type === 'multiResponse') {
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
            options: {
              published,
            },
          })
        );
      });
      const assets = await Promise.all(promises);
      _.forEach(properties.responses, (response, index) => {
        response.value.image = assets[index].id;
      });
    }
  }

  return ctx.tx.db.FeedbackQuestions.create({
    ...props,
    properties: JSON.stringify(properties),
  }).then((r) => r.toObject());
}

module.exports = { createFeedbackQuestion };
