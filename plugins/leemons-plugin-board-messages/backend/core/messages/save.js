const _ = require('lodash');
const { validateSaveMessage } = require('../../validations/forms');
const { table } = require('../tables');
const { byIds } = require('./byIds');
const { calculeStatusFromDates } = require('./calculeStatusFromDates');
const { getOverlapsWithOtherConfigurations } = require('./getOverlapsWithOtherConfigurations');

async function save(_data, { userSession, transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      await validateSaveMessage(_data, { transacting });
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
        const overlaps = await getOverlapsWithOtherConfigurations(
          { ..._data, startDate, endDate },
          { transacting }
        );

        if (overlaps.length) {
          if (_.isBoolean(unpublishConflicts)) {
            if (unpublishConflicts) {
              await table.messageConfig.updateMany(
                { id_$in: _.map(overlaps, 'id') },
                { status: 'unpublished' },
                { transacting }
              );
            } else {
              data.status = 'unpublished';
            }
          } else {
            throw new Error('Has overlaps');
          }
        } else {
          data.status = calculeStatusFromDates(startDate, endDate);
        }
      }

      let item = null;

      if (id) {
        item = await table.messageConfig.findOne({ id }, { transacting });

        if (item.userOwner !== userSession.id) {
          throw new Error('Only the owner can update');
        }

        // Si hay id borramos todas las relaciones de centros/perfiles/classes/programas por que las vamos a crear de nuevo.
        await Promise.all([
          table.messageConfigCenters.deleteMany({ messageConfig: id }, { transacting }),
          table.messageConfigClasses.deleteMany({ messageConfig: id }, { transacting }),
          table.messageConfigProfiles.deleteMany({ messageConfig: id }, { transacting }),
          table.messageConfigPrograms.deleteMany({ messageConfig: id }, { transacting }),
        ]);
        await table.messageConfig.update({ id }, { ...data, startDate, endDate }, { transacting });
      } else {
        item = await table.messageConfig.create(
          {
            ...data,
            startDate,
            endDate,
            owner: userSession.userAgents[0].id,
            userOwner: userSession.id,
          },
          { transacting }
        );
      }

      // ----- Asset -----
      const imageData = {
        indexable: false,
        public: true, // TODO Cambiar a false despues de hacer la demo
        name: item.id,
      };
      if (asset) imageData.cover = asset;
      const assetService = leemons.getPlugin('leebrary').services.assets;
      const assetImage = await assetService.add(imageData, {
        published: true,
        userSession,
        transacting,
      });
      await table.messageConfig.update(
        { id: item.id },
        {
          asset: assetImage.id,
        },
        { transacting }
      );

      const promises = [];

      // ----- Centers -----
      if (centers?.length) {
        _.forEach(centers, (center) => {
          promises.push(
            table.messageConfigCenters.create({ messageConfig: item.id, center }, { transacting })
          );
        });
      } else {
        promises.push(
          table.messageConfigCenters.create(
            { messageConfig: item.id, center: '*' },
            { transacting }
          )
        );
      }
      // ----- Profiles -----
      if (profiles?.length) {
        _.forEach(profiles, (profile) => {
          promises.push(
            table.messageConfigProfiles.create({ messageConfig: item.id, profile }, { transacting })
          );
        });
      } else {
        promises.push(
          table.messageConfigProfiles.create(
            { messageConfig: item.id, profile: '*' },
            { transacting }
          )
        );
      }
      // ----- Classes -----
      if (classes?.length) {
        _.forEach(classes, (classe) => {
          promises.push(
            table.messageConfigClasses.create(
              { messageConfig: item.id, class: classe },
              { transacting }
            )
          );
        });
      } else {
        promises.push(
          table.messageConfigClasses.create({ messageConfig: item.id, class: '*' }, { transacting })
        );
      }
      // ----- Program -----
      if (programs?.length) {
        _.forEach(programs, (program) => {
          promises.push(
            table.messageConfigPrograms.create({ messageConfig: item.id, program }, { transacting })
          );
        });
      } else {
        promises.push(
          table.messageConfigPrograms.create(
            { messageConfig: item.id, program: '*' },
            { transacting }
          )
        );
      }

      await Promise.all(promises);

      return (await byIds(item.id, { userSession, transacting }))[0];
    },
    table.messageConfig,
    _transacting
  );
}

module.exports = { save };
