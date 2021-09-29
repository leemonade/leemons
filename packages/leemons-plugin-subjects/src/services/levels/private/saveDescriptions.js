const multilanguage = leemons.getPlugin('multilanguage')?.services.contents.getProvider();
const levels = leemons.query('plugins_subjects::levels');

// Save translated descriptions
module.exports = async (level, descriptions, { deleteEmpty = false, transacting: t } = {}) =>
  global.utils.withTransaction(
    async (transacting) => {
      try {
        let missingLocales = [];
        const descriptionKey = leemons.plugin.prefixPN(`levels.${level}.description`);

        // Get locales with values set, and locales to delete (empty)
        const { descriptionsToSet = {}, descriptionsToDelete = [] } = Object.entries(
          descriptions
        ).reduce((obj, [locale, value]) => {
          if (!value) {
            const _descriptionsToDelete = obj.descriptionsToDelete || [];
            return { ...obj, descriptionsToDelete: [..._descriptionsToDelete, locale] };
          }
          return { ...obj, descriptionsToSet: { ...obj.descriptionsToSet, [locale]: value } };
        }, {});

        // Save locales with value
        const { items, warnings } = await multilanguage.setManyByKey(
          descriptionKey,
          descriptionsToSet,
          {
            transacting,
          }
        );

        // Delete empty locales (if requested)
        if (deleteEmpty && descriptionsToDelete.length) {
          await multilanguage.deleteMany(
            descriptionsToDelete.map((locale) => [descriptionKey, locale]),
            { transacting }
          );
        }

        if (warnings?.nonExistingLocales) {
          missingLocales = warnings.nonExistingLocales;
        }

        return {
          descriptions: items,
          warnings: missingLocales.length ? { missingLocales } : null,
        };
      } catch (e) {
        throw new Error("the translated descriptions can't be saved");
      }
    },
    levels,
    t
  );
