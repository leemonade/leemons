const _ = require('lodash');
const { getModel, generateModelName } = require('leemons-utils');

function generateRelations(models) {
  models.forEach((model) => {
    Object.entries(model.schema.attributes).forEach(([name, attribute]) => {
      if (_.has(attribute, 'references')) {
        const referencedModel = getModel(attribute.references.collection, models);
        switch (attribute.references.relation) {
          case 'one to one':
            // This model attribute belongsTo(the referenced model)
            _.set(model, `relations.${name}`, {
              type: 'belongsTo',
              model: referencedModel.modelName,
              foreignKey: name,
              foreignKeyTarget: referencedModel.schema.primaryKey.name,
            });

            // The referenced model hasOne(this model)
            _.set(referencedModel, `relations.${model.originalModelName}`, {
              type: 'hasOne',
              model: model.modelName,
              foreignKey: name,
              foreignKeyTarget: referencedModel.schema.primaryKey.name,
            });
            break;

          case 'many to many':
            // This model attribute belongsToMany(the referenced model)
            _.set(model, `relations.${name}`, {
              type: 'belongsToMany',
              model: referencedModel.modelName,
              target: model.target,
              // If the user specified a custom name, use that name, if not, concat both originalModelNames
              unionTable:
                attribute.references.unionTable ||
                `${model.originalModelName}_${referencedModel.originalModelName}`,
              foreignKey: `${model.originalModelName}_id`,
              otherKey: `${referencedModel.originalModelName}_id`,
            });

            // The referenced model belongToMany(this model)
            _.set(referencedModel, `relations.${model.originalModelName}`, {
              type: 'belongsToMany',
              model: model.modelName,
              unionTable:
                attribute.references.unionTable ||
                `${model.originalModelName}_${referencedModel.originalModelName}`,
              foreignKey: `${referencedModel.originalModelName}_id`,
              otherKey: `${model.originalModelName}_id`,
            });
            break;

          // one to many
          default:
            // This model attribute belongsTo(the referenced model)
            _.set(model, `relations.${name}`, {
              type: 'belongsTo',
              model: referencedModel.modelName,
              foreignKey: name,
              foreignKeyTarget: referencedModel.schema.primaryKey.name,
            });
            // The referenced model hasMany(this model)

            _.set(referencedModel, `relations.${model.originalModelName}`, {
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
  generateRelations(models);
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
    if (model.relations) {
      _.forEach(model.relations, (relation, name) => {
        if (relation.type === 'belongsToMany') {
          // eslint-disable-next-line func-names
          Model[name] = function () {
            return this[relation.type](
              relation.model,
              generateModelName(relation.target, relation.unionTable),
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
        ORM: ctx.ORM,
        model: ctx.ORM.model(model.modelName, Model),
      };
      // Set the model to leemons
      _.set(
        ctx.connector.leemons,
        `${model.target ? `${model.target}.models.` : ''}${model.originalModelName}`,
        fullModel
      );

      // Set the model for the connector
      ctx.connector.models.set(model.modelName, fullModel);
    }
  });
}

module.exports = generateModel;
