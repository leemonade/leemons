/* eslint-disable no-unreachable */
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { isEmpty, isNil } from 'lodash';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import useAcademicFiltersForAssetList from '@assignables/hooks/useAcademicFiltersForAssetList';
import useGetProfileSysName from '@users/helpers/useGetProfileSysName';
import { useIsStudent, useIsTeacher } from '@academic-portfolio/hooks';
import LibraryContext from '../../../context/LibraryContext';
import { VIEWS } from '../library/Library.constants';
import { AssetList } from '../../../components/AssetList';

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const ListAssetPage = () => {
  const { setView, view, categories, asset, setAsset, category, selectCategory, setLoading } =
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
  const profile = useGetProfileSysName();
  const isStudent = useIsStudent();
  const isTeacher = useIsTeacher();
  const isAdmin = profile === 'admin';
  const academicFilters = useAcademicFiltersForAssetList({
    // hideProgramSelect: isStudent,
    useLabels: true,
  });

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
    } else {
      history.push(
        `${location.pathname}?${getQueryParams({
          includeType: true,
          includePublic: true,
          includePublished: true,
        })}`
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

  let props = {};
  if (
    (category?.key === 'pins' ||
      category?.key === 'assignables.task' ||
      category?.key === 'assignables.tests') &&
    (isTeacher || isStudent)
  ) {
    props = academicFilters;
  }
  if (category?.key === 'media-files' && isTeacher) {
    props = academicFilters;
    props.searchInProvider = false;
  }

  return !isNil(categories) && !isEmpty(categories) ? (
    <AssetList
      {...props}
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
      pinned={category?.key === 'pins'}
      onLoading={setLoading}
    />
  ) : null;
};

export { ListAssetPage };
export default ListAssetPage;
