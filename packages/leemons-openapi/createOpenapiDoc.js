const axios = require('axios');
const fs = require('fs');
const path = require('path');
const espree = require('espree');
const estraverse = require('estraverse');

require('dotenv').config();

function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    return '';
  }
}

function extractRequiredVariables(code) {
  const requires = code.match(/const\s*({\s*([^}]+)\s*}|[^}]+)\s*= require\(['"]([^'"]+)['"]\)/g);
  const requiredVariables = {};

  requires.forEach((req) => {
    const variableNameMatch = req.match(
      /const\s*({\s*([^}]+)\s*}|[^}]+)\s*= require\(['"]([^'"]+)['"]\)/
    );
    let variableName = variableNameMatch[2] ? variableNameMatch[2] : variableNameMatch[1];
    const importedFile = variableNameMatch[3];
    if (importedFile.includes('.')) {
      if (variableName.includes(':')) {
        [, variableName] = variableName.split(':');
      }

      variableName
        .replace('{', '')
        .replace('}', '')
        .split(',')
        .forEach((el) => {
          requiredVariables[el.trim()] = importedFile;
        });
    }
  });
  return requiredVariables;
}

function findControllerNode(ast, controllerName) {
  let controllerNode = null;
  estraverse.traverse(ast, {
    enter(node) {
      if (node.type === 'Property' && node.key.name === controllerName) {
        controllerNode = node;
        this.break();
      }
    },
  });
  return controllerNode;
}

function findRealRequired(controllerNode, variables, requiredVariables) {
  const realRequired = new Set();
  estraverse.traverse(controllerNode, {
    enter(node) {
      if (node.type === 'CallExpression') {
        if (variables.includes(node.callee.name)) {
          realRequired.add(requiredVariables[node.callee.name]);
        } else if (
          node.callee.type === 'MemberExpression' &&
          variables.includes(node.callee.object.name)
        ) {
          realRequired.add(requiredVariables[node.callee.object.name]);
        }
      }
    },
  });
  return realRequired;
}

function findFunctionInController(filePath, controllerName) {
  // Read the source code of the file
  const code = fs.readFileSync(filePath, 'utf8');

  // Find all require calls and extract variable names
  const requiredVariables = extractRequiredVariables(code);

  const variables = Object.keys(requiredVariables);

  // Parse the source code into an AST
  const ast = espree.parse(code, {
    // Parsing options
    ecmaVersion: 2020,
    sourceType: 'module',
  });

  // Variable to store the found node
  const controllerNode = findControllerNode(ast, controllerName);

  if (!controllerNode) {
    console.warn(`Openapi: Controller "${controllerName}" not found in "${filePath}"`);
    return [];
  }

  const realRequired = findRealRequired(controllerNode, variables, requiredVariables);

  return [...realRequired];
}

function getRequiredFiles(filePath, concatenatedFiles = new Set()) {
  // Create a set to store the paths of the files that have been concatenated

  let requiredFiles = [];
  const fileContent = readFile(filePath);

  if (!concatenatedFiles.has(filePath)) {
    requiredFiles = [filePath, fileContent];
    concatenatedFiles.add(filePath);
  }

  const regex = /require\('(.*)'\)/g;
  let match = regex.exec(fileContent);

  while (match !== null) {
    const matchPath = match[1];
    if (matchPath.indexOf('.') < 0) {
      match = regex.exec(fileContent);
    } else {
      let requiredFilePath = path.resolve(path.join(path.dirname(filePath), match[1]));
      try {
        if (fs.lstatSync(requiredFilePath).isDirectory()) {
          requiredFilePath = path.join(requiredFilePath, '/index.js');
        }
      } catch (err) {
        if (requiredFilePath.indexOf('.') < 0) {
          requiredFilePath = path.join(requiredFilePath, '.js').replace('/.js', '.js');
        }
      }
      if (
        requiredFilePath.endsWith('.js') &&
        !requiredFilePath.endsWith('transform.js') &&
        !requiredFilePath.includes('rest/openapi/')
      ) {
        // Check if the file has already been concatenated
        if (!concatenatedFiles.has(requiredFilePath)) {
          requiredFiles.push(requiredFilePath);
          requiredFiles.push(readFile(requiredFilePath));
          // Add the file to the set of concatenated files
          concatenatedFiles.add(requiredFilePath);
          requiredFiles = requiredFiles.concat(
            getRequiredFiles(requiredFilePath, concatenatedFiles)
          );
        }
      }
      match = regex.exec(fileContent);
    }
  }

  return requiredFiles;
}

function createCodeContext(filePath, controllerName) {
  const controllerRequires = findFunctionInController(filePath, controllerName);

  const concatenatedFiles = new Set();
  concatenatedFiles.add(filePath);

  let codeContext = [filePath, readFile(filePath)];
  concatenatedFiles.add(filePath);

  controllerRequires.forEach((controllerRequire) => {
    const requiredFilesContext = getRequiredFiles(
      path.join(filePath, controllerRequire),
      concatenatedFiles
    );
    codeContext = codeContext.concat(requiredFilesContext);
  });

  return codeContext.join('\n');
}

async function callOpenAI(systemMessage, userMessage) {
  const messages = [
    { role: 'user', content: userMessage },
    { role: 'system', content: systemMessage },
  ];

  const response = await axios.post(
    process.env.APIURL_OPENAI,
    {
      model: 'gpt-3.5-turbo-16k',
      messages,
      temperature: 1,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.APIKEY_OPENAI}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data.choices[0].message.content.replace('```json', '').replace('```', '');
}

async function createOpenapiDoc(service, controller, controllerFile) {
  // const systemMessage = `Return a valid JSON object with "Summary" and "Description" properties, to be used in an OpenAPI spec, describing what the handler of the "${controller}" property does in file "${path.basename(
  //   controllerFile
  // )}", based on the user Javascript code. Only response with the JSON object and only with 'summary' and 'description' properties.`;

  // const userMessage = `Return a valid JSON object with 'summary' and 'description' properties (ALWAYS in downcase), to be used in an OpenAPI spec, describing what the handler  of the "${controller}" property does in file "${path.basename(
  //   controllerFile
  // )}", based on the user JavaScript code.
  // Only respond with the JSON object and only with 'summary' and 'description' properties. The 'description' must be in markdown format and field should contain the following information (each point should be clearly separated into a new paragraph):
  // * Detailed description of what the controller does (no information about the parameters it accepts and what the response would contain or its status).
  // * Report whether the endpoint requires user login.
  // * Report the necessary permissions for the user to use the endpoint.`;

  const systemMessage = `Respond as if you were an expert in REST APIs for JavaScript using the Moleculer framework.Return a valid JSON object with only 'summary' and 'description' properties that can be used to document, using OpenAPI specifications, what the handler of the '${controller}' property does in the '${controllerFile}' file, which is an action in the Moleculer JavaScript framework.
I want 'summary' only have a short resume of what the controller does. Don't start it with "This handler" or "This Endpoint", only the summary.
I want the description to be in markdown format and contain the following information (each point should be clearly separated into a different paragraph):
* Short detailed description of what the handler does. It should always start with "This endpoint" and should not contain information about the parameters it receives and the response it returns, only what is expected to be done.
* Authentication: Information about whether the user needs to be logged in to use the endpoint. It should start with '**Authentication:**"
* Permissions: Information about the permissions required for the user to use the endpoint. It should start with "**Permissions:**"
* Fully detailed description of what the controller handler, and the methods it calls, does.
`;

  const userMessage = createCodeContext(controllerFile, controller);

  let responseObj = {};

  let AIResponse = null;
  try {
    const messages = [
      { role: 'user', content: userMessage },
      { role: 'system', content: systemMessage },
    ];
    console.info('Sending message to OpenAI', JSON.stringify(messages).length, 'Characters');
    AIResponse = await callOpenAI(systemMessage, userMessage);
    console.info('OpenAI Response', AIResponse);

    try {
      const response = JSON.parse(AIResponse.replace(/`/g, '\\`'));
      responseObj = {
        summary: response.summary,
        description: response.description,
        AIGenerated: true,
      };
    } catch (error) {
      console.log('-----ERROR-----', error);
      throw error;
      responseObj = { description: AIResponse, AIGenerated: true };
    }
  } catch (error) {
    throw error;
    console.warn('Openapi: OpenAI Error', error);
  }
  const requestFolder = path.resolve(__dirname, 'requests');

  if (!fs.existsSync(requestFolder)) {
    fs.mkdirSync(requestFolder);
  }

  fs.writeFileSync(
    path.resolve(requestFolder, `${service}-${controller}.request.txt`),
    JSON.stringify({ systemMessage, userMessage, response: responseObj }, null, 2)
  );

  return responseObj;
}

module.exports = { createOpenapiDoc };
