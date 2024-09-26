const _ = require('lodash');

const { getByCategory } = require('../permissions/getByCategory');
const { byCriteria: getByCriteria } = require('./byCriteria');

async function list({
  category,
  criteria,
  type,
  published,
  preferCurrent,
  showPublic,
  searchInProvider,
  roles,
  providerQuery,
  programs,
  subjects,
  onlyShared,
  categoryFilter,
  categoriesFilter,
  hideCoverAssets,

  indexable = true, // !important: This param is not intended for API use, as it will expose hidden assets

  ctx,
}) {
  const trueValues = ['true', true, '1', 1];

  let assets;
  const publishedStatus =
    published === 'all' ? published : [...trueValues, 'published'].includes(published);
  const displayPublic = trueValues.includes(showPublic);
  const searchProvider = trueValues.includes(searchInProvider);
  const preferCurrentValue = trueValues.includes(preferCurrent);
  const _hideCoverAssets = trueValues.includes(hideCoverAssets);
  const _onlyShared = trueValues.includes(onlyShared);
  const _indexable = trueValues.includes(indexable);
  const parsedRoles = JSON.parse(roles || null) || [];
  const _providerQuery = JSON.parse(providerQuery || null);
  const _programs = JSON.parse(programs || null);
  const _subjects = JSON.parse(subjects || null);
  const _categoriesFilter = JSON.parse(categoriesFilter || null); // added to filter by multiple categories

  const shouldSerachByCriteria = !_.isEmpty(criteria) || !_.isEmpty(type) || _.isEmpty(category);

  if (shouldSerachByCriteria) {
    assets = await getByCriteria({
      category: category || categoryFilter,
      criteria,
      type,
      indexable: _indexable,
      published: publishedStatus,
      showPublic: displayPublic,
      preferCurrent: preferCurrentValue,
      roles: parsedRoles,
      searchInProvider: searchProvider,
      providerQuery: _providerQuery,
      programs: _programs,
      subjects: _subjects,
      onlyShared: _onlyShared,
      sortBy: 'updated_at',
      sortDirection: 'desc',
      categoriesFilter: _categoriesFilter,
      hideCoverAssets: _hideCoverAssets,
      ctx,
    });
  } else {
    assets = await getByCategory({
      category,
      published: publishedStatus,
      indexable: _indexable,
      preferCurrent: preferCurrentValue,
      showPublic: displayPublic,
      roles: parsedRoles,
      searchInProvider: searchProvider,
      providerQuery: _providerQuery,
      programs: _programs,
      subjects: _subjects,
      onlyShared: _onlyShared, // not used within getByCategory()
      sortBy: 'updated_at',
      sortDirection: 'desc',
      ctx,
    });
  }

  // TODO: Temporary solution
  if (parsedRoles?.length === 1 && parsedRoles[0] === 'owner') {
    assets = assets.filter((asset) => asset.role === 'owner');
  }

  return assets;
}

module.exports = {
  list,
};
