const _ = require('lodash');
const { table } = require('../tables');
const { validateAddSubject } = require('../../validations/forms');
const { setSubjectCredits } = require('./setSubjectCredits');
const { setSubjectInternalId } = require('./setSubjectInternalId');
const enableMenuItemService = require('../menu-builder/enableItem');

async function addSubject(_data, { userSession, transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      await validateAddSubject(_data, { transacting });
      const { credits, internalId, image, icon, ...data } = _data;

      let subject = await table.subjects.create({ ...data }, { transacting });

      // ES: Añadimos el asset de la imagen
      const imageData = {
        indexable: true,
        public: true, // TODO Cambiar a false despues de hacer la demo
        name: subject.id,
      };
      const iconData = _.clone(imageData);
      if (image) imageData.cover = image;
      if (icon) iconData.cover = icon;
      const assetService = leemons.getPlugin('leebrary').services.assets;
      const [assetImage, assetIcon] = await Promise.all([
        assetService.add(imageData, {
          permissions: [
            {
              canEdit: true,
              isCustomPermission: true,
              permissionName: leemons.plugin.prefixPN('programs'),
              actionNames: ['update', 'admin'],
            },
          ],
          published: true,
          userSession,
          transacting,
        }),
        assetService.add(iconData, {
          permissions: [
            {
              canEdit: true,
              isCustomPermission: true,
              permissionName: leemons.plugin.prefixPN('programs'),
              actionNames: ['update', 'admin'],
            },
          ],
          published: true,
          userSession,
          transacting,
        }),
      ]);
      subject = await table.subjects.update(
        { id: subject.id },
        {
          image: assetImage.id,
          icon: assetIcon.id,
        },
        { transacting }
      );

      // ES: Seteamos los creditos a la asignatura para el programa en el que estamos creando la asignatura
      if (credits) {
        await setSubjectCredits(subject.id, subject.program, credits, { transacting });
      }
      if (internalId) {
        await setSubjectInternalId(subject.id, subject.program, internalId, {
          course: data.course,
          transacting,
        });
      }
      await Promise.all([enableMenuItemService('subjects'), enableMenuItemService('tree')]);
      return subject;
    },
    table.subjects,
    _transacting
  );
}

module.exports = { addSubject };
