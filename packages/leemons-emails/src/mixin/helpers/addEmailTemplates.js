const { pick, values } = require('lodash');
const {
  acquireLock,
  releaseLock,
  getItemsHashByKey,
  getItemsToAdd,
  saveItemHash,
} = require('@leemons/common');
const { HASH_DOCUMENT_KEY, LOCK_KEY, ADD_EMAIL_TEMPLATES_LOCK_NAME } = require('../constants');

/**
 * @typedef {Object} EmailTemplate
 * @property {string} templateName - The name of the email template.
 * @property {string} language - The language of the email template.
 * @property {string} subject - The subject of the email.
 * @property {string} html - The HTML content of the email.
 * @property {string} type - The type of the email.
 */

/**
 * Adds email templates to the system, including acquiring and releasing a lock to ensure
 * that templates are added atomically. It prepares the templates by appending the language
 * to the template name, checks for existing templates, waits for necessary services,
 * and finally saves the new templates if they do not already exist.
 *
 * @param {Object} params - The parameters for adding email templates.
 * @param {Object} params.KeyValuesModel - The Mongoose model for key-value pairs.
 * @param {EmailTemplate[]} params.templates - An array of email template objects to be added.
 * @param {number} [params.version=1] - The version of the email service to use.
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 */
async function addEmailTemplates({ KeyValuesModel, templates, version = 1 }) {
  // Convert the templates array into an object with the key as the key and the value as the template
  const templatesByKey = templates.reduce((acc, template) => {
    const key = `${template.templateName}_${template.language}`;
    acc[key] = template;
    return acc;
  }, {});

  const hashPerItem = getItemsHashByKey({ items: templatesByKey });
  const templatesKeysToAdd = await getItemsToAdd({
    hashPerItem,
    KeyValuesModel,
    documentKey: HASH_DOCUMENT_KEY,
    forceReload: String(process.env.FORCE_RELOAD_EMAILS) === 'true',
  });

  if (!templatesKeysToAdd.length) {
    this.logger.info('No email templates to add');
    return;
  }

  await this.broker.waitForServices(`v${version}.emails.global`);

  const lockKey = `${LOCK_KEY}.${ADD_EMAIL_TEMPLATES_LOCK_NAME}`;

  const isLockAcquired = await acquireLock({
    KeyValueModel: KeyValuesModel,
    lockKey,
  });

  if (!isLockAcquired) {
    return;
  }

  try {
    const result = await this.broker.call(
      `v${version}.emails.global.addEmailTemplates`,
      {
        templates: values(pick(templatesByKey, templatesKeysToAdd)),
        plugin: this.name.split('.')[0],
        version: this.version ?? null,
      },
      {
        meta: {
          deploymentID: 'global',
        },
      }
    );

    if (result) {
      await saveItemHash({
        KeyValuesModel,
        hashPerItem: pick(hashPerItem, templatesKeysToAdd),
        documentKey: HASH_DOCUMENT_KEY,
        forceReload: String(process.env.FORCE_RELOAD_EMAILS) === 'true',
      });
    }
  } catch (e) {
    this.logger.error('Error while adding email templates', e);
  } finally {
    await releaseLock({ KeyValueModel: KeyValuesModel, lockKey });
  }
}

module.exports = { addEmailTemplates };
