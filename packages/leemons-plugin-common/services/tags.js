const tags = require('../src/services/tags');

module.exports = {
  removeAllValuesForTags: tags.removeAllValuesForTags,
  removeAllTagsForValues: tags.removeAllTagsForValues,
  removeTagsForValues: tags.removeTagsForValues,
  setTagsToValues: tags.setTagsToValues,
  addTagsToValues: tags.addTagsToValues,
  getTagsValues: tags.getTagsValues,
  getValuesTags: tags.getValuesTags,
  getTags: tags.getTags,
};
