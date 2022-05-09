const leebrary = require('../leebrary');

module.exports = async function addCategory(
  {
    role,
    creatable,
    createUrl,
    listCardComponent,
    detailComponent,
    componentOwner,
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

      componentOwner,
      listCardComponent,
      detailComponent,
    },
    { transacting }
  );
};
