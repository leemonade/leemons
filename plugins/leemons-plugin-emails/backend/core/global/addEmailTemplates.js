const _ = require('lodash');
const EmailService = require('../email');

async function addEmailTemplatesByLanguage({ templates, language, ctx }) {
  const emailTemplates = templates[language];
  const promises = emailTemplates.map((template) =>
    EmailService.addIfNotExist({
      ...template,
      ctx,
    })
  );
  return Promise.allSettled(promises);
}

/**
 * Adds email templates to the system.
 *
 * @param {object} params - The parameters for adding email templates.
 * @param {object[]} params.templates - An array of email template objects to be added.
 * @param {MoleculerContext} params.ctx - The Moleculer context for adding email templates.
 * @returns {Promise<Array>} A promise that resolves with the results of the email template addition operations.
 */
async function addEmailTemplates({ templates, ctx }) {
  // Organize templates into distinct arrays based on their language attribute.
  // This approach is necessary as EmailService.addIfNotExist function will generate a new "template" if one does not already exist.
  // Processing templates language-wise sequentially ensures orderly creation.
  const templatesByLanguage = _.groupBy(templates, 'language');
  const languages = _.keys(templatesByLanguage);

  // Sequentially execute tasks for each language
  return languages.reduce(async (accPromise, language) => {
    const acc = await accPromise;
    const res = await addEmailTemplatesByLanguage({
      templates: templatesByLanguage,
      language,
      ctx,
    });
    acc.push(res);
    return acc;
  }, Promise.resolve([]));
}

module.exports = {
  addEmailTemplates,
};
