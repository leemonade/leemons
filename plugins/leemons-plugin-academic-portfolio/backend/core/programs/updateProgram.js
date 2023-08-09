const { programsByIds } = require('./programsByIds');
const { validateUpdateProgram } = require('../../validations/forms');
const { saveManagers } = require('../managers/saveManagers');

async function updateProgram({ data, ctx }) {
  validateUpdateProgram(data);

  const { id, image, managers, ...programData } = data;

  let [program] = await Promise.all([
    ctx.tx.db.Programs.findOneAndUpdate({ id }, programData, { new: true }),
    saveManagers({ userAgents: managers, type: 'program', relationship: id, ctx }),
  ]);

  const imageData = {
    indexable: false,
    public: true, // TODO Cambiar a false despues de hacer la demo
    name: program.id,
  };
  if (image) imageData.cover = image;
  // const assetService = leemons.getPlugin('leebrary').services.assets;
  // const assetImage = await assetService.update(
  //   { id: program.image, ...imageData },
  //   {
  //     published: true,
  //     userSession,
  //     transacting,
  //   }
  // );
  const assetImage = await ctx.tx.call('leebrary.assets.update', {
    data: { id: program.image, ...imageData },
    published: true,
  });

  program = await ctx.tx.db.Programs.update(
    { id: program.id },
    {
      image: assetImage.id,
      imageUrl: await ctx.tx.call('leebrary.assets.getCoverUrl', { assetId: assetImage.id }),
    }
  );

  const _program = (await programsByIds({ ids: [program.id], ctx }))[0];
  await ctx.tx.emit('after-update-program', { program: _program });
  return _program;
}

module.exports = { updateProgram };
