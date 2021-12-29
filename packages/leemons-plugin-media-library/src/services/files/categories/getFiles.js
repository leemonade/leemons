const { fileCategories } = require('../../tables');

module.exports = async function getFiles(category, { transacting } = {}) {
  const { name } = category;
  try {
    const files = await fileCategories.find({ category: name }, { transacting });
    return files.map((file) => file.asset);
  } catch (e) {
    throw new Error(`Failed to get category files: ${e.message}`);
  }
};
