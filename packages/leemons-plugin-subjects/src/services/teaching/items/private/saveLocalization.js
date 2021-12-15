const multilanguage = leemons.getPlugin('multilanguage')?.services.contents.getProvider();
const levelSchemas = leemons.query('plugins_subjects::levelSchemas');

// Save translated items
module.exports = async (name, entries, { deleteEmpty = false, transacting: t } = {}) =>
  global.utils.withTransaction(
    async (transacting) => {
      try {
        let missingLocales = [];
        const descriptionKey = leemons.plugin.prefixPN(`teaching.${name}`);

        // Get locales with values set, and locales to delete (empty)
        const { entriesToSet = {}, entriesToDelete = [] } = Object.entries(entries).reduce(
          (obj, [locale, value]) => {
            if (!value) {
              const _entriesToDelete = obj.entriesToDelete || [];
              return { ...obj, entriesToDelete: [..._entriesToDelete, locale] };
            }
            return { ...obj, entriesToSet: { ...obj.entriesToSet, [locale]: value } };
          },
          {}
        );

        // Save locales with value
        const { items, warnings } = await multilanguage.setManyByKey(descriptionKey, entriesToSet, {
          transacting,
        });

        // Delete empty locales (if requested)
        if (deleteEmpty && entriesToDelete.length) {
          await multilanguage.deleteMany(
            entriesToDelete.map((locale) => [descriptionKey, locale]),
            { transacting }
          );
        }

        if (warnings?.nonExistingLocales) {
          missingLocales = warnings.nonExistingLocales;
        }

        return {
          items,
          warnings: missingLocales.length ? { missingLocales } : null,
        };
      } catch (e) {
        console.log(e);
        throw new Error(`The translated teaching items can't be saved`);
      }
    },
    levelSchemas,
    t
  );
