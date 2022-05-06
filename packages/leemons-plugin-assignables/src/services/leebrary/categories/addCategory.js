const leebrary = require('../leebrary');

module.exports = async function addCategory(
  { role, label, creatable, createUrl, provider = 'leebrary-assignables' },
  { transacting }
) {
  return leebrary().categories.add(
    {
      key: role,
      creatable: creatable && createUrl,
      duplicable: true,
      createUrl,
      provider,
      menu: {
        item: {
          iconSvg: '/test',
          activeIconSvg: '/test',
          label,
        },
        permissions: [],
      },
    },
    { transacting }
  );
};
