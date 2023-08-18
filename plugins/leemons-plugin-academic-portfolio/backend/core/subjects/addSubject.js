const _ = require('lodash');
const { validateAddSubject } = require('../../validations/forms');
const { setSubjectCredits } = require('./setSubjectCredits');
const { setSubjectInternalId } = require('./setSubjectInternalId');

async function addSubject({ data: _data, ctx }) {
  await validateAddSubject({ data: _data, ctx });
  const { credits, internalId, image, icon, ...data } = _data;

  let subject = await ctx.tx.db.Subjects.create({ ...data });

  // ES: Añadimos el asset de la imagen
  const imageData = {
    indexable: true,
    public: true, // TODO Cambiar a false despues de hacer la demo
    name: subject.id,
  };
  const iconData = _.clone(imageData);
  if (image) imageData.cover = image;
  if (icon) iconData.cover = icon;
  const [assetImage, assetIcon] = await Promise.all([
    ctx.tx.call('leebrary.assets.add', {
      asset: imageData,
      options: {
        permissions: [
          {
            canEdit: true,
            isCustomPermission: true,
            permissionName: ctx.prefixPN('programs'),
            actionNames: ['update', 'admin'],
          },
        ],
        published: true,
      },
    }),
    ctx.tx.call('leebrary.assets.add', {
      asset: iconData,
      options: {
        permissions: [
          {
            canEdit: true,
            isCustomPermission: true,
            permissionName: ctx.prefixPN('programs'),
            actionNames: ['update', 'admin'],
          },
        ],
        published: true,
      },
    }),
  ]);
  subject = await ctx.tx.db.Subjects.findOneAndUpdate(
    { id: subject.id },
    {
      image: assetImage.id,
      icon: assetIcon.id,
    },
    { new: true }
  );

  // ES: Seteamos los creditos a la asignatura para el programa en el que estamos creando la asignatura
  if (credits) {
    await setSubjectCredits({ subject: subject.id, program: subject.program, credits, ctx });
  }
  if (internalId) {
    await setSubjectInternalId({
      subject: subject.id,
      program: subject.program,
      internalId,
      course: data.course,
      ctx,
    });
  }
  await Promise.all([
    ctx.tx.call('menu-builder.menuItem.enable', { key: ctx.prefixPN('subjects') }),
    ctx.tx.call('menu-builder.menuItem.enable', { key: ctx.prefixPN('tree') }),
  ]);
  return subject;
}

module.exports = { addSubject };
