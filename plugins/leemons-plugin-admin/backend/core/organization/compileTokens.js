const transformTokens = require('./transform').tokenTransformer.default;
const { update: updateTheme } = require('../theme');

/**
 * Utility functions
 */

const transformTokensAndSave = async ({ tokens, sets, excludes, options, ctx }) => {
  const transformed = transformTokens(tokens, sets, excludes, options);
  await updateTheme({ tokens: transformed, ctx });
};

/**
 * Transformation
 *
 * Reads the given input file, transforms all tokens and writes them to the output file
 */
const compileTokens = async ({ jsonRaw, ctx }) => {
  const options = {
    expandTypography: false,
    expandShadow: false,
    expandComposition: false,
    preserveRawValu: false,
    resolveReferences: true,
  };

  await transformTokensAndSave({
    tokens: jsonRaw,
    sets: ['core', 'global', 'component'],
    excludes: [],
    options,
    ctx,
  });
};

module.exports = compileTokens;
