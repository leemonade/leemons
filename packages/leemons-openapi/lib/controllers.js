const os = require('os');
const path = require('path');
const espree = require('espree');
const estraverse = require('estraverse');
const prettier = require('prettier');

const { readFile } = require('./files');
const { writeFile } = require('./files');
const { findServiceFile } = require('./services');
const { prettierOptions } = require('./prettierOptions');

/**
 * Parses the code into an Abstract Syntax Tree (AST)
 * @param {string} code - The code to parse
 * @returns {Object} The AST of the code
 */
function parseCodeToAst(code) {
  return espree.parse(code, { range: true, ecmaVersion: 12, sourceType: 'module' });
}

/**
 * Finds all the controllers in a given file
 * @param {string} controllerFilePath - The path of the controller file
 * @returns {Array} An array of the names of the controllers
 */
function findControllers(controllerFilePath) {
  const code = readFile(controllerFilePath);

  const regex = /(\w+Rest):\s\{/g; // Note the 'g' flag for global search
  return [...code.matchAll(regex)].map((match) => match[1]);
}

/**
 * Searches for the controller property in the AST
 * @param {Object} ast - The AST to search in
 * @param {string} controller - The controller to search for
 * @returns {Object|null} The controller object or null if not found
 */
function searchController(ast, controller) {
  let controllerObj = null;
  estraverse.traverse(ast, {
    enter(node) {
      if (node.type === 'Property' && node.key.name === controller) {
        controllerObj = node;
      }
    },
  });
  return controllerObj;
}

/**
 * Checks if the controller object has an openapi property
 * @param {Object} controllerObj - The controller object
 * @returns {boolean} True if the openapi property exists, false otherwise
 */
function hasOpenApiProperty(controllerObj) {
  return controllerObj.value.properties.some((prop) => prop.key.name === 'openapi');
}

/**
 * Adds a require statement to the code
 * @param {string} code - The code to add the require statement to
 * @param {string} service - The service
 * @param {string} controller - The controller
 * @returns {string} The code with the added require statement
 */
function addRequireStatement(code, service, controller) {
  const requireStatement = `const ${controller} = require('./openapi/${service}/${controller}');`;

  if (!code.includes(requireStatement)) {
    const updatedCode = code.replace(`/** @type {ServiceSchema} */${os.EOL}`, '');

    return updatedCode.replace(
      'module.exports',
      `${requireStatement}${os.EOL}/** @type {ServiceSchema} */${os.EOL}module.exports`
    );
  }
  return code;
}

/**
 * Adds the openapi property to the controller in the code
 * @param {string} code - The code to add the openapi property to
 * @param {string} controller - The controller
 * @returns {string} The code with the added openapi property
 * @throws {Error} If the controller line is not found.
 */
function addOpenApi(code, controller) {
  const regex = new RegExp(`(${controller}:\\s*\\{)`, 'g');
  const match = regex.exec(code);
  if (match) {
    const newLine = `${match[1]}${os.EOL}    openapi: ${controller}.openapi,`;
    return code.replace(regex, newLine);
  }
  throw new Error('Controller line not found');
}

/**
 * Finds the import line in the file
 * @param {string} filePath - The path of the file
 * @param {string} service - The service to find
 * @returns {string|null} The import line or null if not found
 * @throws {Error} If the service file is not found or an error occurs while reading the file.
 */
function findImportLine(filePath, service) {
  let fileContent = null;

  try {
    fileContent = readFile(filePath);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // If the service name does not match the service file name
      // We search for a service in the plugin that has a 'name' matching the service name
      const serviceFilePath = findServiceFile(path.dirname(filePath), service);
      if (!serviceFilePath) throw new Error('Service File not found');
      return findImportLine(serviceFilePath, service);
    }
    throw new Error(`Read file Error: ${error}`);
  }

  const lines = fileContent.split(os.EOL);
  return lines.find((line) => line.includes(`require('./`) && line.endsWith(`.rest');`));
}

/**
 * Gets the path of the imported file
 * @param {string} importLine - The import line
 * @param {string} currentFilePath - The path of the current file
 * @returns {string|null} The path of the imported file or null if not found
 */
function getImportedFilePath(importLine, currentFilePath) {
  const match = importLine.match(/require\('(.*)'\)/);
  if (match && match[1]) {
    return path.resolve(path.dirname(currentFilePath), `${match[1]}.js`);
  }
  return null;
}

/**
 * Gets the path of the controller
 * @param {string} filePath - The path of the file
 * @param {string} service - The service
 * @returns {string} The path of the controller
 * @throws {Error} If the import line of rest actions is not found
 */
function getControllerPath(filePath, service) {
  const importLine = findImportLine(filePath, service);
  if (!importLine) throw Error('import line of rest actions not found');
  return getImportedFilePath(importLine, filePath);
}

/**
 * Prepares the controller file
 * @param {Object} params - The parameters
 * @param {string} params.controllerFilePath - The path of the controller file
 * @param {string} params.service - The service
 * @param {string} params.controller - The controller
 * @param {Object} params.ctx - The context
 * @throws {Error} If the controller is not found or the openapi property already exists
 */
function prepareControllerFile({ controllerFilePath, service, controller, ctx }) {
  let code = readFile(controllerFilePath);
  const ast = parseCodeToAst(code);
  const controllerObj = searchController(ast, controller);
  if (!controllerObj)
    throw new Error(`Openapi: ${controllerFilePath} Controller "${controller}" not found`);

  if (controllerObj && !hasOpenApiProperty(controllerObj)) {
    code = addRequireStatement(code, service, controller);
    code = addOpenApi(code, controller);
    writeFile(controllerFilePath, prettier.format(code, prettierOptions));
  } else {
    const message = `Openapi: ${controllerFilePath} - ${controller}: Property "openapi" already exists, I can't replace it`;
    if (ctx) {
      ctx.logger.warn(message);
    } else {
      console.warn('\x1b[31m', message, '\x1b[37m');
    }
  }
}

module.exports = {
  findControllers,
  getControllerPath,
  prepareControllerFile,
};
