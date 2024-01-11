/* eslint-disable no-unreachable */
import { useIsStudent, useIsTeacher } from '@academic-portfolio/hooks';
import useAcademicFiltersForAssetList from '@assignables/hooks/useAcademicFiltersForAssetList';
import { Box, createStyles } from '@bubbles-ui/components';
import { isEmpty, isNil } from 'lodash';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { AssetList } from '../../../components/AssetList';
import LibraryContext from '../../../context/LibraryContext';
import { VIEWS } from '../library/Library.constants';

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const ListPageStyles = createStyles((theme) => ({
  tabPane: {
    display: 'flex',
    flex: 1,
    height: '100%',
    paddingTop: theme.spacing[5],
    paddingBottom: theme.spacing[5],
  },
  original: {
    display: 'flex',
    flex: 1,
    minHeight: '100%',
  },
}));

const ListAssetPage = () => {
  const { setView, view, categories, asset, setAsset, category, selectCategory, setLoading } =
    useContext(LibraryContext);
  const { classes } = ListPageStyles({});
  const [currentAsset, setCurrentAsset] = useState(asset);
  const [searchCriteria, setSearchCriteria] = useState('');

  const [mediaAssetType, setMediaAssetType] = useState('');
  const [showPublic, setShowPublic] = useState(false);
  const [showPublished, setShowPublished] = useState(true);
  const history = useHistory();
  const params = useParams();
  const query = useQuery();
  const [activeStatus, setActiveStatus] = useState(query.get('activeTab') || 'published');
  const location = useLocation();
  const isStudent = useIsStudent();
  const isTeacher = useIsTeacher();
  const academicFilters = useAcademicFiltersForAssetList({
    // hideProgramSelect: isStudent,
    useLabels: false,
  });

  // ·········································································
  // EFFECTS

  useEffect(() => {
    setCurrentAsset(asset);
  }, [JSON.stringify(asset)]);

  useEffect(() => {
    if (view !== VIEWS.LIST) setView(VIEWS.LIST);

    if (!isEmpty(params?.category) && category?.key !== params?.category) {
      selectCategory(params?.category);
      if (category) {
        setCurrentAsset(null);
      }
    }
  }, [JSON.stringify(params), JSON.stringify(category), JSON.stringify(view)]);

  useEffect(() => {
    const assetId = query.get('open');
    const criteria = query.get('search');
    const type = query.get('type');
    const _activeTab = query.get('activeTab');
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
      setMediaAssetType('');
    } else if (type !== mediaAssetType) {
      setMediaAssetType(type);
    }

    if (isEmpty(_activeTab)) {
      setActiveStatus('published');
    } else if (_activeTab !== activeStatus) {
      setActiveStatus(_activeTab);
    }
  }, [query, asset]);

  // ·········································································
  // LABELS & STATIC

  const getQueryParams = useCallback(
    (
      {
        includeSearch,
        includeOpen,
        includeType,
        includePublic,
        includePublished,
        includeActiveTab,
      },
      suffix
    ) => {
      const open = query.get('open');
      const search = query.get('search');
      const type = query.get('type');
      const _activeTab = query.get('activeTab');
      const displayPublic = [1, '1', true, 'true'].includes(query.get('showPublic'));
      const result = [];

      if (!isEmpty(open) && includeOpen) {
        result.push(`open=${open}`);
      }
      if (!isEmpty(search) && includeSearch) {
        result.push(`search=${search}`);
      }
      if (!isEmpty(_activeTab) && includeActiveTab) {
        result.push(`activeTab=${_activeTab}`);
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
    [query, activeStatus]
  );

  // ·········································································
  // HANDLERS

  const handleOnSelectItem = (item) => {
    history.push(
      `${location.pathname}?${getQueryParams(
        {
          includeSearch: true,
          includeType: true,
          includePublic: true,
          includePublished: true,
          includeActiveTab: true,
        },
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
          {
            includeType: true,
            includePublic: true,
            includePublished: true,
            includeActiveTab: true,
          },
          `search=${criteria}`
        )}`
      );
    } else {
      history.push(
        `${location.pathname}?${getQueryParams({
          includeType: true,
          includePublic: true,
          includePublished: true,
          includeActiveTab: true,
        })}`
      );
    }
  };

  const handleOnShowPublic = (value) => {
    history.push(
      `${location.pathname}?${getQueryParams(
        { includeType: true, includePublished: true, includeSearch: true, includeActiveTab: true },
        `showPublic=${value}`
      )}`
    );
  };

  const handleOnTypeChange = (type) => {
    history.push(
      `${location.pathname}?${getQueryParams(
        {
          includeSearch: true,
          includePublic: true,
          includePublished: true,
          includeActiveTab: true,
        },
        `type=${type}`
      )}`
    );
  };

  const handleOnPublishingStatusChange = (tab) => {
    history.push(
      `${location.pathname}?${getQueryParams(
        {
          includeSearch: true,
          includePublic: true,
          includePublished: true,
        },
        `activeTab=${tab}`
      )}`
    );
  };

  // ·········································································
  // RENDER

  let props = {};
  const multiCategorySections = ['pins', 'leebrary-shared', 'leebrary-recent'];
  const staticAssignables = ['assignables.content-creator', 'assignables.scorm'];

  if (
    (multiCategorySections.includes(category?.key) ||
      (category?.key?.startsWith('assignables.') && !staticAssignables.includes(category?.key))) &&
    (isTeacher || isStudent)
  ) {
    props = academicFilters;
    props.canChangeType = false;
  }

  if ((category?.key === 'media-files' || category?.key === 'bookmarks') && isTeacher) {
    // props = academicFilters; // TODO: implement
    props.searchInProvider = false;
  }

  // Publish & Draft filters allowed
  if (
    (category?.key?.startsWith('assignables.') || category?.key === 'tests-questions-banks') &&
    category?.key !== 'assignables.scorm'
  ) {
    return (
      <Box
        className={classes.original}
        sx={(theme) => ({ backgroundColor: theme.colors.uiBackground02, height: 'auto' })}
      >
        <AssetList
          {...props}
          category={category}
          categories={categories}
          asset={currentAsset}
          search={searchCriteria}
          layout="grid"
          showPublic={showPublic}
          onSelectItem={handleOnSelectItem}
          onEditItem={handleOnEditItem}
          onSearch={handleOnSearch}
          onTypeChange={handleOnTypeChange}
          onShowPublic={handleOnShowPublic}
          assetType={mediaAssetType}
          pinned={category?.key === 'pins'}
          onLoading={setLoading}
          published={activeStatus === 'published'}
          variant="embedded"
          allowStatusChange={true}
          onStatusChange={handleOnPublishingStatusChange}
          assetStatus={activeStatus}
        />
      </Box>
    );
  }

  return !isNil(categories) && !isEmpty(categories) ? (
    <Box
      className={classes.original}
      sx={(theme) => ({ backgroundColor: theme.colors.uiBackground02, height: 'auto' })}
    >
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
        assetType={mediaAssetType}
        pinned={category?.key === 'pins'}
        onLoading={setLoading}
        variant="embedded"
      />
    </Box>
  ) : null;
};

export { ListAssetPage };
export default ListAssetPage;
