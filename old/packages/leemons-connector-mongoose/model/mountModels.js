const _ = require('lodash');
const generateModel = require('./generateModel');

async function mountModels(models, ctx) {
  // Add model needed attributes
  const finalModels = models.map((model) => {
    _.set(model, 'schema.attributes.deleted', {
      type: 'boolean',
      options: {
        notNull: true,
        defaultTo: false,
      },
    });

    return model;
  });

  // Create the models
  generateModel(finalModels, ctx);
}

module.exports = mountModels;
