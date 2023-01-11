const fs = require('fs');
const transformTokens = require('./transform').tokenTransformer.default;

/**
 * Utility functions
 */
const writeFile = (_path, contents) => fs.writeFile(_path, contents, () => {});

const transformTokensAndWriteFile = async (tokens, sets, excludes, options, output) => {
  const transformed = transformTokens(tokens, sets, excludes, options);
  if (!fs.existsSync('./config/tokens')) fs.mkdir('./config/tokens', () => {});
  writeFile(output, JSON.stringify(transformed, null, 2));
};

/**
 * Transformation
 *
 * Reads the given input file, transforms all tokens and writes them to the output file
 */
const compileTokens = async (jsonRaw) => {
  const output = './config/tokens/tokens-compiled.json';

  const options = {
    expandTypography: false,
    expandShadow: false,
    expandComposition: false,
    preserveRawValu: false,
    resolveReferences: true,
  };

  transformTokensAndWriteFile(jsonRaw, ['core', 'global', 'component'], [], options, output);
};

module.exports = compileTokens;
