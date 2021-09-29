const multilanguage = leemons.getPlugin('multilanguage')?.services.contents.getProvider();
const levels = leemons.query('plugins_subjects::levels');

// Save translated names
module.exports = async (level, names, { deleteEmpty = false, transacting: t } = {}) =>
  global.utils.withTransaction(
    async (transacting) => {
      try {
        let missingLocales = [];
        const nameKey = leemons.plugin.prefixPN(`levels.${level}.name`);

        // Get locales with values set, and locales to delete (empty)
        const { namesToSet = {}, namesToDelete = [] } = Object.entries(names).reduce(
          (obj, [locale, value]) => {
            if (!value) {
              const _namesToDelete = obj.namesToDelete || [];
              return { ...obj, namesToDelete: [..._namesToDelete, locale] };
            }
            return { ...obj, namesToSet: { ...obj.namesToSet, [locale]: value } };
          },
          {}
        );

        // Save locales with value
        const { items, warnings } = await multilanguage.setManyByKey(nameKey, namesToSet, {
          transacting,
        });

        // Delete empty locales (if requested)
        if (deleteEmpty && namesToDelete.length) {
          await multilanguage.deleteMany(
            namesToDelete.map((locale) => [nameKey, locale]),
            { transacting }
          );
        }

        if (warnings?.nonExistingLocales) {
          missingLocales = warnings.nonExistingLocales;
        }

        return {
          names: items,
          warnings: missingLocales.length ? { missingLocales } : null,
        };
      } catch (e) {
        throw new Error("the translated names can't be saved");
      }
    },
    levels,
    t
  );
