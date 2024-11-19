/**
 * Formats a filename by removing extension and formatting the text
 * @param {string} filename - The original filename with extension
 * @returns {string} - Formatted filename
 */
function formatFileName(filename) {
  if (!filename) return '';

  const nameWithoutExtension = filename.split('.').slice(0, -1).join('.');

  const nameWithSpaces = nameWithoutExtension.replace(/[_-]/g, ' ');

  return nameWithSpaces
    .split(' ')
    .map((word, index) =>
      index === 0 ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : word.toLowerCase()
    )
    .join(' ');
}

export default formatFileName;
