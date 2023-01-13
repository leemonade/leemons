const leebrary = require('../leebrary');

module.exports = async function addCategory(
  {
    order,
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
      order,
      key: role,
      creatable: Boolean(creatable && createUrl),
      duplicable: true,
      createUrl,
      provider,
      menu,

      componentOwner,
      listCardComponent,
      detailComponent,
    },
    { transacting }
  );
};
