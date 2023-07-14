/* eslint-disable no-unreachable */
import { useIsStudent, useIsTeacher } from '@academic-portfolio/hooks';
import useAcademicFiltersForAssetList from '@assignables/hooks/useAcademicFiltersForAssetList';
import { Box, TabPanel, Tabs, createStyles } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import useGetProfileSysName from '@users/helpers/useGetProfileSysName';
import { isEmpty, isNil } from 'lodash';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { AssetList } from '../../../components/AssetList';
import LibraryContext from '../../../context/LibraryContext';
import prefixPN from '../../../helpers/prefixPN';
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
    height: '100%',
    paddingTop: theme.spacing[5],
    paddingBottom: theme.spacing[5],
    paddingLeft: theme.spacing[8],
    paddingRight: theme.spacing[8],
  },
}));

const ListAssetPage = () => {
  const { setView, view, categories, asset, setAsset, category, selectCategory, setLoading } =
    useContext(LibraryContext);
  const [t] = useTranslateLoader(prefixPN('assetsList'));
  const { classes } = ListPageStyles({});
  const [currentAsset, setCurrentAsset] = useState(asset);
  const [searchCriteria, setSearchCriteria] = useState('');

  const [assetType, setAssetType] = useState('');
  const [showPublic, setShowPublic] = useState(false);
  const [showPublished, setShowPublished] = useState(true);
  const history = useHistory();
  const params = useParams();
  const query = useQuery();
  const [activeTab, setActiveTab] = useState(query.get('activeTab') || 'published');
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
      setAssetType('');
    } else if (type !== assetType) {
      setAssetType(type);
    }

    if (isEmpty(_activeTab)) {
      setActiveTab('published');
    } else if (_activeTab !== activeTab) {
      setActiveTab(_activeTab);
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
    [query]
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

  const handleOnTabChange = (tab) => {
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
  if (
    (category?.key === 'pins' || category?.key?.startsWith('assignables.')) &&
    (isTeacher || isStudent)
  ) {
    props = academicFilters;
  }
  if (category?.key === 'media-files' && isTeacher) {
    props = academicFilters;
    props.searchInProvider = false;
  }

  if (category?.key?.startsWith('assignables.') || category?.key === 'tests-questions-banks') {
    return (
      <Tabs
        panelColor="solid"
        usePageLayout
        fullHeight
        fullWidth
        activeKey={activeTab}
        onTabClick={(e) => {
          handleOnTabChange(e);
          setCurrentAsset(null);
        }}
      >
        <TabPanel key="published" label={t('published')}>
          <Box className={classes.tabPane}>
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
              assetType={assetType}
              pinned={category?.key === 'pins'}
              onLoading={setLoading}
              published={true}
              variant="embedded"
            />
          </Box>
        </TabPanel>
        <TabPanel key="draft" label={t('draft')}>
          <Box className={classes.tabPane}>
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
              assetType={assetType}
              pinned={category?.key === 'pins'}
              onLoading={setLoading}
              published={false}
              variant="embedded"
            />
          </Box>
        </TabPanel>
      </Tabs>
    );
  }

  return !isNil(categories) && !isEmpty(categories) ? (
    <Box
      className={classes.original}
      sx={(theme) => ({ backgroundColor: theme.colors.uiBackground02 })}
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
        assetType={assetType}
        pinned={category?.key === 'pins'}
        onLoading={setLoading}
        variant="embedded"
      />
    </Box>
  ) : null;
};

export { ListAssetPage };
export default ListAssetPage;
