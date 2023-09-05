const { LeemonsError } = require('leemons-error');
const existLocation = require('../core/datesetLocation/existLocation');
const existSchema = require('../core/datasetSchema/existSchema');
const existSchemaLocale = require('../core/datasetSchemaLocale/existSchemaLocale');
const existValues = require('../core/datasetValues/existValues');

async function validateExistLocation({ locationName, pluginName, ctx }) {
  if (await existLocation({ locationName, pluginName, ctx }))
    throw new LeemonsError(ctx, { message: `The '${locationName}' location already exist` });
}

async function validateNotExistLocation({ locationName, pluginName, ctx }) {
  if (!(await existLocation({ locationName, pluginName, ctx })))
    throw new LeemonsError(ctx, { message: `The '${locationName}' location not exist` });
}
async function validateExistSchema({ locationName, pluginName, ctx }) {
  if (await existSchema({ locationName, pluginName, ctx }))
    throw new LeemonsError(ctx, {
      message: `A schema already exists for '${locationName}' dataset location`,
    });
}

async function validateNotExistSchema({ locationName, pluginName, ctx }) {
  if (!(await existSchema({ locationName, pluginName, ctx })))
    throw new LeemonsError(ctx, {
      message: `No schema for '${locationName}' dataset location`,
      httpStatusCode: 400,
      customCode: 4001,
    });
}

async function validateExistSchemaLocale({ locationName, pluginName, locale, ctx }) {
  if (await existSchemaLocale({ locationName, pluginName, locale, ctx }))
    throw new LeemonsError(ctx, {
      message: `"${locale}" language data for "${locationName}" localization already exists.`,
    });
}

async function validateNotExistSchemaLocale({ locationName, pluginName, locale, ctx }) {
  if (!(await existSchemaLocale({ locationName, pluginName, locale, ctx })))
    throw new LeemonsError(ctx, {
      message: `"${locale}" language data for "${locationName}" localization not exists.`,
      httpStatusCode: 400,
      customCode: 4002,
    });
}

async function validateExistValues({ locationName, pluginName, target, ctx }) {
  if (await existValues({ locationName, pluginName, target, ctx })) {
    if (target)
      throw new LeemonsError(ctx, {
        message: `Values already exist for the dataset ${locationName} and the target ${target}`,
      });
    throw new LeemonsError(ctx, {
      message: `Values already exist for the dataset ${locationName}`,
    });
  }
}

async function validateNotExistValues({ locationName, pluginName, target, ctx }) {
  if (!(await existValues({ locationName, pluginName, target, ctx }))) {
    if (target)
      throw new LeemonsError(ctx, {
        message: `Values not exist for the dataset ${locationName} and the target ${target}`,
      });
    throw new LeemonsError(ctx, { message: `Values not exist for the dataset ${locationName}` });
  }
}

function validatePluginName({ pluginName, calledFrom, ctx }) {
  if (pluginName !== calledFrom)
    throw new LeemonsError(ctx, { message: `The plugin name must be ${calledFrom}` });
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
