module.exports = function entitiesFormat(entitiesObj) {
  try {
    // Validate entities
    let [entityTypes, entities] = Object.entries(entitiesObj)
      .map(([entityType, entity]) => {
        const uuidRegex = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/gi;
        // Validate entityType is a string
        if (typeof entityType !== 'string' || entityType.length === 0) {
          throw new Error('EntityType must be a string');
        }

        // Validate entity is a uuid v4
        if (!uuidRegex.test(entity)) {
          throw new Error('Entity must be a uuid');
        }

        return { entity, entityType };
      })
      // Sort in alphabetical order (so always the same order)
      .sort(({ entityType: a }, { entityType: b }) => a.localeCompare(b))
      // Separate entityTypes and entities into two arrays
      .reduce(
        // eslint-disable-next-line no-shadow
        ([entityTypes, entities], { entityType, entity }) => {
          entityTypes.push(entityType);
          entities.push(entity);
          return [entityTypes, entities];
        },
        [[], []]
      );

    // Verify that entities exists
    if (entityTypes.length === 0) {
      throw new Error('No entities');
    }

    // Stringify entityTypes and entities
    entityTypes = entityTypes.join(',');
    entities = entities.join(',');

    return { entityTypes, entities };
  } catch (e) {
    e.message = `Error parsing entities ${e.message}`;
    throw e;
  }
};
