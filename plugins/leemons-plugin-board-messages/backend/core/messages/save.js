const _ = require('lodash');
const { LeemonsError } = require('@leemons/error');
const { validateSaveMessage } = require('../../validations/forms');
const { byIds } = require('./byIds');
const { calculeStatusFromDates } = require('./calculeStatusFromDates');
const { getOverlapsWithOtherConfigurations } = require('./getOverlapsWithOtherConfigurations');

async function save({ data: _data, ctx }) {
  const { userSession } = ctx.meta;
  await validateSaveMessage(_data);
  // eslint-disable-next-line prefer-const
  let {
    id,
    unpublishConflicts,
    asset,
    centers,
    profiles,
    classes,
    programs,
    startDate,
    endDate,
    ...data
  } = _data;

  if (!startDate || data.publicationType === 'immediately') {
    startDate = new Date();
  }
  if (!endDate || data.publicationType === 'immediately') {
    endDate = new Date('01/01/9999');
  }

  startDate = new Date(startDate);
  endDate = new Date(endDate);

  if (!['archived', 'unpublished'].includes(data.status)) {
    const overlaps = await getOverlapsWithOtherConfigurations({
      item: { ..._data, startDate, endDate },
      ctx,
    });

    if (overlaps.length) {
      if (_.isBoolean(unpublishConflicts)) {
        if (unpublishConflicts) {
          await ctx.tx.db.MessageConfig.updateMany(
            { id: _.map(overlaps, 'id') },
            { status: 'unpublished' }
          );
        } else {
          data.status = 'unpublished';
        }
      } else {
        throw new LeemonsError(ctx, { message: 'Has overlaps' });
      }
    } else {
      data.status = calculeStatusFromDates(startDate, endDate);
    }
  }

  let item = null;

  if (id) {
    item = await ctx.tx.db.MessageConfig.findOne({ id }).lean();

    if (item.userOwner !== userSession.id) {
      throw new LeemonsError(ctx, { message: 'Only the owner can update' });
    }

    // Si hay id borramos todas las relaciones de centros/perfiles/classes/programas por que las vamos a crear de nuevo.
    await Promise.all([
      ctx.tx.db.MessageConfigCenters.deleteMany({ messageConfig: id }),
      ctx.tx.db.MessageConfigClasses.deleteMany({ messageConfig: id }),
      ctx.tx.db.MessageConfigProfiles.deleteMany({ messageConfig: id }),
      ctx.tx.db.MessageConfigPrograms.deleteMany({ messageConfig: id }),
    ]);
    await ctx.tx.db.MessageConfig.updateOne({ id }, { ...data, startDate, endDate });
  } else {
    item = await ctx.tx.db.MessageConfig.create({
      ...data,
      startDate,
      endDate,
      owner: userSession.userAgents[0].id,
      userOwner: userSession.id,
    });
    item = item.toObject();
  }

  // ----- Asset -----
  const imageData = {
    indexable: false,
    public: true, // TODO Cambiar a false despues de hacer la demo
    name: item.id,
  };
  if (asset) imageData.cover = asset;
  const assetImage = await ctx.tx.call('leebrary.assets.add', {
    asset: imageData,
    options: { published: true },
  });

  await ctx.tx.db.MessageConfig.updateOne({ id: item.id }, { asset: assetImage.id });

  const promises = [];

  // ----- Centers -----
  if (centers?.length) {
    _.forEach(centers, (center) => {
      promises.push(
        ctx.tx.db.MessageConfigCenters.create({ messageConfig: item.id, center }).then((r) =>
          r.toObject()
        )
      );
    });
  } else {
    promises.push(
      ctx.tx.db.MessageConfigCenters.create({ messageConfig: item.id, center: '*' }).then((r) =>
        r.toObject()
      )
    );
  }
  // ----- Profiles -----
  if (profiles?.length) {
    _.forEach(profiles, (profile) => {
      promises.push(
        ctx.tx.db.MessageConfigProfiles.create({ messageConfig: item.id, profile }).then((r) =>
          r.toObject()
        )
      );
    });
  } else {
    promises.push(
      ctx.tx.db.MessageConfigProfiles.create({ messageConfig: item.id, profile: '*' }).then((r) =>
        r.toObject()
      )
    );
  }
  // ----- Classes -----
  if (classes?.length) {
    _.forEach(classes, (classe) => {
      promises.push(
        ctx.tx.db.MessageConfigClasses.create({ messageConfig: item.id, class: classe }).then((r) =>
          r.toObject()
        )
      );
    });
  } else {
    promises.push(
      ctx.tx.db.MessageConfigClasses.create({ messageConfig: item.id, class: '*' }).then((r) =>
        r.toObject()
      )
    );
  }
  // ----- Program -----
  if (programs?.length) {
    _.forEach(programs, (program) => {
      promises.push(
        ctx.tx.db.MessageConfigPrograms.create({ messageConfig: item.id, program }).then((r) =>
          r.toObject()
        )
      );
    });
  } else {
    promises.push(
      ctx.tx.db.MessageConfigPrograms.create({ messageConfig: item.id, program: '*' }).then((r) =>
        r.toObject()
      )
    );
  }

  await Promise.all(promises);

  return (await byIds({ ids: item.id, ctx }))[0];
}

module.exports = { save };
