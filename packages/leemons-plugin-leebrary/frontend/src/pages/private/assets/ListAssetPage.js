/* eslint-disable no-unreachable */
import React, { useEffect, useMemo, useState, useContext, useCallback } from 'react';
import { isEmpty } from 'lodash';
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
      setCurrentAsset(null);
    }
  }, [params, category, view]);

  useEffect(() => {
    const assetId = query.get('open');
    if (isEmpty(assetId)) {
      setCurrentAsset(null);
      setAsset(null);
    } else if (asset?.id !== assetId) {
      setCurrentAsset(assetId);
    }
  }, [query, asset]);

  // ·········································································
  // HANDLERS

  const handleOnItemClick = (item) => {
    history.push(`${location.pathname}?open=${item.id}`);
  };

  // ·········································································
  // LABELS & STATIC

  // ·········································································
  // RENDER

  return !isEmpty(categories) ? (
    <AssetList
      category={category}
      categories={categories}
      asset={currentAsset}
      layout="grid"
      onItemClick={handleOnItemClick}
    />
  ) : null;
};

export { ListAssetPage };
export default ListAssetPage;
