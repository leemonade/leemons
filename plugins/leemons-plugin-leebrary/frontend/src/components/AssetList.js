import React, { useEffect, useMemo, useState } from 'react';
import { find, forEach, isArray, isEmpty, isNil } from 'lodash';
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
import { LibraryItem } from '@leebrary/components/LibraryItem';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { useSession } from '@users/session';
import { useLayout } from '@layout/context';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { LocaleDate, unflatten, useRequestErrorMessage } from '@common';
import useSimpleAssetList from '@leebrary/request/hooks/queries/useSimpleAssetList';
import { useAssets as useAssetsDetails } from '@leebrary/request/hooks/queries/useAssets';
import getPageItems from '@leebrary/helpers/getPageItems';
import {
  deleteAssetRequest,
  duplicateAssetRequest,
  pinAssetRequest,
  unpinAssetRequest,
} from '@leebrary/request';
import {
  allGetSimpleAssetListKey,
  getSimpleAssetListKey,
} from '@leebrary/request/hooks/keys/simpleAssetList';

import prefixPN from '../helpers/prefixPN';
import { CardDetailWrapper } from './CardDetailWrapper';
import { CardWrapper } from './CardWrapper';
import { ListEmpty } from './ListEmpty';
import { SearchEmpty } from './SearchEmpty';
import { prepareAsset } from '../helpers/prepareAsset';
import { PermissionsDataDrawer } from './AssetSetup/PermissionsDataDrawer';
import { allGetAssetsKey } from '@leebrary/request/hooks/keys/assets';

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

const AssetList = ({
  categories = [],
  category,
  asset,
  onSelect,
  allowSearchByCriteria,
  searchCriteria,
  onSearch,
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
  // Setup && States
  const session = useSession();
  const locale = getLocale(session);
  const [t, translations] = useTranslateLoader(prefixPN('list'));
  const [, , , getErrorMessage] = useRequestErrorMessage();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [itemToShare, setItemToShare] = React.useState(null);
  const [tempSearchCriteria, setTempSearchCriteria] = useState(searchCriteria);
  const [searchCriteriaDebounced] = useDebouncedValue(tempSearchCriteria, 300);
  const [pageAssetsData, setPageAssetsData] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [cardDetailIsLoading, setCardDetailIsLoading] = React.useState(false);

  const detailLabels = useMemo(() => {
    if (!isEmpty(translations)) {
      const items = unflatten(translations.items);
      return items.leebrary.list.labels;
    }
    return {};
  }, [JSON.stringify(translations)]);

  const scrollRef = React.useRef();
  const [childRef, childRect] = useResizeObserver();

  const {
    openConfirmationModal,
    openDeleteConfirmationModal,
    setLoading: setAppLoading,
  } = useLayout();

  // -------------------------------------------------------------------------------------
  // QUERY HOOKS

  const queryClient = useQueryClient();
  const assetListQuery = useMemo(() => {
    const waitForAcademicFilters = allowAcademicFilter && !academicFilters;
    if (!category || waitForAcademicFilters) return null;

    const query = {
      providerQuery: academicFilters ? JSON.stringify(academicFilters) : null,
      criteria: searchCriteria || '',
      pinned: category?.key === 'pins',
      category: category?.id,
      published: allowStatusFilter ? statusFilter : true,
      showPublic: category?.key === 'pins',
      preferCurrent: true,
    };

    if (allowMediaTypeFilter && mediaTypeFilter !== 'all') query.type = mediaTypeFilter;

    if (category?.key.startsWith('leebrary-subject')) {
      delete query.category;
      const subjects = isArray(category.id) ? category.id : [category.id];
      query.subjects = JSON.stringify(subjects);
    }

    // HANDLE MULTI-CATEGORY SECTIONS
    if (category?.key === 'leebrary-shared') {
      delete query.category;
      query.onlyShared = true;
    }
    if (category?.key === 'leebrary-recent') {
      query.roles = JSON.stringify(['owner']);
      delete query.category;
      if (categoryFilter !== 'all') {
        query.categoryFilter = find(categories, { key: categoryFilter })?.id;
      }
    }
    if (category?.key === 'pins') {
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

  const {
    data: assetsDetails,
    isLoading: assetsDetailsAreLoading,
    isError: assetsDetailsError,
  } = useAssetsDetails({
    ids: currentPageAssets?.map((item) => item.asset),
    filters: {
      published: allowStatusFilter ? statusFilter : true,
      showPublic: category?.key === 'pins',
      onlyPinned: category?.key === 'pins',
    },
    options: {
      enabled: !isEmpty(assetList) && !assetListIsLoading,
    },
  });

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
    return [{ label: t('labels.resourceTypes'), value: 'all' }, ...filteredCategories];
  }, [allowCategoryFilter, categories, t]);

  const getMediaTypeSelectData = useMemo(() => {
    if (!mediaTypes?.length) return null;
    return [{ label: t('labels.resourceTypes'), value: 'all' }, ...mediaTypes];
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

    return <ListEmpty t={t} isRecentPage={category?.key === 'leebrary-recent'} />;
  };

  // -------------------------------------------------------------------------------------
  // DRAWER HANDLERS & TOOLBAR

  const showDrawer = useMemo(() => {
    if (!assetListIsLoading && !isNil(selectedAsset) && !isEmpty(selectedAsset)) {
      setIsDrawerOpen(true);
    } else {
      setIsDrawerOpen(false);
    }

    return !assetListIsLoading && !isNil(selectedAsset) && !isEmpty(selectedAsset);
  }, [assetListIsLoading, selectedAsset, isDetailOpen]);

  const toggleDetail = (val) => {
    if (!val) {
      setTimeout(() => {
        setIsDetailOpen(val);
      }, 10);
    } else {
      setTimeout(() => {
        setIsDetailOpen(val);
      }, 500);
    }
  };

  useEffect(() => {
    toggleDetail(showDrawer);
  }, [showDrawer]);

  useEffect(() => {
    if (!isNil(selectedAsset) && !isEmpty(selectedAsset)) {
      toggleDetail(true);
    }
  }, [selectedAsset]);

  const toolbarItems = useMemo(() => {
    const published = allowStatusFilter ? statusFilter : true;

    return {
      edit: selectedAsset?.editable ? t('cardToolbar.edit') : false,
      duplicate: selectedAsset?.duplicable ? t('cardToolbar.duplicate') : false,
      download: selectedAsset?.downloadable ? t('cardToolbar.download') : false,
      delete: selectedAsset?.deleteable ? t('cardToolbar.delete') : false,
      share: selectedAsset?.shareable ? t('cardToolbar.share') : false,
      pin:
        !selectedAsset?.pinned && selectedAsset?.pinneable && published
          ? t('cardToolbar.pin')
          : false,
      unpin: selectedAsset?.pinned ? t('cardToolbar.unpin') : false,
      toggle: t('cardToolbar.toggle'),
    };
  }, [selectedAsset, category, t]);

  // -------------------------------------------------------------------------------------
  // FUNCTIONS FOR USER ACTIONS

  async function duplicateAsset(id) {
    setAppLoading(true);
    try {
      const response = await duplicateAssetRequest(id);
      if (response?.asset) {
        setAppLoading(false);
        addSuccessAlert(t('labels.duplicateSuccess'));
        queryClient.invalidateQueries(getSimpleAssetListKey({ query: assetListQuery }));
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
      queryClient.invalidateQueries(getSimpleAssetListKey({ query: assetListQuery }));
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
    if (isDrawerOpen) {
      setIsDetailOpen(false);
    } else {
      setIsDetailOpen(true);
    }
    onSelect(item);
  };

  const handleOnDuplicate = (item) => {
    openConfirmationModal({
      onConfirm: () => duplicateAsset(item.id),
    })();
  };

  const handleOnDelete = (item) => {
    openDeleteConfirmationModal({
      onConfirm: () => deleteAsset(item.id),
    })();
  };

  const handleOnEdit = (item) => {
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

  function handleRefresh() {
    queryClient.invalidateQueries(allGetSimpleAssetListKey);
    queryClient.invalidateQueries(allGetAssetsKey);
  }

  // -------------------------------------------------------------------------------------
  // EFFECTS

  // Every new query should reset the page to one.
  useEffect(() => {
    setPage(1);
  }, [category, searchCriteria, statusFilter, categoryFilter, mediaTypeFilter, academicFilters]);

  useEffect(() => {
    if (!assetsDetailsAreLoading) {
      setTimeout(() => {
        if (!assetListIsLoading) setCardDetailIsLoading(false);
      }, 1000);
    } else {
      setCardDetailIsLoading(true);
    }
  }, [assetListIsLoading, assetsDetailsAreLoading]);

  // If needed, the selected asset must be fetched. When the user pastes a url with a valid open parameter the asset must be loaded
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

  // SET THE DATA PASSED TO THE PAGINATED LIST COMPONENT
  useEffect(() => {
    if (assetsDetails && !isEmpty(assetsDetails)) {
      const paginated = getPageItems({
        data: assetList,
        page: page - 1,
        size: pageSize,
      });

      paginated.items = assetsDetails || [];
      forEach(paginated.items, (item) => {
        if (item.file?.metadata?.indexOf('pathsInfo')) {
          // eslint-disable-next-line no-param-reassign
          item.file.metadata = JSON.parse(item.file.metadata);
          // eslint-disable-next-line no-param-reassign
          delete item.file.metadata.pathsInfo;
          // eslint-disable-next-line no-param-reassign
          item.file.metadata = JSON.stringify(item.file.metadata);
        }
      });
      paginated.page += 1;
      setPageAssetsData({ ...paginated });
    } else {
      setPageAssetsData(null);
    }
  }, [assetsDetails, assetsDetailsError]);

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
                disabled={assetListIsLoading || assetsDetailsAreLoading}
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
            {!isEmpty(assetList) && pageAssetsData?.items?.length && (
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
                  loading={assetsDetailsAreLoading}
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
            {!assetListIsLoading && isEmpty(assetList) && !assetsDetailsAreLoading && (
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
              category={category || {}}
              asset={selectedAsset}
              labels={detailLabels}
              variant={cardVariant}
              open={isDrawerOpen}
              toolbarItems={toolbarItems}
              onToggle={() => toggleDetail(!isDrawerOpen)}
              onDuplicate={handleOnDuplicate}
              onDelete={handleOnDelete}
              onEdit={handleOnEdit}
              onShare={handleOnShare}
              onPin={handleOnPin}
              onUnpin={handleOnUnpin}
              onRefresh={handleRefresh}
              onDownload={handleOnDownload}
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
