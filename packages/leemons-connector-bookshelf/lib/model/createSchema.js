const _ = require('lodash');

function getRelationCollectionName(properties, ctx) {
  const ref = properties.references.collection.split('.');
  ref.splice(ref.length - 1, 0, 'models');
  const path = ref.join('.');
  return _.get(ctx.leemons, path).schema.collectionName;
}

function getRelationPrimaryKey(properties, ctx) {
  const ref = properties.references.collection.split('.');
  ref.splice(ref.length - 1, 0, 'models');
  const path = ref.join('.');
  return _.get(ctx.leemons, path).schema.primaryKey;
}

function createTable(model, ctx) {
  const { schema } = ctx.ORM.knex;

  // TODO: Maybe move to an uuid/uid
  const createId = (table) => table.increments(model.primaryKey.name);

  const createColumns = (table) =>
    Object.entries(model.attributes).map(([name, properties]) => {
      // Create a column for the relation
      if (_.has(properties, 'references') && properties.references.relation !== 'many to many') {
        _.set(properties, 'type', getRelationPrimaryKey(properties, ctx).type);
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
  const { schema } = model;
  if (!(await tableExists(schema.collectionName, ctx))) {
    await createTable(schema, ctx);
    return model;
  }
  return null;
}

async function createRelations(model, ctx) {
  const schema = model.schema || model;
  // TODO: many to many relations
  return Promise.all(
    Object.entries(schema.attributes)
      .filter(([, properties]) => _.has(properties, 'references'))
      .map(([name, properties]) => {
        const relationTable = getRelationCollectionName(properties, ctx);
        if (properties.references.relation === 'many to many') {
          // TODO: check if exists because of user creation or foreign relation
          const collectionName = `${schema.collectionName}_${relationTable}`;
          const unionModel = {
            collectionName,
            info: {
              name: collectionName,
              description: 'union table',
            },
            options: {},
            attributes: {
              [`${schema.collectionName}_id`]: {
                references: {
                  collection: `${model.target}.${schema.collectionName}`,
                  relation: 'one to one',
                },
              },
              [`${relationTable}_id`]: {
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
        return ctx.ORM.knex.schema.table(schema.collectionName, (table) => {
          table
            .foreign(name)
            .references(getRelationPrimaryKey(properties, ctx).name)
            .inTable(relationTable);
        });
      })
  );
}

module.exports = {
  createRelations,
  createSchema,
};
