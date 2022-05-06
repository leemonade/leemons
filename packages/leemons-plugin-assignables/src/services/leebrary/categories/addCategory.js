const leebrary = require('../leebrary');

module.exports = async function addCategory(
  {
    role,
    creatable,
    createUrl,
    listCardComponent,
    detailComponent,
    menu,
    provider = 'leebrary-assignables',
  },
  { transacting }
) {
  return leebrary().categories.add(
    {
      key: role,
      creatable: Boolean(creatable && createUrl),
      duplicable: true,
      createUrl,
      provider,
      menu: menu || {
        item: {
          iconSvg: '/test',
          activeIconSvg: '/test',
          label: {
            en: 'tasks',
            es: 'tareas',
          },
        },
        permissions: [],
      },

      componentOwner: 'plugins.tasks',
      listCardComponent,
      detailComponent,
    },
    { transacting }
  );
};
