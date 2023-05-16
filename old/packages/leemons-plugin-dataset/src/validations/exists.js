const existLocation = require('../services/dataset-location/existLocation');
const existSchema = require('../services/dataset-schema/existSchema');
const existSchemaLocale = require('../services/dataset-schema-locale/existSchemaLocale');
const existValues = require('../services/dataset-values/existValues');

async function validateExistLocation(locationName, pluginName, { transacting }) {
  if (await existLocation(locationName, pluginName, { transacting }))
    throw new Error(`The '${locationName}' location already exist`);
}

async function validateNotExistLocation(locationName, pluginName, { transacting }) {
  if (!(await existLocation(locationName, pluginName, { transacting })))
    throw new Error(`The '${locationName}' location not exist`);
}

async function validateExistSchema(locationName, pluginName, { transacting }) {
  if (await existSchema(locationName, pluginName, { transacting }))
    throw new Error(`A schema already exists for '${locationName}' dataset location`);
}

async function validateNotExistSchema(locationName, pluginName, { transacting }) {
  if (!(await existSchema(locationName, pluginName, { transacting })))
    throw new global.utils.HttpErrorWithCustomCode(
      400,
      4001,
      `No schema for '${locationName}' dataset location`
    );
}

async function validateExistSchemaLocale(locationName, pluginName, locale, { transacting }) {
  if (await existSchemaLocale(locationName, pluginName, locale, { transacting }))
    throw new Error(`"${locale}" language data for "${locationName}" localization already exists.`);
}

async function validateNotExistSchemaLocale(locationName, pluginName, locale, { transacting }) {
  if (!(await existSchemaLocale(locationName, pluginName, locale, { transacting })))
    throw new global.utils.HttpErrorWithCustomCode(
      400,
      4002,
      `"${locale}" language data for "${locationName}" localization not exists.`
    );
}

async function validateExistValues(locationName, pluginName, target, { transacting }) {
  if (await existValues(locationName, pluginName, { target, transacting })) {
    if (target)
      throw new Error(
        `Values already exist for the dataset ${locationName} and the target ${target}`
      );
    throw new Error(`Values already exist for the dataset ${locationName}`);
  }
}

async function validateNotExistValues(locationName, pluginName, target, { transacting }) {
  if (!(await existValues(locationName, pluginName, { target, transacting }))) {
    if (target)
      throw new Error(`Values not exist for the dataset ${locationName} and the target ${target}`);
    throw new Error(`Values not exist for the dataset ${locationName}`);
  }
}

function validatePluginName(pluginName, calledFrom) {
  if (pluginName !== calledFrom) throw new Error(`The plugin name must be ${calledFrom}`);
}

module.exports = {
  validateExistLocation,
  validateNotExistLocation,
  validateExistSchema,
  validateNotExistSchema,
  validateExistSchemaLocale,
  validateNotExistSchemaLocale,
  validateExistValues,
  validateNotExistValues,
  validatePluginName,
};
