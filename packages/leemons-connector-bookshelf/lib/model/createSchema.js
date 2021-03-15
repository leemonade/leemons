const _ = require('lodash');
const { getModelLocation } = require('leemons-utils');

function getRelationCollectionName(properties, ctx) {
  const model = getModelLocation(properties.references.collection, ctx.leemons);
  return model.schema.collectionName;
}

function getRelationPrimaryKey(properties, ctx) {
  const model = getModelLocation(properties.references.collection, ctx.leemons);
  return model.schema.primaryKey;
}

// TODO: Update columns with foreign keys (maybe as easy as delete the key?)
async function createTable(model, ctx, useUpdate = false, storedData) {
  const { schema } = ctx.ORM.knex;

  // TODO: Maybe move to an uuid/uid
  const createId = (table) => table.increments(model.primaryKey.name);

  const createColumns = (table, columns = Object.entries(model.attributes), alter = false) =>
    columns.forEach(async ([name, properties]) => {
      // Create a column for the relation (only if not `many to many`)
      if (_.has(properties, 'references') && properties.references.relation !== 'many to many') {
        _.set(properties, 'type', getRelationPrimaryKey(properties, ctx).type);
        const col = table.integer(name).unsigned();

        // If the relation is `one to one`, set the column to unique
        if (properties.references.relation === 'one to one') {
          col.unique();
        }
        // If the relation is `one to many`, leave the column not unique
        return col;
      }

      // A SQL type defined by the user
      if (_.has(properties, 'specificType')) {
        return table.specificType(name, properties.specificType);
      }

      if (!_.has(properties, 'type')) {
        return null;
      }

      let col;
      // TODO: Let the user add unique, unsigned, notNull...
      switch (properties.type) {
        case 'string':
        case 'text':
        case 'richtext':
          col = table.string(name, properties.length); // default length is 255 (Do not use text because the space in disk ~65537B)
          break;
        case 'enum':
        case 'enu':
        case 'enumeration':
          if (Array.isArray(properties.enumValues)) {
            col = table.enu(name, properties.enum);
            break;
          }
          return null;

        case 'json':
        case 'jsonb':
          col = table.jsonb(name);
          break;

        case 'int':
        case 'integer':
          col = table.integer(name);
          break;

        case 'bigint':
        case 'biginteger':
          col = table.bigInteger(name);
          break;

        case 'float':
          col = table.float(name, properties.precision, properties.scale);
          break;

        case 'decimal':
          col = table.decimal(name, properties.precision, properties.scale);
          break;

        case 'binary':
          col = table.binary(name, properties.length);
          break;

        case 'boolean':
          col = table.boolean(name);
          break;

        case 'uuid':
          col = table.uuid(name);
          break;

        default:
          return null;
      }

      // Change the current column type for the new one
      if (alter) {
        col.alter();
      }

      return col;
    });

  // If the table has changed
  if (useUpdate) {
    const storedModel = JSON.parse(storedData.value);

    // Get the columns that changed
    const updatedColumns = Object.entries(model.attributes).filter(([name, properties]) => {
      const storedColumn = _.get(storedModel.schema, `attributes.${name}`);
      return storedColumn && !_.isEqual(properties, storedColumn);
    });

    // Get the created columns
    const newColumns = Object.entries(model.attributes).filter(([name]) => {
      const storedColumn = _.get(storedModel.schema, `attributes.${name}`);
      return storedColumn === null;
    });

    // Generate the new table
    if (updatedColumns.length > 0) {
      return schema.alterTable(model.collectionName, (table) => {
        createColumns(table, updatedColumns, true);
        createColumns(table, newColumns);
      });
    }
    return null;
  }

  // Generate a new table if is not already created
  return schema.createTable(model.collectionName, (table) => {
    createId(table);
    createColumns(table);
  });
}

function tableExists(table, ctx) {
  return ctx.ORM.knex.schema.hasTable(table);
}

async function createSchema(model, ctx) {
  const { schema } = model;
  let hasBeenUpdated = false;
  let storedModel;

  // check if the model has been updated
  if (model.modelName !== 'core_store') {
    storedModel = await ctx.leemons.core_store.get(`model::${model.modelName}`, false);
    hasBeenUpdated = storedModel && !_.isEqual(JSON.parse(storedModel.value), model);

    // Update the stored model for the next start
    if (hasBeenUpdated || !storedModel) {
      await ctx.leemons.core_store.set(
        `model::${model.modelName}`,
        JSON.stringify(model),
        'Object'
      );
    }
  }

  // Update the table if has changed or create a new one if it does not exists
  if (hasBeenUpdated || !(await tableExists(schema.collectionName, ctx))) {
    await createTable(schema, ctx, hasBeenUpdated, storedModel);
    return model;
  }
  return null;
}

async function createRelations(model, ctx) {
  const schema = model.schema || model;
  return Promise.all(
    // Get the attributes that are foreign keys
    Object.entries(schema.attributes)
      .filter(([, properties]) => _.has(properties, 'references'))
      .map(async ([name, properties]) => {
        // Get the name of the related table
        const relationTable = getRelationCollectionName(properties, ctx);

        // If we have a many to many relation, create a new table
        if (properties.references.relation === 'many to many') {
          const unionModel = {
            collectionName: model.ORM.relations[name].unionTable,
            info: {
              name: model.ORM.relations[name].unionTable,
              description: 'union table',
            },
            options: {},
            attributes: {
              [model.ORM.relations[name].foreignKey]: {
                references: {
                  collection: `${model.target}.${schema.collectionName}`,
                  relation: 'one to many',
                },
              },
              [model.ORM.relations[name].otherKey]: {
                references: {
                  collection: properties.references.collection,
                  relation: 'one to many',
                },
              },
            },
            primaryKey: {
              name: 'id',
              type: 'int',
            },
          };

          // If the table do not exist, create its
          if (!(await tableExists(unionModel.collectionName, ctx))) {
            return createTable(unionModel, ctx).then(() => createRelations(unionModel, ctx));
          }
          return null;
        }

        // Add the new foreign keys
        return ctx.ORM.knex.schema
          .table(schema.collectionName, (table) => {
            table
              .foreign(name)
              .references(getRelationPrimaryKey(properties, ctx).name)
              .inTable(relationTable);
          })
          .catch(() => {
            // Prevents error when foreign key is already created
          });
      })
  );
}

module.exports = { createSchema, createRelations };
