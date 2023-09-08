module.exports = function getAssetUpdateDataInput() {
  const initialData = {
    name: 'Imagen masaje',
    tagline:
      'Este texto es el subtitulo de una imagen que se puede describir como una persona estirada en una camilla ',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Es el texto que se usa habitualmente en diseño gráfico en demostraciones de tipografías o de borradores de diseño para probar el diseño visual antes de insertar el texto final.',
    color: '#444ccc',
    url: null,
    program: '584191ed-1744-431e-81e1-64b4bd9bcd36',
    subjects: [
      {
        id: 'un id',
        asset: 'e893231b-6516-4455-b724-232df69834d9@1.0.0',
        subject: '16a7190b-7c9b-475a-82fe-d78b5a54ebf1',
        level: 'lowerIntermediate',
        deleted: 0,
      },
    ],
    id: 'e893231b-6516-4455-b724-232df69834d9@1.0.0',
    category: {
      id: '13ce91bb-9135-49d9-9030-9d2559c74198',
      key: 'media-files',
      pluginOwner: 'plugins.leebrary',
      creatable: 1,
      createUrl: null,
      duplicable: 1,
      provider: 'leebrary',
      componentOwner: 'plugins.leebrary',
      listCardComponent: null,
      listItemComponent: null,
      detailComponent: null,
      canUse: '*',
      order: 1,
      deleted: 0,
    },
    categoryId: '13ce91bb-9135-49d9-9030-9d2559c74198',
    cover: '27f05776-2058-4324-97e8-759c32650805',
    file: '27f05776-2058-4324-97e8-759c32650805',
    tags: ['Usabilidad', 'Masaje', 'Design'],
    categoryKey: 'media-files',
  };

  return {
    initialData,
    preparedInitalData: {
      ...initialData,
      subjects: [{ subject: '16a7190b-7c9b-475a-82fe-d78b5a54ebf1', level: 'lowerIntermediate' }],
    },
  };
};
