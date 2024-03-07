const { removeAllValuesForTags } = require('./removeAllValuesForTags');
const { removeAllTagsForValues } = require('./removeAllTagsForValues');
const { removeTagsForValues } = require('./removeTagsForValues');
const { setTagsToValues } = require('./setTagsToValues');
const { addTagsToValues } = require('./addTagsToValues');
const { getTagsValues } = require('./getTagsValues');
const { getValuesTags } = require('./getValuesTags');
const { listTags } = require('./listTags');
const { getTags } = require('./getTags');
const { getTagsValueByPartialTags } = require('./getTagsValueByPartialTags');

module.exports = {
  removeAllValuesForTags,
  removeAllTagsForValues,
  removeTagsForValues,
  setTagsToValues,
  addTagsToValues,
  getTagsValues,
  getValuesTags,
  listTags,
  getTags,
  getTagsValueByPartialTags,
};
