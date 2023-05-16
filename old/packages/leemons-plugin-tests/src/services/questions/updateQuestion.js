const _ = require('lodash');
const { table } = require('../tables');

async function updateQuestion(data, { userSession, published, transacting: _transacting } = {}) {
  const tagsService = leemons.getPlugin('common').services.tags;
  return global.utils.withTransaction(
    async (transacting) => {
      const { id, tags, clues, properties, ...props } = data;
      const question = await table.questions.findOne({ id });
      question.properties = JSON.parse(question.properties);

      // Si el tipo es mapa, comprobamos si ya existia un asset, si ya existia lo actualizamos, si no existia lo creamos.
      if (data.type === 'map') {
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

      // console.log(question.questionImage, data.questionImage);

      // --- Question image
      if (question.questionImage) {
        const asset = await leemons.getPlugin('leebrary').services.assets.update(
          {
            id: question.questionImage,
            name: `Image question - ${question.id}`,
            cover: data.questionImage,
            description: data.questionImageDescription,
          },
          {
            published,
            userSession,
            transacting,
          }
        );

        props.questionImage = asset.id;
      } else {
        const asset = await leemons.getPlugin('leebrary').services.assets.add(
          {
            name: `Image question - ${question.id}`,
            cover: data.questionImage,
            description: data.questionImageDescription,
          },
          {
            published,
            userSession,
            transacting,
          }
        );
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

      const [updatedQuestion] = await Promise.all([
        table.questions.update(
          { id },
          {
            ...props,
            clues: JSON.stringify(clues),
            properties: JSON.stringify(properties),
          },
          { transacting }
        ),
        tagsService.setTagsToValues('plugins.tests.questions', tags || [], id, {
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
