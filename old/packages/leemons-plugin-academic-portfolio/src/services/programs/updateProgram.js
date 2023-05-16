const { table } = require('../tables');
const { programsByIds } = require('./programsByIds');
const { validateUpdateProgram } = require('../../validations/forms');
const { saveManagers } = require('../managers/saveManagers');

async function updateProgram(data, { userSession, transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      validateUpdateProgram(data);

      const { id, image, managers, ...programData } = data;

      let [program] = await Promise.all([
        table.programs.update({ id }, programData, { transacting }),
        saveManagers(managers, 'program', id, { transacting }),
      ]);

      const imageData = {
        indexable: false,
        public: true, // TODO Cambiar a false despues de hacer la demo
        name: program.id,
      };
      if (image) imageData.cover = image;
      const assetService = leemons.getPlugin('leebrary').services.assets;
      const assetImage = await assetService.update(
        { id: program.image, ...imageData },
        {
          published: true,
          userSession,
          transacting,
        }
      );
      program = await table.programs.update(
        { id: program.id },
        {
          image: assetImage.id,
          imageUrl: assetService.getCoverUrl(assetImage.id),
        },
        { transacting }
      );

      const _program = (await programsByIds([program.id], { userSession, transacting }))[0];
      await leemons.events.emit('after-update-program', { program: _program, transacting });
      return _program;
    },
    table.programCenter,
    _transacting
  );
}

module.exports = { updateProgram };
