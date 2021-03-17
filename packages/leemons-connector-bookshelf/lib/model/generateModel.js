const _ = require('lodash');

// Gets the desired model from all the models
function getModelLocation(path, models) {
  return _.find(models, (model) => model.modelName === path.split('.').splice(-1)[0]);
}

function generateRelations(models, allModels = models) {
  models.forEach((model) => {
    Object.entries(model.schema.attributes).forEach(([name, attribute]) => {
      if (_.has(attribute, 'references')) {
        const referencedModel = getModelLocation(attribute.references.collection, allModels);
        switch (attribute.references.relation) {
          case 'one to one':
            // This model attribute belongsTo(the referenced model)
            _.set(model, `ORM.relations.${name}`, {
              type: 'belongsTo',
              model: referencedModel.modelName,
              foreignKey: name,
              foreignKeyTarget: referencedModel.schema.primaryKey.name,
            });

            // The referenced model hasOne(this model)
            _.set(referencedModel, `ORM.relations.${model.modelName}`, {
              type: 'hasOne',
              model: model.modelName,
              foreignKey: name,
              foreignKeyTarget: referencedModel.schema.primaryKey.name,
            });
            break;

          case 'many to many':
            // This model attribute belongsToMany(the referenced model)
            _.set(model, `ORM.relations.${name}`, {
              type: 'belongsToMany',
              model: referencedModel.modelName,
              unionTable: `${model.modelName}_${referencedModel.modelName}`,
              foreignKey: `${model.modelName}_id`,
              otherKey: `${referencedModel.modelName}_id`,
            });

            // The referenced model belongToMany(this model)
            _.set(referencedModel, `ORM.relations.${model.modelName}`, {
              type: 'belongsToMany',
              model: model.modelName,
              unionTable: `${model.modelName}_${referencedModel.modelName}`,
              foreignKey: `${referencedModel.modelName}_id`,
              otherKey: `${model.modelName}_id`,
            });
            break;

          // one to many
          default:
            // This model attribute belongsTo(the referenced model)
            _.set(model, `ORM.relations.${name}`, {
              type: 'belongsTo',
              model: referencedModel.modelName,
              foreignKey: name,
              foreignKeyTarget: referencedModel.schema.primaryKey.name,
            });
            // The referenced model hasMany(this model)
            _.set(referencedModel, `ORM.relations.${model.modelName}`, {
              type: 'hasMany',
              model: model.modelName,
              foreignKey: name,
              foreignKeyTarget: referencedModel.schema.primaryKey.name,
            });
        }
      }
    });
  });
}

function generateModel(models, ctx) {
  generateRelations(models, ctx.models);
  models.forEach((model) => {
    const Model = {
      tableName: model.schema.collectionName,
      idAttribute: model.schema.primaryKey.name,
      hidden: [],
      hasTimestamps: _.get(model.schema, 'options.useTimestamps', false),
      uuid: model.schema.primaryKey.type === 'uuid',
    };

    // Generate the hidden attributes
    _.forEach(model.schema.attributes, (attribute, name) => {
      if (_.get(attribute, 'hidden', false)) {
        Model.hidden.push(name);
      }
    });

    // In case a relation exists, add it to the model
    if (model.ORM) {
      _.forEach(model.ORM.relations, (relation, name) => {
        if (relation.type === 'belongsToMany') {
          // eslint-disable-next-line func-names
          Model[name] = function () {
            return this[relation.type](
              relation.model,
              relation.unionTable,
              relation.foreignKey,
              relation.otherKey
            );
          };
        } else {
          // eslint-disable-next-line func-names
          Model[name] = function () {
            return this[relation.type](
              relation.model,
              relation.foreignKey,
              relation.foreignKeyTarget
            );
          };
        }
      });
    }
    if (model.modelName === 'core_store') {
      _.set(ctx.connector.leemons, `core_store`, {
        ..._.cloneDeep(model),
        model: ctx.ORM.model(model.modelName, Model),
      });
    } else {
      const fullModel = {
        ..._.cloneDeep(model),
        model: ctx.ORM.model(model.modelName, Model),
      };
      // Set the model to leemons
      _.set(
        ctx.connector.leemons,
        `${model.target ? `${model.target}.models.` : ''}${model.modelName}`,
        fullModel
      );

      // Set the model for the connector
      ctx.connector.models.set(model.modelName, fullModel);
    }
  });
}

module.exports = generateModel;
