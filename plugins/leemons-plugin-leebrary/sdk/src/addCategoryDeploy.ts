import type { Context } from '@leemons/moleculer';
import type { Model } from '@leemons/mongodb';
import { type GetKeyValueModel, hasKey, setKey } from '@leemons/mongodb-helpers';

/**
 * Adds a category deployment to the library system
 * @param params The parameters for category deployment
 * @param params.keyValueModel The key-value model for storing deployment status
 * @param params.category The category data to deploy
 * @param params.ctx The moleculer context
 */
export async function addCategoryDeploy(params: {
  keyValueModel: Model<GetKeyValueModel>;
  category: {
    key: string;
    [key: string]: unknown;
  };
  ctx: Context;
}): Promise<void> {
  const { keyValueModel, category, ctx } = params;

  if (!(await hasKey(keyValueModel, `library-categories-${category.key}`))) {
    await ctx.tx.call('leebrary.categories.add', { data: category });
    await setKey(keyValueModel, `library-categories-${category.key}`);
  }
  await ctx.tx.emit(`init-library-category-${category.key}`);
}
