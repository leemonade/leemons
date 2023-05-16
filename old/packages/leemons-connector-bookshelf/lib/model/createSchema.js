const _ = require('lodash');

const { getModel, generateModelName } = require('leemons-utils');
const { formatModel } = require('leemons/lib/core/model/loadModel');
const generateModel = require('./generateModel');

function getRelationCollectionName(properties) {
  const model = getModel(properties.references.collection);
  return model.schema.collectionName;
}

function getRelationPrimaryKey(properties) {
  try {
    const model = getModel(properties.references.collection);
    return model.schema.primaryKey;
  } catch (err) {
    console.error(`Error on referencing collection: ${properties.references.collection}`);
    throw err;
  }
}

// TODO: Update columns with foreign keys (maybe as easy as delete the key?)
async function createTable(model, ctx, useUpdate = false, storedData, transacting) {
  let { schema } = ctx.ORM.knex;

  // If is running on a transaction, replace schema by schema with transaction
  if (transacting) {
    schema = schema.transacting(transacting);
  }

  const createId = (table) => {
    if (_.has(model.primaryKey, 'specificType')) {
      return table.specificType(model.primaryKey.name, model.primaryKey.specificType).primary();
    }
    if (model.primaryKey.type === 'uuid') {
      return table.uuid(model.primaryKey.name).primary();
    }
    _.set(model.primaryKey, 'type', 'int');
    return table.increments(model.primaryKey.name);
  };

  const createColumns = (table, columns = Object.entries(model.attributes), alter = false) =>
    columns.forEach(async ([name, properties]) => {
      let col;
      // Create a column for the relation (only if not `many to many`)
      if (_.has(properties, 'references') && properties.references.relation === 'many to many') {
        return undefined;
      }
      // Relations which are not many to many
      if (_.has(properties, 'references')) {
        const field = _.get(properties, 'references.field', null);
        // If the field is not specified, use primary key
        let relatedField;
        if (!field) {
          relatedField = getRelationPrimaryKey(properties);
          // If is a primary key, add the unsigned value to true
          if (relatedField.type === 'int') {
            _.set(properties, 'options.unsigned', true);
          }
        } else {
          relatedField = _.get(
            getModel(properties.references.collection),
            `schema.attributes.${field}`,
            null
          );
        }

        // Set the same config for column (omit unnecesary options)
        _.assign(properties, _.omit(relatedField, ['options.unique']));

        // If the relation is `one to one`, set the column to unique
        if (properties.references.relation === 'one to one') {
          _.set(properties, 'options.unique', true);
        }
      }

      // A SQL type defined by the user
      if (_.has(properties, 'specificType')) {
        col = table.specificType(name, properties.specificType);
      }

      // Has not type specified at all and is not a relation
      else if (!_.has(properties, 'type')) {
        return null;
      }

      // Has a bookshelf type
      else {
        // Set the property type
        switch (properties.type) {
          case 'string':
            col = table.string(name, properties.length); // default length is 255
            break;
          case 'text':
          case 'richtext':
            col = table.text(name, properties.textType); // default to text (65535 chars), can also be: mediumText (16777215 chars) or longtext (4294967295 chars).
            break;
          case 'enum':
          case 'enu':
          case 'enumeration':
            if (Array.isArray(properties.enum)) {
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

          case 'number':
          case 'float':
            col = table.float(name, properties.precision, properties.scale);
            break;

          case 'decimal':
            col = table.decimal(name, properties.precision, properties.scale);
            break;

          case 'date':
            col = table.date(name);
            break;

          case 'time':
          case 'datetime':
          case 'timestamp':
            col = table[properties.type](name, { precision: properties.precision });
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
      }

      // Set the property options (index, notNull, unique...)
      if (properties.options) {
        _.forEach(properties.options, (property, optionName) => {
          if (property === true) {
            switch (optionName) {
              case 'index':
                try {
                  /*
                  table.index(
                    [name],
                    properties.options.indexName,
                    properties.options.indexOptions
                  );
                   */
                } catch (e) {
                  // It is possible that the index already exists and throws error, we ignore it.
                }
                break;
              case 'unique':
                col.unique();
                break;
              case 'unsigned':
                col.unsigned();
                break;
              case 'notNullable':
              case 'notNull':
                col.notNullable();
                break;
              case 'defaultTo':
                col.defaultTo(property);
                break;
              default:
            }
          } else if (property !== undefined) {
            switch (optionName) {
              case 'defaultTo':
                col.defaultTo(property);
                break;
              case 'notNullable':
              case 'notNull':
                col.nullable();
                break;
              default:
            }
          }
        });
      }
      if (alter) {
        // Change the current column type for the new one
        col.alter();
      }

      return col;
    });

  const parseOptions = (table, options = model.options) => {
    const { useTimestamps } = options;

    if (useTimestamps) {
      table.timestamps(true, true);
      table.timestamp('deleted_at').nullable();
    }
  };

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
      const storedColumn = _.get(storedModel.schema, `attributes.${name}`, undefined);
      return storedColumn === undefined;
    });

    const newOptions = Object.entries(model.options).filter(([name, value]) => {
      const storedOption = _.get(storedModel.schema, `options.${name}`);
      return storedOption === false && value === true;
    });

    // Generate the new table
    if (updatedColumns.length > 0 || newColumns.length > 0 || newOptions.length > 0) {
      return schema.alterTable(model.collectionName, (table) => {
        createColumns(table, updatedColumns, true);
        createColumns(table, newColumns);
        parseOptions(table, _.fromPairs(newOptions));
      });
    }
    return null;
  }

  // Generate a new table if is not already created
  return schema.createTable(model.collectionName, (table) => {
    createId(table);
    createColumns(table);
    parseOptions(table);
  });
}

function tableExists(table, ctx) {
  return ctx.ORM.knex.schema.hasTable(table);
}

async function createSchema(model, ctx, transacting) {
  const { schema } = model;
  let hasBeenUpdated = false;
  let storedModel;

  // check if the model has been updated
  if (model.modelName !== 'models::core_store') {
    storedModel = await ctx.connector.leemons.models.core_store.get(
      `model::${model.modelName}`,
      false,
      transacting
    );
    hasBeenUpdated = storedModel && !_.isEqual(JSON.parse(storedModel.value), model);

    // Update the stored model for the next start
    if (hasBeenUpdated || !storedModel) {
      await ctx.connector.leemons.models.core_store.set({
        key: `model::${model.modelName}`,
        value: JSON.stringify(model),
        type: 'Object',
        transacting,
      });
    }
  }

  // Update the table if has changed or create a new one if it does not exists
  const isTableCreated = await tableExists(schema.collectionName, ctx);
  if (hasBeenUpdated || !isTableCreated) {
    // Only update if the table is already created
    await createTable(schema, ctx, hasBeenUpdated && isTableCreated, storedModel);
    return model;
  }
  return null;
}

async function createRelations(model, ctx) {
  const { schema } = model;
  return Promise.all(
    // Get the attributes that are foreign keys
    Object.entries(schema.attributes)
      .filter(([, properties]) => _.has(properties, 'references'))
      .map(async ([name, properties]) => {
        // Get the name of the related table
        const relationTable = getRelationCollectionName(properties);

        // If we have a many to many relation, create a new table
        if (properties.references.relation === 'many to many') {
          let unionModel = {
            connection: model.connection, // Preserve original model connection
            collectionName: model.relations[name].unionTable,
            info: {
              name: model.relations[name].unionTable,
              description: 'union table',
            },
            target: model.target,
            options: {},
            attributes: {
              [model.relations[name].foreignKey]: {
                references: {
                  collection: generateModelName(model.target, model.originalModelName),
                  relation: 'one to many',
                },
              },
              [model.relations[name].otherKey]: {
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
          // Standardize model
          unionModel = formatModel(model.relations[name].unionTable, unionModel)[
            generateModelName(model.target, model.relations[name].unionTable)
          ];

          return createSchema(unionModel, ctx).then(() => {
            // Create bookshelf models
            generateModel([unionModel], ctx);
            // Generate relations
            return createRelations(unionModel, ctx);
          });
        }

        // Set default actions on Update and Delete
        if (!properties.references.onUpdate) {
          _.set(properties, 'references.onUpdate', 'cascade');
        }
        if (!properties.references.onDelete) {
          _.set(properties, 'references.onDelete', 'no action');
        }
        // Add the new foreign keys
        return ctx.ORM.knex.schema
          .table(schema.collectionName, (table) => {
            table
              .foreign(name)
              .references(model.relations[name].foreignKeyTarget)
              .inTable(relationTable)
              .onUpdate(properties.references.onUpdate)
              .onDelete(properties.references.onDelete);
          })
          .catch(() => {
            // Prevents error when foreign key is already created
          });
      })
  );
}

module.exports = { createSchema, createRelations };
