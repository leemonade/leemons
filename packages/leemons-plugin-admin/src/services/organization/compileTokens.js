const transformTokens = require('./transform').tokenTransformer.default;
const { update: updateTheme } = require('../theme');

/**
 * Utility functions
 */

const transformTokensAndSave = async (tokens, sets, excludes, options) => {
  const transformed = transformTokens(tokens, sets, excludes, options);
  await updateTheme({ tokens: transformed });
};

/**
 * Transformation
 *
 * Reads the given input file, transforms all tokens and writes them to the output file
 */
const compileTokens = async (jsonRaw) => {
  const options = {
    expandTypography: false,
    expandShadow: false,
    expandComposition: false,
    preserveRawValu: false,
    resolveReferences: true,
  };

  transformTokensAndSave(jsonRaw, ['core', 'global', 'component'], [], options);
};

module.exports = compileTokens;
