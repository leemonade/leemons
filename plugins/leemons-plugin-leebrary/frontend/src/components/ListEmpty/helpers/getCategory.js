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

  if (category?.key?.startsWith('leebrary-subject')) {
    return {
      ...category,
      key: 'leebrary-subject',
      pluralName: t('subjects').toLowerCase(),
    };
  }

  return category ?? {};
}

export default getCategory;
