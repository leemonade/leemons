/**
 * @typedef {import('./mixin/helpers/addEmailTemplates.js').EmailTemplate} EmailTemplate
 */

const LeemonsEmailsMixin = require('./mixin/mixin');

// Register Babel for JSX files
require('@babel/register')({
  presets: ['@babel/preset-env', '@babel/preset-react'],
  ignore: [
    (filename) => {
      if (filename.includes('/node_modules/')) {
        return true; // Ignore
      }
      return !filename.endsWith('.jsx');
    },
  ],
});

const { getEmailTypes } = require('./getEmailTypes');
const { default: EmailLayout } = require('./emails/EmailLayout.jsx');

module.exports = {
  getEmailTypes,
  EmailLayout,
  LeemonsEmailsMixin,
};
