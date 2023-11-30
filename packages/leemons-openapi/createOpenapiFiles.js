/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
const glob = require('glob').sync;
const path = require('path');

const { parseServiceFile } = require('./lib/services');
const { findControllers, prepareControllerFile } = require('./lib/controllers');
const { prepareOpenapiFile } = require('./lib/openapi');

async function createOpenapiFiles(startPath) {
  try {
    const serviceDirs = glob(`${startPath}/**/services/rest`, { realPath: true }).filter(
      (el) => !el.includes('node_modules')
    );
    for (const _dir of serviceDirs) {
      const dir = _dir.replace('/rest', '');
      const grandparentDir = path.dirname(path.dirname(dir));
      const plugin = path.basename(grandparentDir);

      const serviceFiles = glob(`${dir}/*.service.js`, { realPath: true });
      for (const file of serviceFiles) {
        try {
          const { service, controllerFile } = parseServiceFile(file);

          const controllers = findControllers(controllerFile);
          let counter = 1;
          for (const controller of controllers) {
            console.log(
              'Creating openapi:',
              `(${plugin}-${service}-${controller})`,
              controllerFile,
              `(${counter}/${controllers.length})`
            );
            try {
              prepareControllerFile({
                controllerFilePath: controllerFile,
                service,
                controller,
                ctx: undefined,
              });
              // eslint-disable-next-line no-await-in-loop
              await prepareOpenapiFile({
                controllerFilePath: controllerFile,
                service,
                controller,
                useAItoCreateOpenapiDoc: true,
              });

              counter++;
            } catch (error) {
              console.warn('\x1b[31m', error.message);
            }
          }
        } catch (error) {
          console.warn('\x1b[31m', error.message);
        }
      }
    }
  } catch (error) {
    console.error('\x1b[31m', 'ERROR:', error);
  }
}

module.exports = { createOpenapiFiles };
