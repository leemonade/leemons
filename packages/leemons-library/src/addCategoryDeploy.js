const { hasKey, setKey } = require('@leemons/mongodb-helpers');

async function addCategoryDeploy({ keyValueModel, category, ctx }) {
  if (!(await hasKey(keyValueModel, `library-categories-${category.key}`))) {
    await ctx.tx.call('leebrary.categories.add', { data: category });
    await setKey(keyValueModel, `library-categories-${category.key}`);
  }
  ctx.tx.emit(`init-library-category-${category.key}`);
}

module.exports = { addCategoryDeploy };
