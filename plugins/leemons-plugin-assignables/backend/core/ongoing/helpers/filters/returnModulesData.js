const { map, uniq } = require('lodash');

async function returnModulesData({ paginatedData, filters }) {
  if (!filters?.modulesData) {
    return { ...paginatedData, items: uniq(map(paginatedData.items, 'id')) };
  }

  return {
    ...paginatedData,
    items: map(paginatedData.items, 'id'),
    modulesData: Object.fromEntries(
      paginatedData.items
        .map((instance) => {
          if (instance.type !== 'module') {
            return null;
          }

          return [
            instance.id,
            {
              activitiesCount: instance.activities?.length,
              activitiesIds: map(instance.activities, 'id'),
            },
          ];
        })
        .filter(Boolean)
    ),
  };
}

module.exports = { returnModulesData };
