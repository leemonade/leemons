/*
  Knex schema builder

  TYPES
    increments(name, [options]): Creates an auto_increment column
    options:
    {
      primaryKey: (Sets if the column is the primary key)
      Boolean (default: true)
    }
    + uuid(name): Adds a uuid column


    + integer(name): Creates an integer column

    + bigInteger(name): Creates a bigInteger column (Only for MySQL and Postgre, otherwise, creates integer)
      returns: string (because of JS precision)

    + float(name, [precision], [scale]): Creates a float column
      precision: (Specifies the number of digits)
        Number || null (null means any precision, default = 8)
      scale: (Specifies the number of decimal precision)
        Number || null (null means any scale, default = 2)

    + decimal(name, [precision], [scale]): Creates a decimal column (Only for Oracle, SQLite, Postgres)
      precision: (Specifies the number of digits)
        Number || null (null means any precision, default = 8)
      scale: (Specifies the number of decimal precision)
        Number || null (null means any scale, default = 2)

    + binary(name, [length]): Adds a binary column
      length: (Only for MySQL)
        Number

    + boolean(name): Adds a boolean column


    - text(name, [textType]): Creates a text column
      textType: (only for MySQL, otherwise ignored)
        "mediumText" | "longText"

    + string(name, [length]): Creates a string column
      length: (specifies the length)
        Number (default: 255)

    + enu(name, values): Adds an enum column
      values: (specifies the enum values)
        Array


    - json(name): Adds a json column (should be stringified)

    + jsonb(name): Adds a jsonb column


    date(name): Adds a date column

    datetime(name, [options], [precision]): Adds a datetime column
      options:
        {
          useTz: Boolean (does not work for MySQL and MSSQL, default: true)
        }
      precision:
        Number

    time(name, [precision]): Adds a time column
      precision: (only for MySQL)
        Number

    timestamp(name, [options], [precision]): Adds a timestamp column
      options:
        {
          useTz: Boolean (does not work for MySQL and MSSQL, default: true)
        }
      precision:
        Number

    specificType(name, type): Adds the desired specific type

  PROPERTIES
    unique(name)

    foreign https://knexjs.org/#Schema-foreign
*/

function createTable(model, ctx) {
  const { schema } = ctx.ORM.knex;

  // TODO: Maybe move to an uuid/uid
  const createId = (table) => table.increments();

  const createColumns = (table) =>
    Object.entries(model.attributes).map(([name, properties]) => {
      if (properties.specificType) return table.specificType(name, properties.specificType);

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

async function createSchema(model, ctx) {
  const tableExists = (table) => ctx.ORM.knex.schema.hasTable(table);

  if (!(await tableExists(model.collectionName))) {
    await createTable(model, ctx);
  }
}

module.exports = createSchema;
