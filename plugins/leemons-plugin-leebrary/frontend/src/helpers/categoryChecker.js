const categoryChecker = (categoriesData, assetData) => {
  const assetCategory = assetData?.category;
  const categoryExist = categoriesData?.find((category) => category.id === assetCategory);
  if (categoryExist) {
    const categorySelected = categoriesData.find((category) => category.id === assetCategory);
    return categorySelected?.key === 'media-files' || categorySelected?.key === 'bookmarks';
  }
  return false;
};

export { categoryChecker };
export default categoryChecker;
