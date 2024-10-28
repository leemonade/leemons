/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsError } = require('@leemons/error');
const { LeemonsMiddlewareAuthenticated } = require('@leemons/middlewares');
const got = require('got');
const _ = require('lodash');

const { duplicate } = require('../../core/assets/duplicate');
const { getByFile } = require('../../core/assets/files/getByFile');
const { getByIds } = require('../../core/assets/getByIds');
const { getByUser } = require('../../core/assets/getByUser');
const { prepareAsset } = require('../../core/assets/prepareAsset');
const { remove } = require('../../core/assets/remove');
const { setAsset } = require('../../core/assets/set');
const { getByAsset: getPermissions } = require('../../core/permissions/getByAsset');
const { getUsersByAsset } = require('../../core/permissions/getUsersByAsset');
const canAssignRole = require('../../core/permissions/helpers/canAssignRole');
const { add: addPin } = require('../../core/pins/add');
const { getByUser: getPinsByUser } = require('../../core/pins/getByUser');
const { removeByAsset: removePin } = require('../../core/pins/removeByAsset');
const { search: getByCriteria, list } = require('../../core/search');
const { metascraper } = require('../../core/shared');

/** @type {ServiceSchema} */
module.exports = {
  addRest: {
    rest: {
      path: '/',
      method: 'POST',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const asset = await setAsset({ ...ctx.params, ctx });
      return { status: 200, asset };
    },
  },
  updateRest: {
    rest: {
      path: '/:id',
      method: 'PUT',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const asset = await setAsset({ ...ctx.params, ctx });
      return { status: 200, asset };
    },
  },
  removeRest: {
    rest: {
      path: '/:id',
      method: 'DELETE',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const { id } = ctx.params;
      const deleted = await remove({ id, ctx });
      return { status: 200, deleted };
    },
  },
  duplicateRest: {
    rest: {
      path: '/:id',
      method: 'POST',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const { id: assetId, preserveName, indexable, public: isPublic } = ctx.params;

      const asset = await duplicate({
        assetId,
        preserveName,
        indexable,
        public: isPublic,
        ctx: { ...ctx, callerPlugin: ctx.prefixPN('') },
      });
      const finalAsset = await prepareAsset({ rawAsset: asset, ctx });

      return { status: 200, asset: finalAsset };
    },
  },
  myRest: {
    rest: {
      path: '/my',
      method: 'GET',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const assets = await getByUser({ userId: ctx.meta.userSession.id, ctx });
      return { status: 200, assets };
    },
  },
  getRest: {
    rest: {
      path: '/:id',
      method: 'GET',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      // Use showPublic=true as a query param to retrieve both public or private assets.
      const { id: assetId, showPublic } = ctx.params;
      const parsedShowPublic = showPublic ? JSON.parse(showPublic) : false;
      const [asset] = await getByIds({
        ids: assetId,
        withFiles: true,
        checkPermissions: true,
        showPublic: parsedShowPublic,
        ctx,
      });

      if (!asset) {
        throw new LeemonsError(ctx, { message: 'Asset not found', httpStatusCode: 400 });
      }

      const { role: assignerRole, permissions } = await getPermissions({ assetId, ctx });

      if (!permissions?.view) {
        throw new LeemonsError(ctx, {
          message: 'Unauthorized to view this asset',
          httpStatusCode: 401,
        });
      }

      let assetPermissions = false;

      if (permissions?.edit) {
        assetPermissions = await getUsersByAsset({ assetId, ctx });
        assetPermissions = assetPermissions.map((user) => {
          const item = { ...user };
          item.editable = canAssignRole({
            userRole: assignerRole,
            assignedUserCurrentRole: item.permissions[0],
            newRole: item.permissions[0],
          });
          return item;
        });
      }

      return {
        status: 200,
        asset: { ...asset, canAccess: assetPermissions },
      };
    },
  },
  listRest: {
    rest: {
      path: '/list',
      method: 'GET',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const {
        category,
        criteria,
        type,
        published,
        preferCurrent,
        showPublic,
        searchInProvider,
        roles,
        providerQuery,
        programs,
        subjects,
        onlyShared,
        categoryFilter,
        categoriesFilter,
        hideCoverAssets,
        useCache,
        addons,
      } = ctx.params;

      const assets = await list({
        category,
        criteria,
        type,
        published,
        preferCurrent,
        showPublic,
        searchInProvider,
        roles,
        providerQuery,
        programs,
        subjects,
        onlyShared,
        categoryFilter,
        categoriesFilter,
        hideCoverAssets,

        indexable: true,

        ctx,
        useCache,
        addons,
      });

      return {
        status: 200,
        assets,
      };
    },
  },
  listByIdsRest: {
    rest: {
      path: '/list',
      method: 'POST',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const {
        assets: assetIds,
        filters: { published, showPublic, indexable = true, onlyPinned },
      } = ctx.params;

      if (_.isEmpty(assetIds)) {
        throw new LeemonsError(ctx, { message: 'No assets were specified' });
      }

      let assets = await getByIds({
        ids: assetIds,
        withFiles: true,
        checkPermissions: true,
        indexable,
        showPublic,
        published, // not used within getByIds()
        ctx,
      });

      if (onlyPinned) {
        assets = assets.filter((asset) => asset.pinned);
      }

      const processSingnedUrlsPromises = assets.map((asset) =>
        prepareAsset({ rawAsset: asset, isPublished: published, ctx })
      );
      try {
        const results = await Promise.allSettled(processSingnedUrlsPromises);
        const finalAssets = results
          .filter((result) => result.status === 'fulfilled')
          .map((result) => result.value);
        // final assets are being filtered by the result of each promise
        return {
          status: 200,
          assets: finalAssets,
        };
      } catch (error) {
        throw new LeemonsError(ctx, {
          httpStatusCode: 500,
          message: `Error preparing final assets: ${error}`,
        });
      }
    },
  },
  urlMetadataRest: {
    rest: {
      path: '/url-metadata',
      method: 'GET',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const { url } = ctx.params;
      if (_.isEmpty(url)) {
        throw new LeemonsError(ctx, { message: 'Url is required', httpStatusCode: 400 });
      }
      let metas = {};
      try {
        const response = await got(url);
        const { body: html } = response;
        metas = await metascraper({ html, url });
      } catch (e) {
        ctx.logger.error(e);
        throw new LeemonsError(ctx, {
          message: `Error getting URL metadata: ${url}`,
          customCode: 'URL_METADATA_ERROR',
        });
      }

      return { status: 200, metas };
    },
  },
  addPinRest: {
    rest: {
      path: '/pins',
      method: 'POST',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const { asset: assetId } = ctx.params;
      if (!assetId || _.isEmpty(assetId)) {
        throw new LeemonsError(ctx, { message: 'Asset id is required', httpStatusCode: 400 });
      }
      const pin = await addPin({ assetId, ctx });
      return { status: 200, pin };
    },
  },
  removePinRest: {
    rest: {
      path: '/pins/:id',
      method: 'DELETE',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const { id: assetId } = ctx.params;
      const pin = await removePin({ assetId, ctx });
      return { status: 200, pin };
    },
  },
  pinsRest: {
    rest: {
      path: '/pins',
      method: 'GET',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const {
        criteria,
        type,
        published,
        preferCurrent,
        showPublic,
        providerQuery,
        categoryFilter,
        category,
      } = ctx.params;

      const _providerQuery = JSON.parse(providerQuery || null);
      const _category = category || categoryFilter === 'undefined' ? null : categoryFilter;
      const publishedStatus =
        published === 'all' ? published : ['true', true, '1', 1, 'published'].includes(published);
      const displayPublic = ['true', true, '1', 1].includes(showPublic);
      const _preferCurrent = ['true', true, '1', 1].includes(preferCurrent);

      const assets = await getByCriteria({
        criteria,
        category: _category,
        type,
        pinned: true,
        indexable: true,
        published: publishedStatus,
        showPublic: displayPublic,
        preferCurrent: _preferCurrent,
        providerQuery: _providerQuery,
        ctx,
      });

      return {
        status: 200,
        assets,
      };
    },
  },
  hasPinsRest: {
    rest: {
      path: '/has-pins',
      method: 'GET',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const pins = await getPinsByUser({ ctx });
      return {
        status: 200,
        hasPins: pins.length > 0,
      };
    },
  },
  getByFileRest: {
    rest: {
      path: '/by-file/:fileId',
      method: 'GET',
    },
    params: {
      fileId: { type: 'string' },
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const { fileId } = ctx.params;
      const assetId = await getByFile({ fileId, ctx });
      if (!assetId) {
        throw new LeemonsError(ctx, { message: 'Asset not found', httpStatusCode: 404 });
      }
      const [asset] = await getByIds({
        ids: assetId,
        ctx,
        withTags: true,
        withFiles: true,
        withCategory: true,
        checkPermissions: true,
      });
      return {
        status: 200,
        data: asset,
      };
    },
  },
};
