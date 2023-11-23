const glob = require('glob').sync;
const path = require('path');
const { parseServiceFile } = require('./lib/services');

const { findControllers, prepareControllerFile } = require('./lib/controllers');
const { prepareOpenapiFile } = require('./lib/openapi');

function createOpenapiFiles(startPath) {
  try {
    const serviceDirs = glob(`${startPath}/**/services/rest`, { realPath: true }).filter(
      (el) => !el.includes('node_modules')
    );

    serviceDirs.forEach((_dir) => {
      const dir = _dir.replace('/rest', '');
      const grandparentDir = path.dirname(path.dirname(dir));
      const plugin = path.basename(grandparentDir).replace('leemons-plugin-', '');

      const serviceFiles = glob(`${dir}/*.service.js`, { realPath: true });
      serviceFiles.forEach((file) => {
        try {
          const { service, controllerFile } = parseServiceFile(file);

          const controllers = findControllers(controllerFile);
          controllers.forEach((controller) => {
            try {
              prepareControllerFile({
                controllerFilePath: controllerFile,
                service,
                controller,
                ctx: undefined,
              });
            } catch (error) {
              console.warn(error.message);
            }

            prepareOpenapiFile(path.dirname(controllerFile), service, controller, {});
          });
        } catch (error) {
          console.warn(error.message);
        }
      });
    });
  } catch (error) {
    console.error('ERROR:', error);
  }
}

module.exports = { createOpenapiFiles };
