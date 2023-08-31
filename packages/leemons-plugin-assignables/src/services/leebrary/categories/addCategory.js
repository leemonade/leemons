const leebrary = require('../leebrary');

function getOrder(order) {
  const assignablesOrder = 200;
  if (order < 100) {
    return assignablesOrder + order;
  }
  if (order) {
    const hundreds = Math.floor(assignablesOrder / 100);
    return assignablesOrder + (order % (hundreds * 100));
  }
  return assignablesOrder + 99;
}

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
  { transacting } = {}
) {
  return leebrary().categories.add(
    {
      order: getOrder(order),
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
