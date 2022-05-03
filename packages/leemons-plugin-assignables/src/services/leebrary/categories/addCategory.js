module.exports = async function addCategory(
  { role, label, creatable, createUrl, provider },
  { transacting }
) {
  return leemons.getPlugin('leebrary').services.categories.add(
    {
      key: role,
      creatable: creatable && createUrl,
      duplicable: true,
      createUrl,
      provider: 'leebrary',
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
