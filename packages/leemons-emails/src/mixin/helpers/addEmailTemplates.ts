import {
  acquireLock,
  getItemsHashByKey,
  getItemsToAdd,
  releaseLock,
  saveItemHash,
} from '@leemons/common';
import { pick, values } from 'lodash';
import { ADD_EMAIL_TEMPLATES_LOCK_NAME, HASH_DOCUMENT_KEY, LOCK_KEY } from '../constants';

export interface EmailTemplate {
  templateName: string;
  language: string;
  subject: string;
  html: string;
  type: string;
}

interface AddEmailTemplatesParams {
  KeyValuesModel: any; // TODO: Add proper type from @leemons/mongodb
  templates: EmailTemplate[];
  version?: number;
}

/**
 * Adds email templates to the system, including acquiring and releasing a lock to ensure
 * that templates are added atomically. It prepares the templates by appending the language
 * to the template name, checks for existing templates, waits for necessary services,
 * and finally saves the new templates if they do not already exist.
 */
export async function addEmailTemplates(
  this: any, // TODO: Add proper type from moleculer
  { KeyValuesModel, templates, version = 1 }: AddEmailTemplatesParams
): Promise<void> {
  // Convert the templates array into an object with the key as the key and the value as the template
  const templatesByKey = templates.reduce<Record<string, EmailTemplate>>((acc, template) => {
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
