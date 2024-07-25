/**
 * Reads a file and returns the content as a string
 * @param {File} file
 * @returns {Promise<string>}
 */
function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

export default readFile;
