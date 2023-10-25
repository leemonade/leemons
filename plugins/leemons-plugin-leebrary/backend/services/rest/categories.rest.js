/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsMiddlewareAuthenticated } = require('@leemons/middlewares');
const { uniq } = require('lodash');

const { add } = require('../../core/categories/add');
const { listWithMenuItem } = require('../../core/categories/listWithMenuItem');
const { getByCategory } = require('../../core/assets/getByCategory');
const { getTypesByAssets } = require('../../core/files/getTypesByAssets');
const { exists } = require('../../core/categories/exists');
const { list } = require('../../core/categories/list');
const { remove } = require('../../core/categories/remove');

/** @type {ServiceSchema} */
module.exports = {
  listWithMenuItemRest: {
    rest: {
      path: '/menu-list',
      method: 'GET',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const { page, size } = ctx.params;
      const categories = await listWithMenuItem({ page, size, ctx });
      return { status: 200, categories };
    },
  },
  assetTypesRest: {
    rest: {
      path: '/:id/types',
      method: 'GET',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const { id } = ctx.params;
      const assets = (await getByCategory({ categoryId: id, ctx })).map((item) => item.id);
      const types = await getTypesByAssets({ assetIds: assets, ctx });
      return { status: 200, types: uniq(types) };
    },
  },
  addRest: {
    rest: {
      method: 'POST',
      path: '', // No hay ruta en leemons-legacy
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const category = await add({ data: ctx.params, ctx });
      return { status: 200, category };
    },
  },
  existsRest: {
    rest: {
      method: 'GET',
      path: '', // No hay ruta en leemons-legacy
    },
    async handler(ctx) {
      const { key } = ctx.params;
      const result = await exists({ categoryData: { key }, ctx });
      return { status: 200, exists: result };
    },
  },
  listRest: {
    rest: {
      method: 'GET',
      path: '', // No hay ruta en leemons-legacy
    },
    async handler(ctx) {
      const { page, size } = ctx.params;
      const result = await list({ page, size, ctx });
      return { status: 200, ...result };
    },
  },
  removeRest: {
    rest: {
      method: 'DELETE',
      path: '', // No hay ruta en leemons-legacy
    },
    async handler(ctx) {
      const { key } = ctx.params;
      const deleted = await remove({ category: { key }, ctx });
      return { status: 200, deleted };
    },
  },
};
