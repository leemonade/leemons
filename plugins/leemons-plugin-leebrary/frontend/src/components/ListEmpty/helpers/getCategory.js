export function getCategory({ category, t }) {
  if (category?.key === 'leebrary-recent') {
    return { ...category, pluralName: t('recent').toLowerCase() };
  }
  if (category?.key === 'pins') {
    return { ...category, pluralName: t('quickAccess').toLowerCase() };
  }

  if (category?.key === 'leebrary-shared') {
    return { ...category, pluralName: t('sharedWithMe').toLowerCase() };
  }

  return category ?? {};
}
