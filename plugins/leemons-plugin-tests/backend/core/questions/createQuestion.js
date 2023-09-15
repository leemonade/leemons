const _ = require('lodash');

async function createQuestion({ data, published, ctx }) {
  const { tags, clues, properties, ...props } = data;
  // ES: Si el tipo es map creamos el asset
  if (data.type === 'map') {
    const asset = await ctx.tx.call('leebrary.assets.add', {
      asset: {
        name: `Image question`,
        cover: data.properties.image,
        indexable: false,
        public: true, // TODO Cambiar a false despues de hacer la demo
      },
      options: { published },
    });
    properties.image = asset.id;
  }

  if (data.type === 'mono-response') {
    if (data.withImages) {
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
            options: { published },
          })
        );
      });
      const assets = await Promise.all(promises);
      _.forEach(properties.responses, (response, index) => {
        response.value.image = assets[index].id;
      });
    }
  }

  if (props.questionImage) {
    const asset = await ctx.tx.call('leebrary.assets.add', {
      asset: {
        name: `Image question`,
        cover: data.questionImage,
        description: data.questionImageDescription,
        indexable: false,
        public: true, // TODO Cambiar a false despues de hacer la demo
      },
      options: { published },
    });

    props.questionImage = asset.id;
  }

  let question = await ctx.tx.db.Questions.create({
    ...props,
    clues: JSON.stringify(clues),
    properties: JSON.stringify(properties),
  });
  question = question.toObject();

  await ctx.tx.call('common.tags.setTagsToValues', {
    type: 'tests.questions',
    tags: tags || [],
    values: question.id,
  });

  return question;
}

module.exports = { createQuestion };
