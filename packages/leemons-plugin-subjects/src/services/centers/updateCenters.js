// TODO: Remove centers when a center is deleted
async function updateCenters() {
  const tables = {
    centers: leemons.query('plugins_users::centers'),
    levels: leemons.query('plugins_classroom::levels'),
    levelSchemas: leemons.query('plugins_classroom::levelSchemas'),
  };
  const { levels, levelSchemas } = leemons.plugin.services;
  await tables.levelSchemas.transaction(async (transacting) => {
    let centerLS;
    let center;
    const schools = await tables.centers.find({}, { transacting });
    const alreadySavedSchools = (
      await tables.levels.find({ properties_$contains: 'isCenter: true' })
    ).map((school) => school.properties.schoolId);

    // If it is monoCenter
    if (schools.length === 1) {
      // Create an Organization/center levelSchema
      centerLS = await levelSchemas.add(
        {
          names: {
            en: 'Organization/Center',
            es: 'Organización/Centro',
          },
          properties: {
            editable: false,
            deletable: false,
            isCenterSchema: true,
          },
        },
        { transacting }
      );
      // Create the level outside the if
    } else {
      // If it is multicenter

      // Get the current organization LevelSchema (if exists)
      let organizationLS = await tables.levelSchemas.findOne(
        {
          properties_$contains: 'isOrganizationSchema: true',
        },
        { transacting }
      );
      let organization;

      // And the existing Center LevelSchema (if exists)
      centerLS = await tables.levelSchemas.findOne(
        {
          properties_$contains: 'isCenterSchema: true',
        },
        { transacting }
      );

      // If the Organization LevelSchema does not exists
      if (!organizationLS) {
        // Create the new Organization LS
        organizationLS = await levelSchemas.add(
          {
            names: {
              en: 'Organization',
              es: 'Organización',
            },
            properties: {
              editable: false,
              deletable: false,
              assignable: false,
              isOrganizationSchema: true,
            },
          },
          { transacting }
        );

        // And create the organization level
        organization = await levels.add(
          {
            names: {
              en: 'Platform School Name',
              es: 'Nombre Colegios palataforma',
            },
            descriptions: {
              en: 'Description Platform School',
              es: 'Descripción de la plataforma',
            },
            schema: organizationLS.id,
            properties: {
              editable: false,
              deletable: false,
              isOrganization: true,
            },
          },
          { transacting }
        );

        // Check if a center LevelSchema exists (we came from a monoCenter)
        if (centerLS) {
          // And change the center LevelSChema names
          await levelSchemas.setNames(
            centerLS.id,
            {
              en: 'School',
              es: 'Colegio',
            },
            { transacting }
          );
          // And set the parent to the new organization level
          await levelSchemas.setParent(centerLS.id, organizationLS.id, { transacting });
        } else {
          // IF the center LevelSchema does not exists, just create it
          centerLS = await levelSchemas.add(
            {
              names: {
                en: 'School',
                es: 'Colegio',
              },
              parent: organizationLS.id,
              properties: {
                editable: false,
                deletable: false,
                isCenterSchema: true,
              },
            },
            { transacting }
          );
        }

        // Get the current Center Level (if exists)
        center = await tables.levels.findOne(
          {
            properties_$contains: 'isCenter: true',
          },
          { transacting }
        );

        // And set its parent (if exists) to the organization
        if (center) {
          await levels.setParent(center.id, organization.id, { transacting });
        }
        center = organization;
      }
    }

    // Save all the unsaved schools as levels
    await Promise.all(
      schools
        .filter((school) => !alreadySavedSchools.includes(school.id))
        .map((school) =>
          levels.add(
            {
              names: {
                en: school.name,
                es: school.name,
              },
              parent: center ? center.id : null,
              descriptions: {
                en: school.description,
                es: school.description,
              },
              schema: centerLS.id,
              properties: {
                schoolId: school.id,
                editable: false,
                deletable: false,
                isCenter: true,
              },
            },
            { transacting }
          )
        )
    );
  });
}

module.exports = () => {
  if (this && this.calledFrom !== 'plugins.classroom') {
    throw new Error('Permissions not satisfied');
  }
  let timer;

  const callback = () => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      timer = undefined;
      updateCenters();
    }, 2000);
  };

  leemons.events.once(
    ['plugins.users:didCreateCenter', 'plugins.classroom:pluginDidLoadServices'],
    () => {
      leemons.events.on('plugins.users:didCreateCenter', callback);
      callback();
    }
  );
};
