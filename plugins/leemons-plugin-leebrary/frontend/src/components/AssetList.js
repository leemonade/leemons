/* eslint-disable no-param-reassign */
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { cloneDeep, find, forEach, isArray, isEmpty, noop } from 'lodash';
import { useQueryClient } from '@tanstack/react-query';
import PropTypes from 'prop-types';
import {
  Select,
  Box,
  ImageLoader,
  Stack,
  SearchInput,
  useDebouncedValue,
  useResizeObserver,
  LoadingOverlay,
  TotalLayoutContainer,
  PaginatedList,
  Drawer,
} from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { useSession } from '@users/session';
import { useLayout } from '@layout/context';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { LocaleDate, unflatten, useRequestErrorMessage } from '@common';
import { LibraryItem } from '@leebrary/components/LibraryItem';
import useSimpleAssetList from '@leebrary/request/hooks/queries/useSimpleAssetList';
import { useAssets as useAssetsDetails } from '@leebrary/request/hooks/queries/useAssets';
import getPageItems from '@leebrary/helpers/getPageItems';
import {
  deleteAssetRequest,
  duplicateAssetRequest,
  pinAssetRequest,
  unpinAssetRequest,
} from '@leebrary/request';
import { allGetSimpleAssetListKey } from '@leebrary/request/hooks/keys/simpleAssetList';
import { allGetAssetsKey } from '@leebrary/request/hooks/keys/assets';
import LibraryContext from '@leebrary/context/LibraryContext';
import { useHistory } from 'react-router-dom';
import { useIsTeacher } from '@academic-portfolio/hooks';
import prefixPN from '../helpers/prefixPN';
import { CardDetailWrapper } from './CardDetailWrapper';
import { CardWrapper } from './CardWrapper';
import { ListEmpty } from './ListEmpty';
import { SearchEmpty } from './SearchEmpty';
import { prepareAsset } from '../helpers/prepareAsset';
import { PermissionsDataDrawer } from './AssetSetup/PermissionsDataDrawer';
import { NewLibraryCardButton } from './NewLibraryCardButton/NewLibraryCardButton';

// -------------------------------------------------------------------------------------
// HELPERS

function getLocale(session) {
  return session ? session.locale : navigator?.language || 'en';
}

function getOwner(asset) {
  const owner = (asset?.canAccess || []).filter((person) =>
    person.permissions.includes('owner')
  )[0];
  return !isEmpty(owner) ? `${owner?.name} ${owner?.surnames}` : '-';
}

function handlePaginationAndDetailsLoad({
  assetList,
  pageSize,
  shouldInsertNewItem,
  assetsDetails,
  page,
}) {
  const paginatedObject = getPageItems({
    data: assetList,
    page: page - 1,
    size: pageSize,
    includeNewItem: true,
  });

  // Replace the list of asset ids for the detail of the assets when loaded + clean the metadata
  if (assetsDetails && !isEmpty(assetsDetails)) {
    paginatedObject.items = cloneDeep(assetsDetails);
    forEach(paginatedObject.items, (item) => {
      if (item.file?.metadata?.indexOf('pathsInfo')) {
        item.file.metadata = JSON.parse(item.file.metadata);
        delete item.file.metadata.pathsInfo;
        item.file.metadata = JSON.stringify(item.file.metadata);
      }
    });
  }

  // If a new item should be inserted and it doesn't already exist, add it to the beginning of the items array
  if (shouldInsertNewItem && !paginatedObject.items.some((item) => item.action === 'new')) {
    paginatedObject.items.unshift({ action: 'new' });
  }
  return paginatedObject;
}

function handlePaginationAndEmptyAssetList({ shouldInsertNewItem }) {
  // Minimal structure where there are no assets to show but it's a creatable category
  if (shouldInsertNewItem) {
    return {
      items: [{ action: 'new' }],
      page: 0,
      size: 1,
      totalCount: 1,
      totalPages: 1,
      isEmpty: true,
    };
  }
  return null;
}

const RECENT_CATEGORY = 'leebrary-recent';
const SHARED_CATEGORY = 'leebrary-shared';
const SUBJECT_CATEGORY = 'leebrary-subject';
const PINS_CATEGORY = 'pins';
const NOT_CREATABLE_CATEGORIES = [
  PINS_CATEGORY,
  RECENT_CATEGORY,
  SHARED_CATEGORY,
  SUBJECT_CATEGORY,
];

const AssetList = ({
  categories = [],
  category,
  asset,
  onSelect,
  allowSearchByCriteria,
  searchCriteria,
  onSearch = noop,
  allowStatusFilter,
  statusFilter,
  onStatusChange,
  allowCategoryFilter,
  categoryFilter,
  onCategoryFilter,
  allowMediaTypeFilter,
  mediaTypes,
  mediaTypeFilter,
  onMediaTypeChange,
  onEditItem,
  allowAcademicFilter,
  filterComponents,
  filters: academicFilters,
  forgetAssetToOpen,
}) => {
  const session = useSession();
  const locale = getLocale(session);
  const [t, translations] = useTranslateLoader(prefixPN('list'));
  const [, , , getErrorMessage] = useRequestErrorMessage();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [itemToShare, setItemToShare] = useState(null);
  const [tempSearchCriteria, setTempSearchCriteria] = useState(searchCriteria);
  const [searchCriteriaDebounced] = useDebouncedValue(tempSearchCriteria, 300);
  const [pageAssetsData, setPageAssetsData] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [cardDetailIsLoading, setCardDetailIsLoading] = useState(false);
  const isTeacher = useIsTeacher();

  const detailLabels = useMemo(() => {
    if (!isEmpty(translations)) {
      const items = unflatten(translations.items);
      return items.leebrary.list.labels;
    }
    return {};
  }, [JSON.stringify(translations)]);

  const scrollRef = useRef();
  const [childRef, childRect] = useResizeObserver();

  const {
    openConfirmationModal,
    openDeleteConfirmationModal,
    setLoading: setAppLoading,
  } = useLayout();

  const { newAsset } = useContext(LibraryContext);
  const history = useHistory();

  // -------------------------------------------------------------------------------------
  // QUERY HOOKS

  const queryClient = useQueryClient();
  const assetListQuery = useMemo(() => {
    const waitForAcademicFilters = allowAcademicFilter && !academicFilters;
    if (!category || waitForAcademicFilters) return null;
    const query = {
      providerQuery: academicFilters ? JSON.stringify(academicFilters) : null,
      criteria: searchCriteria || '',
      pinned: category?.key === PINS_CATEGORY,
      category: category?.id,
      published: allowStatusFilter ? statusFilter : true,
      showPublic: category?.key === PINS_CATEGORY,
      preferCurrent: true,
    };

    if (allowMediaTypeFilter && mediaTypeFilter !== 'all') query.type = mediaTypeFilter;

    // HANDLE MULTI-CATEGORY SECTIONS
    if (category?.key?.startsWith(SUBJECT_CATEGORY)) {
      delete query.category;
      const subjects = isArray(category.id) ? category.id : [category.id];
      query.subjects = JSON.stringify(subjects);
    }

    if (category?.key === SHARED_CATEGORY) {
      delete query.category;
      query.onlyShared = true;
    }
    if (category?.key === RECENT_CATEGORY) {
      query.roles = JSON.stringify(['owner']);
      query.hideCoverAssets = true;
      delete query.category;
      if (categoryFilter !== 'all') {
        query.categoryFilter = find(categories, { key: categoryFilter })?.id;
      }
    }
    if (category?.key === PINS_CATEGORY) {
      delete query.category;
      if (categoryFilter !== 'all') {
        query.categoryFilter = find(categories, { key: categoryFilter })?.id;
      }
    }

    return query;
  }, [category, searchCriteria, statusFilter, categoryFilter, mediaTypeFilter, academicFilters]);

  const { data: assetList, isLoading: assetListIsLoading } = useSimpleAssetList({
    query: assetListQuery,
    enabled: !!assetListQuery,
  });

  const { items: currentPageAssets } = useMemo(
    () =>
      getPageItems({
        data: assetList,
        page: page - 1,
        size: pageSize,
      }),
    [assetList, page, pageSize]
  );

  const { data: assetsDetails, isLoading: assetsDetailsAreLoading } = useAssetsDetails({
    ids: currentPageAssets?.map((item) => item.asset),
    filters: {
      published: allowStatusFilter ? statusFilter : true,
      showPublic: category?.key === PINS_CATEGORY,
      onlyPinned: category?.key === PINS_CATEGORY,
    },
    options: {
      enabled: !isEmpty(assetList) && !assetListIsLoading,
    },
  });

  const lastNotEmptyPage = useMemo(() => {
    const currentPage = page;

    if (currentPageAssets?.length) return currentPage;
    if (currentPage > 1) return currentPage - 1;
    return null;
  }, [currentPageAssets, page]);

  function handleRefresh() {
    queryClient.invalidateQueries(allGetSimpleAssetListKey);
    queryClient.invalidateQueries(allGetAssetsKey);
    setIsDrawerOpen(false);
  }

  // Invalidate all queries when the component unmounts
  useEffect(
    () => () => {
      queryClient.invalidateQueries(allGetSimpleAssetListKey);
      queryClient.invalidateQueries(allGetAssetsKey);
    },
    []
  );

  // -------------------------------------------------------------------------------------
  // DATA GETTERS

  const getCategoriesSelectData = useMemo(() => {
    const filteredCategories = categories
      ?.filter((item) =>
        Array.isArray(allowCategoryFilter) ? allowCategoryFilter.includes(item.key) : true
      )
      .map((item) => ({
        value: item.key,
        label: item.name,
        icon: (
          <Box style={{ height: 16, marginBottom: 5 }}>
            <ImageLoader src={item.icon} style={{ width: 16, height: 16, position: 'relative' }} />
          </Box>
        ),
      }));
    return [{ label: t('labels.allResourceTypes'), value: 'all' }, ...filteredCategories];
  }, [allowCategoryFilter, categories, t]);

  const getMediaTypeSelectData = useMemo(() => {
    if (!mediaTypes?.length) return null;
    return [{ label: t('labels.allResourceTypes'), value: 'all' }, ...mediaTypes];
  }, [mediaTypes, t]);

  const getStatusSelectData = useMemo(() => {
    if (!allowStatusFilter) return null;
    return [
      { label: t('labels.assetStatusAll'), value: 'all' },
      { label: t('labels.assetStatusPublished'), value: 'published' },
      { label: t('labels.assetStatusDraft'), value: 'draft' },
    ];
  }, [allowStatusFilter, t]);

  const getEmptyState = () => {
    if (searchCriteriaDebounced && !isEmpty(searchCriteriaDebounced)) {
      return <SearchEmpty t={t} />;
    }

    return null;
  };
  // -------------------------------------------------------------------------------------
  // DRAWER HANDLERS & TOOLBAR
  const toolbarItems = useMemo(() => {
    const published = allowStatusFilter ? statusFilter : true;

    return {
      edit: selectedAsset?.editable ? t('cardToolbar.edit') : false,
      duplicate: selectedAsset?.duplicable ? t('cardToolbar.duplicate') : false,
      download: selectedAsset?.downloadable ? t('cardToolbar.download') : false,
      delete: selectedAsset?.deleteable ? t('cardToolbar.delete') : false,
      share: selectedAsset?.shareable ? t('cardToolbar.share') : false,
      assign: isTeacher && selectedAsset?.assignable ? t('cardToolbar.assign') : false,
      pin:
        !selectedAsset?.pinned && selectedAsset?.pinneable && published
          ? t('cardToolbar.pin')
          : false,
      unpin: selectedAsset?.pinned ? t('cardToolbar.unpin') : false,
      toggle: t('cardToolbar.toggle'),
    };
  }, [selectedAsset, t, isTeacher, allowStatusFilter, statusFilter]);

  // -------------------------------------------------------------------------------------
  // EMPTY STATE

  const userIsFilteringOrSearching = useCallback(() => {
    const isSearchingByCriteria = searchCriteriaDebounced?.length > 0;
    const isFilteringByStatus = statusFilter?.length && statusFilter !== 'all';
    const isFilteringByAcademicFilters = academicFilters && academicFilters?.program?.length > 0;
    const isFilteringByMediaType = mediaTypeFilter?.length && mediaTypeFilter !== 'all';
    const isFiltering =
      isFilteringByStatus || isFilteringByAcademicFilters || isFilteringByMediaType;

    return isSearchingByCriteria || isFiltering;
  }, [statusFilter, academicFilters, mediaTypeFilter, searchCriteriaDebounced]);

  const showFilteringEmptyState = useMemo(() => {
    const isNotLoading = !assetListIsLoading;
    if (isNotLoading && isEmpty(assetList)) {
      return userIsFilteringOrSearching();
    }
    return false;
  }, [assetListIsLoading, assetList, userIsFilteringOrSearching]);

  // -------------------------------------------------------------------------------------
  // FUNCTIONS FOR USER ACTIONS

  async function duplicateAsset(id) {
    setAppLoading(true);
    try {
      const response = await duplicateAssetRequest(id);
      if (response?.asset) {
        setAppLoading(false);
        addSuccessAlert(t('labels.duplicateSuccess'));
        handleRefresh();
      }
    } catch (err) {
      setAppLoading(false);
      addErrorAlert(getErrorMessage(err));
    }
  }

  async function deleteAsset(id) {
    setAppLoading(true);
    try {
      await deleteAssetRequest(id);
      setAppLoading(false);
      addSuccessAlert(t('labels.removeSuccess'));
      setSelectedAsset(null);
      handleRefresh();
    } catch (err) {
      setAppLoading(false);
      addErrorAlert(getErrorMessage(err));
    }
  }

  async function pinAsset(item) {
    try {
      await pinAssetRequest(item.id);
      // It is needed to invalidate all queries here as the effect needs to be seen in every section of the library
      queryClient.invalidateQueries(allGetSimpleAssetListKey);
      queryClient.invalidateQueries(allGetAssetsKey);
    } catch (err) {
      addErrorAlert(getErrorMessage(err));
    }
  }

  async function unpinAsset(item) {
    try {
      await unpinAssetRequest(item.id);
      // It is needed to invalidate all queries here as the effect needs to be seen in every section of the library
      queryClient.invalidateQueries(allGetSimpleAssetListKey);
      queryClient.invalidateQueries(allGetAssetsKey);
    } catch (err) {
      addErrorAlert(getErrorMessage(err));
    }
  }

  // -------------------------------------------------------------------------------------
  // HANDLERS

  const handleOnSelect = (item) => {
    onSelect(item);
    setIsDrawerOpen(true);
  };

  const handleOnDuplicate = (item) => {
    openConfirmationModal({
      onConfirm: () => duplicateAsset(item.id),
    })();
  };

  const handleOnAssign = (item) => {
    history.push(`/private/leebrary/assign/${item.id}`);
  };

  const handleOnDelete = (item) => {
    openDeleteConfirmationModal({
      onConfirm: () => deleteAsset(item.id),
    })();
  };

  const handleOnEdit = (item) => {
    setIsDrawerOpen(false);
    onEditItem(item);
  };

  const handleOnShare = (item) => {
    setItemToShare(item);
  };

  function handleOnPin(item) {
    pinAsset(item);
  }

  const handleOnUnpin = (item) => {
    unpinAsset(item);
  };

  function handleOnDownload(item) {
    window.open(item.url, '_blank', 'noopener');
  }

  function handleOnNew() {
    if (!isEmpty(category?.createUrl)) {
      const newURL = new URL(category.createUrl, window?.location);
      newURL.searchParams.set('from', 'leebrary');
      history.push(newURL.href.substring(newURL.origin.length));
    } else {
      newAsset(null, category);
    }
  }

  // -------------------------------------------------------------------------------------
  // EFFECTS

  // Every new query should reset the page to one.
  useEffect(() => {
    setPage(1);
  }, [category, searchCriteria, statusFilter, categoryFilter, mediaTypeFilter, academicFilters]);

  // DELETE operations may leave the current page empty
  // Page is set to the last valid page if the current page isn't
  useEffect(() => {
    if (lastNotEmptyPage) {
      setPage(lastNotEmptyPage);
    }
  }, [lastNotEmptyPage]);

  useEffect(() => {
    setIsDrawerOpen(false);
  }, [category]);

  useEffect(() => {
    if (!assetsDetailsAreLoading) {
      if (!assetListIsLoading) setCardDetailIsLoading(false);
    } else {
      setCardDetailIsLoading(true);
    }
  }, [assetListIsLoading, assetsDetailsAreLoading]);

  // If needed, the selected asset must be fetched. When the user pastes a url with an asset id as the open parameter the asset must be loaded
  useEffect(() => {
    if (asset?.id) {
      setSelectedAsset(asset);
    } else if (typeof asset === 'string' && asset.length) {
      const loadedAsset = find(pageAssetsData?.items, { id: asset });
      if (loadedAsset) setSelectedAsset(loadedAsset);
    } else {
      setSelectedAsset(null);
    }
  }, [asset, pageAssetsData]);

  // OnSearch: Wait for the debounced search critera and then call the onSearch function
  useEffect(() => {
    onSearch(searchCriteriaDebounced);
  }, [searchCriteriaDebounced]);

  // Set data for the PaginatedList component and pagination settings
  useEffect(() => {
    if (!assetListIsLoading) {
      const searchingOrFiltering = userIsFilteringOrSearching();
      const shouldInsertNewItem =
        !NOT_CREATABLE_CATEGORIES.some((catKey) => category?.key?.startsWith(catKey)) &&
        !searchingOrFiltering;

      if (shouldInsertNewItem) setPageSize(11);
      else setPageSize(12);

      if (assetList?.length) {
        const paginated = handlePaginationAndDetailsLoad({
          assetList,
          pageSize,
          shouldInsertNewItem,
          assetsDetails,
          page,
        });
        setPageAssetsData(cloneDeep(paginated));
      } else {
        const emptyData = handlePaginationAndEmptyAssetList({ shouldInsertNewItem });
        setPageAssetsData(cloneDeep(emptyData));
      }
    }
  }, [
    assetList,
    assetListIsLoading,
    assetsDetails,
    assetsDetailsAreLoading,
    category?.key,
    userIsFilteringOrSearching,
  ]);

  // -------------------------------------------------------------------------------------
  // PAGE STYLES & PAGINATED LIST PROPS

  const columns = useMemo(() => {
    const published = allowStatusFilter ? statusFilter : true;
    return [
      {
        Header: t('tableLabels.name'),
        accessor: 'name',
        valueRender: (_, row) => <LibraryItem asset={prepareAsset(row, published)} />,
      },
      {
        Header: t('tableLabels.owner'),
        accessor: 'owner',
        valueRender: (_, row) => getOwner(row),
      },
      {
        Header: t('tableLabels.updated'),
        accessor: 'updated',
        valueRender: (_, row) => <LocaleDate date={row.updatedAt} />,
      },
    ];
  }, [t, allowStatusFilter]);

  const cardVariant = useMemo(() => {
    const categoryKey = category?.key;
    return categoryKey === 'bookmarks' ? 'bookmark' : 'media';
  }, [category]);

  const offsets = childRef.current?.getBoundingClientRect() || childRect;
  const headerOffset = Math.round(offsets.top + childRect.height + childRect.top);
  const paginatedListProps = useMemo(
    () => ({
      itemRender: (p) => (
        <Box>
          {p?.item?.original?.action === 'new' ? (
            <NewLibraryCardButton categoryLabel={category?.singularName} onClick={handleOnNew} />
          ) : (
            <CardWrapper
              {...p}
              variant={cardVariant}
              category={
                categories?.find((_category) => _category.id === p.item.original.category) || {
                  key: 'media-file',
                }
              }
              realCategory={category}
              published={allowStatusFilter ? statusFilter : true}
              isEmbedded={true}
              isEmbeddedList={false}
              onRefresh={handleRefresh}
              onDuplicate={handleOnDuplicate}
              onDelete={handleOnDelete}
              onEdit={handleOnEdit}
              onShare={handleOnShare}
              onPin={handleOnPin}
              onUnpin={handleOnUnpin}
              onDownload={handleOnDownload}
              locale={locale}
              assetsLoading={cardDetailIsLoading}
            />
          )}
        </Box>
      ),
      itemMinWidth: '300px',
      staticColumnWidth: true,
      margin: 16,
      spacing: 4,
      paperProps: { shadow: 'none', padding: 0 },
    }),
    [category, categories, pageAssetsData?.items, cardDetailIsLoading]
  );

  return (
    <>
      <TotalLayoutContainer
        scrollRef={scrollRef}
        Header={
          <Stack
            data-cypress-id="search-asset"
            ref={childRef}
            fullWidth
            skipFlex
            spacing={4}
            padding={0}
            style={{
              flex: 0,
              alignItems: 'end',
              padding: '16px 24px',
              height: '72px',
              backgroundColor: 'white',
            }}
          >
            {/* FILTERS ········· */}
            {allowSearchByCriteria && (
              <SearchInput
                placeholder={t('labels.searchPlaceholder')}
                value={searchCriteria}
                onChange={(value) => setTempSearchCriteria(value)}
                disabled={assetListIsLoading || assetsDetailsAreLoading}
              />
            )}
            {!!filterComponents && filterComponents({ loading: assetListIsLoading })}
            {!isEmpty(mediaTypes) && allowMediaTypeFilter && (
              <Select
                data-cypress-id="search-asset-type-selector"
                data={getMediaTypeSelectData}
                value={mediaTypeFilter}
                onChange={onMediaTypeChange}
                placeholder={t('labels.resourceTypes')}
                disabled={assetListIsLoading || assetsDetailsAreLoading}
                skipFlex
              />
            )}
            {allowCategoryFilter && (
              <Select
                data={getCategoriesSelectData}
                onChange={onCategoryFilter}
                value={categoryFilter}
                placeholder={t('labels.resourceTypes')}
                disabled={assetListIsLoading || assetsDetailsAreLoading}
                skipFlex
              />
            )}
            {allowStatusFilter && (
              <Select
                data={getStatusSelectData}
                onChange={onStatusChange}
                value={statusFilter}
                placeholder={t('labels.assetStatus')}
                disabled={
                  assetListIsLoading ||
                  assetsDetailsAreLoading ||
                  ['media-files', 'bookmarks'].includes(categoryFilter)
                }
                skipFlex
              />
            )}
          </Stack>
        }
      >
        {/* PAGINATED LIST ········· */}
        <Stack
          ref={scrollRef}
          fullHeight
          style={{
            width: ' 100%',
            transition: 'width 0.3s ease',
            padding: '0 24px',
            overflow: 'auto',
          }}
        >
          <Box
            sx={(theme) => ({
              flex: 1,
              position: 'relative',
              marginTop: 24,
              paddingRight: theme.spacing[5],
              paddingLeft: theme.spacing[5],
            })}
          >
            <LoadingOverlay
              visible={assetListIsLoading}
              overlayOpacity={0}
              style={{ height: '100%' }}
            />
            {pageAssetsData?.items?.length && (
              <Box
                sx={(theme) => ({
                  paddingBottom: theme.spacing[5],
                  backgroundColor: '#f7f8fa',
                  width: '100%',
                })}
              >
                <PaginatedList
                  data-cypress-id="paginated-asset-list"
                  {...pageAssetsData}
                  {...paginatedListProps}
                  paperProps={{ color: 'none', shadow: 'none', padding: 0 }}
                  selectable
                  selected={selectedAsset}
                  columns={columns}
                  layout="grid"
                  page={page}
                  size={pageSize}
                  sizes={[12, 18, 24]}
                  labels={{
                    show: t('show'),
                    goTo: t('goTo'),
                  }}
                  onSelect={handleOnSelect}
                  onPageChange={(value) => {
                    setPage(value);
                  }}
                  onSizeChange={(value) => {
                    setPageSize(value);
                  }}
                />
              </Box>
            )}
            {!showFilteringEmptyState &&
              (!!pageAssetsData?.isEmpty || !pageAssetsData?.items?.length) && (
                <ListEmpty
                  t={t}
                  isRecentPage={category?.key === RECENT_CATEGORY}
                  category={category}
                  key={category?.key}
                />
              )}
            {showFilteringEmptyState && (
              <Stack justifyContent="center" alignItems="center" fullWidth fullHeight>
                {getEmptyState()}
              </Stack>
            )}
          </Box>
        </Stack>

        {/* SIDE PANEL ········· */}
        <Box
          sx={(theme) => ({
            position: 'fixed',
            height: `calc(100% - ${headerOffset + theme.spacing[5]}px)`,
            right: 0,
            top: headerOffset + theme.spacing[5],
            zIndex: 99,
          })}
        >
          <Drawer
            opened={isDrawerOpen}
            size="496px"
            close={false}
            empty={true}
            className={{
              root: { borderRadius: 0, border: 'none !important' },
              body: { borderRadius: 0, border: 'none !important' },
            }}
          >
            <CardDetailWrapper
              category={
                category?.id && !category?.key?.startsWith(SUBJECT_CATEGORY)
                  ? category
                  : categories?.find((_category) => _category?.id === selectedAsset?.category)
              }
              asset={selectedAsset}
              labels={detailLabels}
              variant={cardVariant}
              open={isDrawerOpen}
              toolbarItems={toolbarItems}
              onToggle={() => setIsDrawerOpen(!isDrawerOpen)}
              onDuplicate={handleOnDuplicate}
              onDelete={handleOnDelete}
              onEdit={handleOnEdit}
              onShare={handleOnShare}
              onPin={handleOnPin}
              onUnpin={handleOnUnpin}
              onRefresh={handleRefresh}
              onDownload={handleOnDownload}
              onAssign={handleOnAssign}
              onCloseDrawer={() => {
                forgetAssetToOpen();
                setIsDrawerOpen(false);
              }}
              onOpenDrawer={() => setIsDrawerOpen(true)}
              locale={locale}
            />
          </Drawer>
        </Box>
      </TotalLayoutContainer>
      <PermissionsDataDrawer
        size={720}
        hasBack={false}
        opened={!!itemToShare}
        asset={itemToShare}
        sharing={true}
        onNext={() => {
          setItemToShare(false);
          handleRefresh();
        }}
        onClose={() => {
          setItemToShare(false);
        }}
      />
    </>
  );
};

AssetList.propTypes = {
  categories: PropTypes.array,
  category: PropTypes.object,
  asset: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  onSelect: PropTypes.func,
  allowSearchByCriteria: PropTypes.bool,
  searchCriteria: PropTypes.string,
  onSearch: PropTypes.func,
  allowStatusFilter: PropTypes.bool,
  statusFilter: PropTypes.string,
  onStatusChange: PropTypes.func,
  allowCategoryFilter: PropTypes.oneOfType([PropTypes.bool, PropTypes.array]),
  categoryFilter: PropTypes.string,
  onCategoryFilter: PropTypes.func,
  allowMediaTypeFilter: PropTypes.bool,
  mediaTypes: PropTypes.array,
  mediaTypeFilter: PropTypes.string,
  onMediaTypeChange: PropTypes.func,
  filterComponents: PropTypes.array,
  onEditItem: PropTypes.func,
  filters: PropTypes.object,
  allowAcademicFilter: PropTypes.bool,
  forgetAssetToOpen: PropTypes.func,
};

export default AssetList;
export { AssetList };
