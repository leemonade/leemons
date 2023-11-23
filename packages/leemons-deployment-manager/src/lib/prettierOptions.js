/**
 * Prettier options for formatting the introduced code in files
 * @type {Object}
 */
const prettierOptions = {
  parser: 'babel', // The parser to use
  tabWidth: 2, // The number of spaces per indentation level
  useTabs: false, // Whether to use tabs for indentation
  semi: true, // Whether to print semicolons at the ends of statements
  endOfLine: 'lf', // The line feed type to use
  trailingCommas: 'es5', // Whether to print trailing commas where possible
  singleQuote: true, // Whether to use single quotes instead of double quotes
};

module.exports = { prettierOptions };
