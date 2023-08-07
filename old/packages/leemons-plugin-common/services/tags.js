const tags = require('../src/services/tags');

module.exports = {
  getTagsValueByPartialTags: tags.getTagsValueByPartialTags,
  removeAllValuesForTags: tags.removeAllValuesForTags,
  removeAllTagsForValues: tags.removeAllTagsForValues,
  getControllerFunctions: tags.getControllerFunctions,
  removeTagsForValues: tags.removeTagsForValues,
  setTagsToValues: tags.setTagsToValues,
  addTagsToValues: tags.addTagsToValues,
  getTagsValues: tags.getTagsValues,
  getValuesTags: tags.getValuesTags,
  getRoutes: tags.getRoutes,
  listTags: tags.listTags,
  getTags: tags.getTags,
};
