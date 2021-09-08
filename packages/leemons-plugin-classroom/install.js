const { services } = leemons.plugin;

module.exports = async () => {
  const levelSchema = await services.levelSchemas.add({
    names: {
      en: 'School',
      es: 'colegio',
    },
    properties: {
      editable: false,
      assignable: false,
    },
  });

  const school = await services.levels.add({
    names: {
      en: 'SoB School',
      es: 'Colegio los HDP',
    },
    descriptions: {
      en: 'SoB Shool',
      es: 'Colegio los HDP',
    },
    schema: levelSchema.id,
    properties: {
      editable: false,
    },
  });
};
