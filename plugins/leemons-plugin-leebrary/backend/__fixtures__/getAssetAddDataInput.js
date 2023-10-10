module.exports = function getAssetAddDataInput() {
  const categoryId = 'lrn:segment1:segment2:segment3:segment4:segment5:segment6';
  return {
    dataInput: {
      name: 'Tecnología de aprendizaje colaborativo para pedagogías activas',
      tagline: 'Leemons website',
      description:
        'La única herramienta que da soporte a las metodologías de enseñanza más exitosas: Aprendizaje por proyectos, Role Playing, Cooperativo, Flipped Classroom, Design Thinking…',
      color: '#993333',
      url: 'https://www.leemons.io/',
      program: 'edabdea5-d16f-4681-8753-f6740caaf342',
      subjects: [
        {
          subject: 'db172925-237a-44a1-9dcf-4e4ceb7976cb',
          level: 'beginner',
        },
      ],
      icon: 'https://uploads-ssl.webflow.com/63d7ab145d360ca1dd2d418f/63da71ec56119768e6afc9b8_Favicon.png',
      category: {
        id: categoryId,
        key: 'bookmarks',
        pluginOwner: 'leebrary',
        creatable: 1,
        createUrl: null,
        duplicable: 1,
        provider: 'leebrary',
        componentOwner: 'leebrary',
        listCardComponent: null,
        listItemComponent: null,
        detailComponent: null,
        canUse: '*',
        order: 2,
        deleted: 0,
      },
      categoryId,
      tags: ['Leemons'],
    },
    dataInputWithEmptyFields: {
      name: null,
      color: '#993333',
      url: 'https://www.leemons.io/',
      program: null,
      subjects: null,
      icon: null,
      categoryId,
      tags: ['Leemons'],
      categoryKey: 'bookmarks',
      category: {
        id: categoryId,
        key: 'bookmarks',
        pluginOwner: 'leebrary',
        creatable: 1,
        createUrl: null,
        duplicable: 1,
        provider: 'leebrary',
        componentOwner: 'leebrary',
        listCardComponent: null,
        listItemComponent: null,
        detailComponent: null,
        canUse: '*',
        order: 2,
        deleted: 0,
      },
    },
    cover:
      'https://uploads-ssl.webflow.com/63d7ab145d360ca1dd2d418f/63da71ec56119768e6afc9b8_Favicon.png',
  };
};
