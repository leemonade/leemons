const fs = require('fs');
const path = require('path');
const os = require('os');

const { readFile } = require('./files');

/**
 * Builds the file path
 * @param {Array} components - The components of the action name
 * @returns {string} The file path
 */
function buildServicePath({ plugin, service }) {
  return path.join(
    '..',
    '..',
    'plugins',
    `leemons-plugin-${plugin}`,
    'backend',
    'services',
    `${service}.service.js`
  );
}

/**
 * Finds the service file in the given directory.
 * @param {string} directoryPath - The path of the directory.
 * @param {string} service - The service to find.
 * @returns {string|null} The path of the service file or null if not found.
 */
function findServiceFile(directoryPath, service) {
  const files = fs.readdirSync(directoryPath);

  const serviceFiles = files.filter((file) => file.endsWith('.service.js'));

  for (let i = 0; i < serviceFiles.length; i++) {
    const serviceFilePath = path.join(directoryPath, serviceFiles[i]);
    const fileContent = readFile(serviceFilePath);
    const regex = /name:\s*['"`](?:[^'"`]*\.)?([^'"`]*)['"`]/;
    const match = fileContent.match(regex);

    const serviceNameInFile = match ? match[1] : null;

    if (serviceNameInFile === service) {
      return serviceFilePath;
    }
  }

  return null;
}

function parseServiceFile(file) {
  const serviceFileContent = fs.readFileSync(file, 'utf8');
  const serviceNameMatch = serviceFileContent.match(/name:\s*['"`](?:[^'"`]*\.)?([^'"`]*)['"`]/);
  const service = serviceNameMatch ? serviceNameMatch[1] : null;

  const lines = serviceFileContent.split(os.EOL);
  const importLine = lines.find(
    (line) => line.includes(`require('./`) && line.endsWith(`.rest');`)
  );

  const match = importLine?.match(/require\('(.*)'\)/);

  if (!match || !match[1]) {
    throw new Error(`Openapi: service in ${file} has not REST actions`);
  }
  const controllerFile = path.resolve(path.dirname(file), `${match[1]}.js`);

  return { service, controllerFile };
}

module.exports = {
  buildServicePath,
  findServiceFile,
  parseServiceFile,
};
