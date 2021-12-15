const _ = require('lodash');

function arrKeys(object) {
  return global.utils.getObjectArrayKeys(object);
}

function removeArrayPropFromString(string) {
  return string.replace(/\[(.*)\]/g, '');
}

/** *
 *  ES:
 *  Transforma un json schema (https://github.com/RXNT/react-jsonschema-form-conditionals) y lo devuelve transformado con las traducciones por un lado y el json
 *  schema de nuevo transformado a formato squirrel (https://squirrelly.js.org/) para poder usar las traducciones
 *
 *  EN:
 *  Transforms a json schema (https://github.com/RXNT/react-jsonschema-form-conditionals) and returns it transformed with the translations on one side and the json
 *  schema transformed back to squirrel format (https://squirrelly.js.org/) to be able to use the translations.
 *
 *  @public
 *  @static
 *  @param {any} jsonSchema - JSON Schema
 *  @param {string[]} saveKeys
 *  @param {string[]=} replaces
 *  @return {any} The new dataset location
 *  */
function transformJsonOrUiSchema(jsonSchema, saveKeys, replaces) {
  const schema = _.cloneDeep(jsonSchema);

  let keys = [];
  _.forEach(arrKeys(schema), (key) => {
    const props = _.split(key, '.');
    let path = '';
    _.forEach(props, (prop) => {
      const p = removeArrayPropFromString(prop);
      if (saveKeys.indexOf(p) >= 0) {
        keys.push(`${path}${p}`);
        return false;
      }
      path += `${prop}.`;
    });
  });

  keys = _.uniq(keys);
  const keysProp = _.map(keys, (value) => {
    const k = _.split(value, '.');
    return {
      key: _.join(_.take(k, k.length - 1), '.'),
      property: _.last(k),
    };
  });

  let values = JSON.stringify(_.pick(schema, keys));

  if (replaces) {
    _.forEach(saveKeys, (k, i) => {
      values = values.replaceAll(k, replaces[i]);
    });
  }

  values = JSON.parse(values);

  let obj;
  let property;
  let i;
  _.forEach(keysProp, (value) => {
    property = value.property;
    i = saveKeys.indexOf(value.property);
    if (replaces && i >= 0) {
      property = replaces[i];
    }
    if (value.key) {
      obj = _.get(schema, value.key);
      obj[value.property] = `{{@printWithOutErrors(it, '${value.key}.${property}')/}}`;
    } else {
      schema[value.property] = `{{@printWithOutErrors(it, '${property}')/}}`;
    }
  });

  return {
    values,
    json: schema,
  };
}

function getJsonSchemaProfilePermissionsKeys(jsonSchema) {
  const keys = [];
  _.forEach(arrKeys(jsonSchema), (key) => {
    if (key.indexOf('.permissions.') >= 0) {
      const k = _.split(key, '.');
      const prop = removeArrayPropFromString(k[k.length - 1]);
      if (prop !== '*') {
        k[k.length - 1] = prop;
        keys.push(_.join(k, '.'));
      }
    }
  });
  return _.uniq(keys);
}

module.exports = {
  arrKeys,
  getJsonSchemaProfilePermissionsKeys,
  getJsonSchemaProfilePermissionsKeysByType(_jsonSchema) {
    const jsonSchema = _.cloneDeep(_.isString(_jsonSchema) ? JSON.parse(_jsonSchema) : _jsonSchema);
    const profiles = _.clone(_.isString(jsonSchema) ? JSON.parse(jsonSchema) : jsonSchema || {});
    const roles = _.clone(_.isString(jsonSchema) ? JSON.parse(jsonSchema) : jsonSchema || {});
    profiles.properties = {};
    roles.properties = {};
    _.forIn(jsonSchema.properties, (value, key) => {
      if (value.permissionsType === 'profile') {
        profiles.properties[key] = _.cloneDeep(value);
      } else if (value.permissionsType === 'role') {
        roles.properties[key] = _.cloneDeep(value);
      }
    });
    return {
      profiles: getJsonSchemaProfilePermissionsKeys(profiles),
      roles: getJsonSchemaProfilePermissionsKeys(roles),
    };
  },
  transformJsonSchema(jsonSchema, ignoreKeys = []) {
    const keys = [
      'title',
      'description',
      'default',
      'enumNames',
      'checkboxLabels',
      'selectPlaceholder',
      'optionLabel',
      'yesOptionLabel',
      'noOptionLabel',
    ];
    _.forEach(ignoreKeys, (k) => {
      const index = keys.indexOf(k);
      if (index >= 0) {
        keys.splice(index, 1);
      }
    });
    return transformJsonOrUiSchema(jsonSchema, keys);
  },
  transformUiSchema(uiSchema) {
    return transformJsonOrUiSchema(
      uiSchema,
      ['ui:title', 'ui:description', 'ui:help'],
      ['ui_title', 'ui_description', 'ui_help']
    );
  },
};
