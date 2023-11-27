const fs = require('fs');

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
    throw new Error(`Write file Error(${filePath}): ${error}`);
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

module.exports = {
  writeFile,
  readFile,
};
