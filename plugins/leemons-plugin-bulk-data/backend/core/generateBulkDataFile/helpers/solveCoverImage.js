const solveCoverImage = ({ processedItem, coverFileId, libraryAssets }) => {
  if (!coverFileId) return '';
  const asset = libraryAssets.find((item) => item.asset.file?.id === coverFileId)?.bulkId;
  return asset ?? processedItem.cover;
};

module.exports = { solveCoverImage };
