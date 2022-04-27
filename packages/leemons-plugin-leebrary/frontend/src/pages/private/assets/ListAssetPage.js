/* eslint-disable no-unreachable */
import React, { useEffect, useMemo, useState, useContext, useCallback } from 'react';
import { isEmpty, isNil } from 'lodash';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import LibraryContext from '../../../context/LibraryContext';
import { VIEWS } from '../library/Library.constants';
import { AssetList } from '../../../components/AssetList';

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const ListAssetPage = () => {
  const { setView, view, categories, asset, setAsset, category, selectCategory } =
    useContext(LibraryContext);
  const [currentAsset, setCurrentAsset] = useState(asset);
  const [searchCriteria, setSearchCriteria] = useState('');
  const [assetType, setAssetType] = useState('');
  const [showPublic, setShowPublic] = useState(false);
  const [showPublished, setShowPublished] = useState(true);
  const history = useHistory();
  const params = useParams();
  const query = useQuery();
  const location = useLocation();

  // ·········································································
  // EFFECTS

  useEffect(() => {
    setCurrentAsset(asset);
  }, [asset]);

  useEffect(() => {
    if (view !== VIEWS.LIST) setView(VIEWS.LIST);
    if (!isEmpty(params?.category) && category?.key !== params?.category) {
      selectCategory(params?.category);
      if (category) {
        setCurrentAsset(null);
      }
    }
  }, [params, category, view]);

  useEffect(() => {
    const assetId = query.get('open');
    const criteria = query.get('search');
    const type = query.get('type');
    const displayPublic = [1, '1', true, 'true'].includes(query.get('showPublic'));

    if (displayPublic !== showPublic) {
      setShowPublic(displayPublic);
    }

    if (!assetId || isEmpty(assetId)) {
      setCurrentAsset(null);
      setAsset(null);
    } else if (asset?.id !== assetId) {
      setCurrentAsset(assetId);
    }

    if (isEmpty(criteria)) {
      setSearchCriteria('');
    } else if (criteria !== searchCriteria) {
      setSearchCriteria(criteria);
    }

    if (isEmpty(type)) {
      setAssetType('');
    } else if (type !== assetType) {
      setAssetType(type);
    }
  }, [query, asset]);

  // ·········································································
  // LABELS & STATIC

  const getQueryParams = useCallback(
    ({ includeSearch, includeOpen, includeType, includePublic, includePublished }, suffix) => {
      const open = query.get('open');
      const search = query.get('search');
      const type = query.get('type');
      const displayPublic = [1, '1', true, 'true'].includes(query.get('showPublic'));
      const result = [];

      if (!isEmpty(open) && includeOpen) {
        result.push(`open=${open}`);
      }
      if (!isEmpty(search) && includeSearch) {
        result.push(`search=${search}`);
      }

      if (!isEmpty(type) && includeType) {
        result.push(`type=${type}`);
      }

      if (includePublic) {
        result.push(`showPublic=${displayPublic}`);
      }

      if (includePublished) {
        result.push(`published=${showPublished}`);
      }

      if (!isEmpty(suffix)) {
        result.push(suffix);
      }

      return result.join('&');
    },
    [query]
  );

  // ·········································································
  // HANDLERS

  const handleOnSelectItem = (item) => {
    history.push(
      `${location.pathname}?${getQueryParams(
        { includeSearch: true, includeType: true, includePublic: true, includePublished: true },
        `open=${item.id}`
      )}`
    );
  };

  const handleOnEditItem = (item) => {
    history.push(`/private/leebrary/edit/${item.id}`);
  };

  const handleOnSearch = (criteria) => {
    if (!isEmpty(criteria)) {
      history.push(
        `${location.pathname}?${getQueryParams(
          { includeType: true, includePublic: true, includePublished: true },
          `search=${criteria}`
        )}`
      );
    }
  };

  const handleOnShowPublic = (value) => {
    history.push(
      `${location.pathname}?${getQueryParams(
        { includeType: true, includePublished: true, includeSearch: true },
        `showPublic=${value}`
      )}`
    );
  };

  const handleOnTypeChange = (type) => {
    history.push(
      `${location.pathname}?${getQueryParams(
        { includeSearch: true, includePublic: true, includePublished: true },
        `type=${type}`
      )}`
    );
  };

  // ·········································································
  // RENDER

  return !isEmpty(categories) ? (
    <AssetList
      category={category}
      categories={categories}
      asset={currentAsset}
      search={searchCriteria}
      layout="grid"
      published={showPublished}
      showPublic={showPublic}
      onSelectItem={handleOnSelectItem}
      onEditItem={handleOnEditItem}
      onSearch={handleOnSearch}
      onTypeChange={handleOnTypeChange}
      onShowPublic={handleOnShowPublic}
      assetType={assetType}
      pinned={isNil(category)}
    />
  ) : null;
};

export { ListAssetPage };
export default ListAssetPage;
