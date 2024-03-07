const _ = require('lodash');

async function updateQuestion({ data, published, ctx }) {
  const { id, tags, clues, properties, ...props } = data;
  const question = await ctx.tx.db.Questions.findOne({ id }).lean();
  question.properties = JSON.parse(question.properties || null);

  // Si el tipo es mapa, comprobamos si ya existia un asset, si ya existia lo actualizamos, si no existia lo creamos.
  if (data.type === 'map') {
    if (question.properties.image) {
      const asset = await ctx.tx.call('leebrary.assets.update', {
        data: {
          id: question.properties.image,
          name: `Image question - ${question.id}`,
          cover: data.properties.image,
        },
        published,
      });
      properties.image = asset.id;
    } else {
      const asset = await ctx.tx.call('leebrary.assets.add', {
        asset: {
          name: `Image question - ${question.id}`,
          cover: data.properties.image,
        },
        options: { published },
      });
      properties.image = asset.id;
    }
  }

  // --- Question image
  if (question.questionImage) {
    const asset = await ctx.tx.call('leebrary.assets.update', {
      data: {
        id: question.questionImage,
        name: `Image question - ${question.id}`,
        cover: data.questionImage,
        description: data.questionImageDescription,
      },
      published,
    });

    props.questionImage = asset.id;
  } else {
    const asset = await ctx.tx.call('leebrary.assets.add', {
      asset: {
        name: `Image question - ${question.id}`,
        cover: data.questionImage,
        description: data.questionImageDescription,
      },
      options: { published },
    });
    props.questionImage = asset.id;
  }

  if (data.type === 'mono-response') {
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
        properties.responses[index].value.image = assets[index].id;
      });
    }

    if (toRemove.length) {
      await Promise.all(_.map(toRemove, (r) => ctx.tx.call('leebrary.assets.remove', { id: r })));
    }
  }

  const [updatedQuestion] = await Promise.all([
    ctx.tx.db.Questions.findOneAndUpdate(
      { id },
      {
        ...props,
        clues: JSON.stringify(clues),
        properties: JSON.stringify(properties),
      },
      { new: true, lean: true }
    ),
    ctx.tx.call('common.tags.setTagsToValues', {
      type: 'tests.questions',
      tags: tags || [],
      values: id,
    }),
  ]);
  return updatedQuestion;
}

module.exports = { updateQuestion };
