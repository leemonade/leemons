const fs = require('fs');
const os = require('os');
const path = require('path');
const espree = require('espree');
const estraverse = require('estraverse');
const crypto = require('crypto');
const jsonSchemaGenerator = require('json-schema-generator');
const prettier = require('prettier');

// Prettier options for formatting the introduced code in files
const prettierOptions = {
  parser: 'babel',
  tabWidth: 2,
  useTabs: false,
  semi: true,
  endOfLine: 'lf',
  trailingCommas: 'es5',
  singleQuote: true,
};

/**
 * Writes the given text to a file at the specified path.
 * @param {string} filePath - The path of the file.
 * @param {string} text - The text to write.
 * @throws {Error} If an error occurs while writing to the file.
 */
function writeFile(filePath, text) {
  try {
    fs.writeFileSync(filePath, text);
  } catch (error) {
    throw new Error(`Write file Error(${path}): ${error}`);
  }
}

/**
 * Reads the file
 * @param {string} controllerPath - The path of the controller
 * @returns {string} The content of the file
 * @throws {Error} If an error occurs while reading the file.
 */
function readFile(controllerPath) {
  try {
    return fs.readFileSync(controllerPath, 'utf8');
  } catch (error) {
    error.message = `Read file Error: ${error.message}`;
    throw error;
  }
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
 * Decomposes the action name into its components
 * @param {string} actionName - The action name
 * @returns {Array} The components of the action name
 */
function decomposeActionName(actionName) {
  const [version, plugin, service, controller] = actionName.split('.');
  return [version, plugin, service, controller];
}

/**
 * Builds the file path
 * @param {Array} components - The components of the action name
 * @returns {string} The file path
 */
function buildFilePath({ plugin, service }) {
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
 * Parses the code into an AST
 * @param {string} code - The code to parse
 * @returns {Object} The AST of the code
 */
function parseCodeToAst(code) {
  return espree.parse(code, { range: true, ecmaVersion: 12, sourceType: 'module' });
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
 * Prepares the controller file
 * @param {Object} params - The parameters
 * @param {string} params.controllerFilePath - The path of the controller file
 * @param {string} params.service - The service
 * @param {string} params.controller - The controller
 * @param {Object} params.ctx - The context
 */
function prepareControllerFile({ controllerFilePath, service, controller, ctx }) {
  let code = readFile(controllerFilePath);
  const ast = parseCodeToAst(code);
  const controllerObj = searchController(ast, controller);
  if (!controllerObj) throw new Error(`Controller ${controller} not found`);

  if (controllerObj && !hasOpenApiProperty(controllerObj)) {
    code = addRequireStatement(code, service, controller);
    code = addOpenApi(code, controller);
  } else
    ctx.logger.warn(
      `Openapi: ${path.basename(
        controllerFilePath
      )} Property "openapi" already exists, I can't replace it`
    );

  writeFile(controllerFilePath, prettier.format(code, prettierOptions));
}

/**
 * Prepares the schema file
 * @param {string} schemaPath - The path of the schema
 * @param {string} controller - The controller
 * @param {Object} schema - The schema
 * @throws {Error} If the schema has been manually modified.
 */
function prepareSchemaFile(schemaPath, controller, schema) {
  const schemaFilePath = path.join(schemaPath, `${controller}.js`);

  let schemaFile = null;
  try {
    schemaFile = readFile(schemaFilePath);
  } catch (error) {
    //
  }

  if (schemaFile) {
    const firstLine = schemaFile.split(os.EOL)[0];
    const hash = firstLine.split('// automatic hash: ')[1];
    const schemaContent = schemaFile.split(os.EOL).slice(1).join(os.EOL);
    const calculatedHash = crypto.createHash('sha256').update(schemaContent).digest('hex');

    if (hash !== calculatedHash) throw new Error('Schema has been manually modified');
  }

  const schemaContent = prettier.format(
    `const schema = ${JSON.stringify(schema, null, 4)};

    module.exports = {schema};
    `,
    prettierOptions
  );

  const calculatedHash = crypto.createHash('sha256').update(schemaContent).digest('hex');

  writeFile(
    schemaFilePath,
    `// automatic hash: ${calculatedHash}
${schemaContent}`
  );
}

/**
 * Prepares the openapi file
 * @param {string} controllerPath - The path of the controller
 * @param {string} service - The service
 * @param {string} controller - The controller
 * @param {Object} schema - The schema
 */
function prepareOpenapiFile(controllerPath, service, controller, schema) {
  const openapiPath = path.join(controllerPath, 'openapi', service);
  const schemaPath = path.join(openapiPath, 'schemas');
  if (!fs.existsSync(schemaPath)) {
    fs.mkdirSync(schemaPath, { recursive: true });
  }
  const openapiFilePath = path.join(openapiPath, `${controller}.js`);

  if (!fs.existsSync(openapiFilePath)) {
    const openapiContent = `const { schema } = require('./schemas/${controller}');

    const openapi = {
      // summary: "Summary",
      // description: "Description",
      responses: {
        200: {
          description: 'Success',
          content: {
            'application/json': {
              schema,
            },
          },
        },
      },
    };

    module.exports = {
      openapi,
    };
    `;
    writeFile(openapiFilePath, prettier.format(openapiContent, prettierOptions));
  }
  prepareSchemaFile(schemaPath, controller, schema);
}

/**
 * Creates the openapi response
 * @param {Object} params - The parameters
 * @param {Object} params.res - The response
 * @param {Object} params.ctx - The context
 */
function createOpenapiResponse({ res, ctx }) {
  const actionName = ctx.action.name;
  const schema = jsonSchemaGenerator(res);
  try {
    const [, plugin, service, controller] = decomposeActionName(actionName);
    const filePath = buildFilePath({ plugin, service });
    const importLine = findImportLine(filePath, service);
    if (!importLine) throw Error('import line of rest actions not found');
    const controllerFilePath = getImportedFilePath(importLine, filePath);

    prepareControllerFile({ controllerFilePath, service, controller, ctx });

    prepareOpenapiFile(path.dirname(controllerFilePath, 'rest'), service, controller, schema);
  } catch (error) {
    ctx.logger.error(`ERROR Openapi: ${ctx.action.name} - ${error.message}`);
  }
}

module.exports = { createOpenapiResponse };
