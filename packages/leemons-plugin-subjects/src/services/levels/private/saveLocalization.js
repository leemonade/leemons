const multilanguage = leemons.getPlugin('multilanguage')?.services.contents.getProvider();
const levels = leemons.query('plugins_subjects::levels');

// Save translated items
module.exports = async (level, type, entries, { deleteEmpty = false, transacting: t } = {}) =>
  global.utils.withTransaction(
    async (transacting) => {
      try {
        let missingLocales = [];
        const descriptionKey = leemons.plugin.prefixPN(`levels.${level}.${type}`);

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
          [type]: items,
          warnings: missingLocales.length ? { missingLocales } : null,
        };
      } catch (e) {
        throw new Error(`the translated ${type} can't be saved`);
      }
    },
    levels,
    t
  );
