const levelSchemas = leemons.query('plugins_classroom::levelSchemas');
const assignableProfiles = leemons.query('plugins_classroom::levelSchemas_profiles');

// TODO: Check that the parent is compatible
module.exports = async function addAssignables(id, _profiles, { transacting } = {}) {
  // ---------------------------------------------------------------------------
  // validate data types
  const schema = {
    type: 'object',
    properties: {
      profiles: {
        type: 'array',
        items: {
          type: 'string',
          format: 'uuid',
        },
      },
      id: {
        type: 'string',
        format: 'uuid',
      },
    },
  };
  const validator = new global.utils.LeemonsValidator(schema);

  if (validator.validate({ id, profiles: _profiles })) {
    const profiles = [...new Set(_profiles)];
    let savedProfiles;

    const exists = await levelSchemas.count({ id }, { transacting });
    if (!exists) {
      throw new Error("The given id can't be found");
    }

    try {
      savedProfiles = await assignableProfiles.setMany(
        profiles.map((profile) => ({
          query: {
            levelSchemas_id: id,
            profiles_id: profile,
          },
        })),
        { transacting }
      );
    } catch (e) {
      if (e.code.includes('ER_NO_REFERENCED_ROW')) {
        throw new Error("One of the profiles can't be found");
      }
      throw new Error("The assignables can't be saved");
    }
    return savedProfiles;
  }
  throw validator.error;
};
