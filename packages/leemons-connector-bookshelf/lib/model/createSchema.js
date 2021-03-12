const _ = require('lodash');

function createTable(model, ctx) {
  const { schema } = ctx.ORM.knex;

  const getRelationPrimaryKey = (properties) =>
    ctx.leemons.models[properties.references.collection].primaryKey;

  // TODO: Maybe move to an uuid/uid
  const createId = (table) => table.increments(model.primaryKey.name);

  const createColumns = (table) =>
    Object.entries(model.attributes).map(([name, properties]) => {
      // Create a column for the relation
      if (_.has(properties, 'references') && properties.references.relation !== 'many to many') {
        _.set(properties, 'type', getRelationPrimaryKey(properties).type);
        const col = table.integer(name).unsigned();

        if (properties.references.relation === 'one to one') {
          col.unique();
        }
        return col;
      }

      if (_.has(properties, 'specificType')) {
        return table.specificType(name, properties.specificType);
      }

      if (!_.has(properties, 'type')) {
        return null;
      }

      // TODO: Let the user add unique, unsigned, notNull...
      switch (properties.type) {
        case 'string':
        case 'text':
        case 'richtext':
          return table.string(name, properties.length); // default length is 255 (Do not use text because the space in disk ~65537B)

        case 'enum':
        case 'enu':
        case 'enumeration':
          if (Array.isArray(properties.enumValues)) {
            return table.enu(name, properties.enum);
          }
          return null;

        case 'json':
        case 'jsonb':
          return table.jsonb(name);

        case 'int':
        case 'integer':
          return table.integer(name);

        case 'bigint':
        case 'biginteger':
          return table.bigInteger(name);

        case 'float':
          return table.float(name, properties.precision, properties.scale);

        case 'decimal':
          return table.decimal(name, properties.precision, properties.scale);

        case 'binary':
          return table.binary(name, properties.length);

        case 'boolean':
          return table.boolean(name);

        case 'uuid':
          return table.uuid(name);

        default:
          return null;
      }
    });

  return schema.createTable(model.collectionName, (table) => {
    createId(table);
    createColumns(table);
  });
}

function tableExists(table, ctx) {
  return ctx.ORM.knex.schema.hasTable(table);
}

async function createSchema(model, ctx) {
  if (!(await tableExists(model.collectionName, ctx))) {
    await createTable(model, ctx);
    return model;
  }
  return null;
}

async function createRelations(model, ctx) {
  // TODO: many to many relations
  return Promise.all(
    Object.entries(model.attributes)
      .filter(([, properties]) => _.has(properties, 'references'))
      .map(([name, properties]) => {
        if (properties.references.relation === 'many to many') {
          // TODO: check if exists because of user creation or foreign relation
          const collectionName = `${model.collectionName}_${properties.references.collection}`;
          const unionModel = {
            collectionName,
            info: {
              name: collectionName,
              description: 'union table',
            },
            options: {},
            attributes: {
              [`${model.collectionName}_id`]: {
                references: {
                  collection: model.collectionName,
                  relation: 'one to one',
                },
              },
              [`${properties.references.collection}_id`]: {
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

          return createTable(unionModel, ctx).then(() => createRelations(unionModel, ctx));
        }
        return ctx.ORM.knex.schema.table(model.collectionName, (table) => {
          table
            .foreign(name)
            .references(ctx.leemons.models[properties.references.collection].primaryKey.name)
            .inTable(properties.references.collection);
        });
      })
  );
}

module.exports = {
  createRelations,
  createSchema,
};
