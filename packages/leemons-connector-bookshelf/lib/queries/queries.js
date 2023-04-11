/* eslint-disable no-use-before-define */
const _ = require('lodash');
const pmap = require('p-map');

const { buildQuery } = require('leemons-utils');
const { parseFilters } = require('leemons-utils');
const randomString = require('leemons-utils/lib/randomString');

const rollbacks = {};

function generateQueries(model /* connector */) {
  const bookshelfModel = model.model;

  const selectAttributes = (attributes) =>
    _.pickBy(attributes, (value, key) => {
      if (key === 'deleted') {
        return model.schema.attributes.deleted !== null || model.schema.allAttributes.includes(key);
      }
      if (key === 'deleted_at') {
        return (
          (model.schema.attributes.deleted !== null && model.schema.options.useTimestamps) ||
          model.schema.allAttributes.includes(key)
        );
      }
      return model.schema.allAttributes.includes(key);
    });

  // Creates one new item
  async function create(newItem, { transacting } = {}) {
    if (!transactingHasError(transacting)) {
      try {
        addPendingTransacting(transacting);
        const attributes = selectAttributes(newItem);
        const result = await bookshelfModel
          .forge(attributes)
          .save(null, { method: 'insert', transacting })
          .then((res) => res.toJSON());
        addToRollbacks(transacting, 'removeOne', result.id);
        lessPendingTransacting(transacting);
        return result;
      } catch (e) {
        lessPendingTransacting(transacting);
        throw e;
      }
    }
    return null;
  }

  // Creates many items in one transaction
  function createMany(newItems, { transacting } = {}) {
    if (!Array.isArray(newItems)) {
      throw new Error(
        `createMany expected an array, instead got ${
          typeof newItems === 'object' ? JSON.stringify(newItems) : newItems
        }`
      );
    }

    // console.log('transacting', transacting);

    if (transacting) {
      return pmap(newItems, (newItem) => create(newItem, { transacting }));
    }

    // If we are not on a transaction, make a new transaction
    return transaction((t) => pmap(newItems, (newItem) => create(newItem, { transacting: t })));
  }

  // Updates one item matching the query
  async function update(query, updatedItem, { debug, transacting } = {}) {
    if (!transactingHasError(transacting)) {
      try {
        addPendingTransacting(transacting);
        const filters = parseFilters({ filters: query, model });
        const newQuery = buildQuery(model, filters);

        const entry = await bookshelfModel.query(newQuery).fetch({ transacting, require: false });

        if (!entry) {
          const err = new Error('entry.notFound');
          err.status = 404;
          throw err;
        }

        if (!_.has(updatedItem, 'updated_at')) {
          _.set(updatedItem, 'updated_at', new Date());
        }
        const attributes = selectAttributes(updatedItem);

        if (Object.keys(attributes).length > 0) {
          const res = await entry.save(attributes, {
            debug,
            method: 'update',
            patch: true,
            transacting,
          });
          addToRollbacks(transacting, 'update', res._previousAttributes);
          lessPendingTransacting(transacting);
          return res.toJSON();
        }
        lessPendingTransacting(transacting);
        return entry.toJSON();
      } catch (e) {
        lessPendingTransacting(transacting);
      }
    }
    return null;
  }

  // Updated many items in one transaction
  async function updateMany(query, updatedItem, { transacting } = {}) {
    if (!transactingHasError(transacting)) {
      try {
        addPendingTransacting(transacting);
        const filters = parseFilters({ filters: query, model });
        const newQuery = buildQuery(model, filters);

        const entry = () => bookshelfModel.query(newQuery);

        if (!_.has(updatedItem, 'updated_at')) {
          _.set(updatedItem, 'updated_at', new Date());
        }

        const attributes = selectAttributes(updatedItem);

        const promises = [entry().count({ transacting })];

        if (_.isString(transacting)) {
          promises.push(find(query, { columns: ['id', ...Object.keys(attributes)] }));
        }

        const [updatedCount, items] = await Promise.all(promises);

        if (updatedCount > 0) {
          try {
            await entry().save(attributes, {
              method: 'update',
              patch: true,
              transacting,
            });
            if (items && items.length) {
              addToRollbacks(transacting, 'updateMany', items);
            }
          } catch (err) {
            if (err.message !== 'EmptyResponse') {
              throw err;
            }
            if (items && items.length) {
              addToRollbacks(transacting, 'updateMany', items);
            }
          }
        }
        lessPendingTransacting(transacting);
        return { count: updatedCount };
      } catch (e) {
        lessPendingTransacting(transacting);
        throw e;
      }
    }
    return null;
  }

  // Deletes one item matching the query
  async function deleteOne(
    query,
    { soft = model.schema.options.softDelete || false, transacting } = {}
  ) {
    if (!transactingHasError(transacting)) {
      try {
        addPendingTransacting(transacting);
        const filters = parseFilters({ filters: { ...query, $limit: 1 }, model });
        const newQuery = buildQuery(model, filters);

        const entry = await bookshelfModel.query(newQuery).fetch({ transacting, require: false });

        if (!entry) {
          const err = new Error('entry.notFound');
          err.status = 404;
          throw err;
        }

        if (soft) {
          const fields = { deleted: true };
          if (model.schema.options.useTimestamps) {
            fields.deleted_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
          }
          const res = await entry.save(fields, { method: 'update', patch: true, transacting });
          addToRollbacks(transacting, 'update', res._previousAttributes);
          lessPendingTransacting(transacting);
          return { deleted: true, soft: true };
        }
        const entryData = entry.toJSON();
        await entry.destroy({ transacting });
        addToRollbacks(transacting, 'create', entryData);
        lessPendingTransacting(transacting);
        return { deleted: true, soft: false };
      } catch (e) {
        lessPendingTransacting(transacting);
        throw e;
      }
    }
    return null;
  }

  // Deletes many items matching the query
  async function deleteMany(
    query,
    { soft = model.schema.options.softDelete || false, transacting } = {}
  ) {
    if (!transactingHasError(transacting)) {
      try {
        addPendingTransacting(transacting);
        const filters = parseFilters({ filters: query, model });
        const newQuery = buildQuery(model, filters);

        const entries = () => bookshelfModel.query(newQuery);

        const promises = [entries().count({ transacting })];

        if (_.isString(transacting)) {
          promises.push(find(query));
        }

        const [deletedCount, items] = await Promise.all(promises);

        try {
          if (deletedCount > 0) {
            if (soft) {
              const fields = { deleted: true };
              if (model.schema.options.useTimestamps) {
                fields.deleted_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
              }

              await entries().save(fields, { method: 'update', patch: true, transacting });
              addToRollbacks(transacting, 'updateMany', items);
            } else {
              try {
                await entries().destroy({ transacting });
                addToRollbacks(transacting, 'createMany', items);
              } catch (err) {
                if (err.message.indexOf('No Rows Deleted') === -1) {
                  throw err;
                }
              }
            }
          }
        } catch (err) {
          if (err.message !== 'EmptyResponse') {
            throw err;
          }
        }
        lessPendingTransacting(transacting);
        return { count: deletedCount, soft };
      } catch (e) {
        lessPendingTransacting(transacting);
        throw e;
      }
    }
    return null;
  }

  // Finds all items based on a query
  function find(query, { columns = '*', related, transacting } = {}) {
    const filters = parseFilters({ filters: query, model });
    const newQuery = buildQuery(model, filters);

    const toJSONConfig = { omitPivot: true };
    if (columns && columns !== '*') {
      toJSONConfig.hidden = [];
    }

    return bookshelfModel
      .query(newQuery)
      .fetchAll({
        columns,
        withRelated: related,
        transacting,
      })
      .then((res) => (res ? res.serialize(toJSONConfig) : res));
  }

  // Finds one item based on a query
  async function findOne(query, ...rest) {
    const entry = await find({ ...query, $limit: 1 }, ...rest);
    return entry[0] || null;
  }

  // Finds how many items exists based on a query
  async function count(query, { columns = ['id'], transacting } = {}) {
    return (await find(query, { columns, transacting })).length;
  }

  // Finds all items based on a query, a limit and an offset (page)
  async function search(query, page = 0, size = 10, { transacting } = {}) {
    if (size < 1) {
      throw new Error('The size should be at least 1');
    }
    if (page < 0) {
      throw new Error('The page should be at least 0');
    }
    const totalCount = await count(query, { transacting });
    const totalPages = Math.floor(totalCount / size);

    if (page > totalPages) {
      return {
        items: [],
        count: 0,
        totalCount,
        page,
        size,
        nextPage: page < totalPages ? page + 1 : null,
        prevPage: page > 0 ? page - 1 : null,
      };
    }

    const items = await find({ ...query, $limit: size, $offset: page * size }, { transacting });
    return {
      items,
      count: items.length,
      totalCount,
      page,
      size,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 0 ? page - 1 : null,
    };
  }

  async function set(query, item, { transacting } = {}) {
    try {
      const filters = parseFilters({ filters: query, model });
      const newQuery = buildQuery(model, filters);
      const entry = await bookshelfModel.query(newQuery).fetch({
        require: false,
        transacting,
      });

      if (entry) {
        return await update(query, item, { transacting });
      }
      return await create({ ...query, ...item }, { transacting });
    } catch (err) {
      if (err.message !== 'EmptyResponse') {
        throw err;
      }
    }

    return null;
  }

  function setMany(newItems, { transacting } = {}) {
    if (!Array.isArray(newItems)) {
      throw new Error(
        `setMany expected an array, instead got ${
          typeof newItems === 'object' ? JSON.stringify(newItems) : newItems
        }`
      );
    }
    if (transacting) {
      return pmap(newItems, (newItem) => set(newItem.query, newItem.item, { transacting }));
    }

    // If we are not on a transaction, make a new transaction
    return transaction((t) =>
      pmap(newItems, (newItem) => set(newItem.query, newItem.item, { transacting: t }))
    );
  }

  async function transaction(f) {
    if (model.config.useCustomRollback) {
      const id = randomString();
      try {
        const result = await f(id);
        finishRollback(id);
        return result;
      } catch (e) {
        if (!transactingHasError()) await rollback(id);
        throw e;
      }
    }

    return model.ORM.transaction(f);
  }

  function finishRollback(transacting) {
    if (_.isString(transacting)) {
      if (rollbacks[transacting]) {
        rollbacks[transacting] = undefined;
        delete rollbacks[transacting];
      }
    }
  }

  async function timeoutPromise(time) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, time);
    });
  }

  async function reTry(func, args, time = 10, n = 0) {
    try {
      return await func(...args);
    } catch (e) {
      const str = `${e.code} ${e.message} ${e.sqlMessage}`;
      if (
        n < 10000 &&
        (str.toLowerCase().indexOf('deadlock') >= 0 ||
          str.toLowerCase().indexOf('timeout') >= 0 ||
          str.toLowerCase().indexOf('ER_CON_COUNT_ERROR') >= 0)
      ) {
        await timeoutPromise(time);
        return reTry(func, args, time, n + 1);
      }
      throw e;
    }
  }

  async function rollback(transacting) {
    if (
      _.isString(transacting) &&
      rollbacks[transacting] &&
      rollbacks[transacting].actions &&
      rollbacks[transacting].actions.length
    ) {
      // Al empezar a hacer rollback marcamos como que hay un error
      rollbacks[transacting].error = true;
      // Solo empezamos a hacer rollback si no quedan acciones pendientes del backend
      if (rollbacks[transacting].pendingActions === 0) {
        const curAction = rollbacks[transacting].actions[rollbacks[transacting].actions.length - 1];
        if (curAction.action === 'removeOne') {
          await curAction.modelActions.delete({ id: curAction.data });
        }
        if (curAction.action === 'update') {
          await curAction.modelActions.update({ id: curAction.data.id }, curAction.data);
        }
        if (curAction.action === 'updateMany') {
          await Promise.all(
            _.map(curAction.data, (item) => curAction.modelActions.update({ id: item.id }, item))
          );
        }
        if (curAction.action === 'create') {
          await curAction.modelActions.create(curAction.data);
        }
        if (curAction.action === 'createMany') {
          await Promise.all(_.map(curAction.data, (item) => curAction.modelActions.create(item)));
        }
        rollbacks[transacting].actions.pop();
        await rollback(transacting);
      } else {
        setTimeout(() => {
          rollback(transacting);
        }, 10);
      }
    }
  }

  const modelActions = {
    create: (...args) => reTry(create, args),
    createMany: (...args) => reTry(createMany, args),
    update: (...args) => reTry(update, args),
    updateMany: (...args) => reTry(updateMany, args),
    delete: (...args) => reTry(deleteOne, args),
    deleteMany: (...args) => reTry(deleteMany, args),
    find: (...args) => reTry(find, args),
    findOne: (...args) => reTry(findOne, args),
    search: (...args) => reTry(search, args),
    count: (...args) => reTry(count, args),
    set: (...args) => reTry(set, args),
    setMany: (...args) => reTry(setMany, args),
    rollback,
    transaction,
  };

  function initRollbackIfNeed(transacting) {
    if (_.isString(transacting)) {
      if (!rollbacks[transacting])
        rollbacks[transacting] = {
          actions: [],
          error: false,
          pendingActions: 0,
        };
    }
  }

  function addToRollbacks(transacting, action, data) {
    if (_.isString(transacting)) {
      initRollbackIfNeed(transacting);
      rollbacks[transacting].actions.push({ action, data, bookshelfModel, modelActions });
    }
  }

  function addPendingTransacting(transacting) {
    if (_.isString(transacting)) {
      initRollbackIfNeed(transacting);
      rollbacks[transacting].pendingActions++;
    }
  }

  function lessPendingTransacting(transacting) {
    if (_.isString(transacting)) {
      initRollbackIfNeed(transacting);
      rollbacks[transacting].pendingActions--;
    }
  }

  function transactingHasError(transacting) {
    if (_.isString(transacting)) {
      initRollbackIfNeed(transacting);
      return rollbacks[transacting].error;
    }
    return false;
  }

  return modelActions;
}

module.exports = generateQueries;
