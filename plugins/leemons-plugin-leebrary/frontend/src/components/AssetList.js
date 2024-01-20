/* eslint-disable no-param-reassign */
/* eslint-disable no-nested-ternary */
import {
  Box,
  ImageLoader,
  LoadingOverlay,
  PaginatedList,
  RadioGroup,
  SearchInput,
  Select,
  Stack,
  useDebouncedValue,
  useResizeObserver,
  Drawer,
  TotalLayoutContainer,
} from '@bubbles-ui/components';
import { LayoutHeadlineIcon, LayoutModuleIcon } from '@bubbles-ui/icons/solid';
import { LibraryItem } from '@leebrary/components/LibraryItem';
import { LocaleDate, unflatten, useRequestErrorMessage } from '@common';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { useLayout } from '@layout/context';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { useSession } from '@users/session';
import { find, forEach, isArray, isEmpty, isFunction, isNil, isString, noop, uniqBy } from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { allAssetsKey } from '@leebrary/request/hooks/keys/assets';

import { getPageItems } from '../helpers/getPageItems';
import prefixPN from '../helpers/prefixPN';
import { prepareAsset } from '../helpers/prepareAsset';
import { prepareAssetType } from '../helpers/prepareAssetType';
import {
  deleteAssetRequest,
  duplicateAssetRequest,
  getAssetsByIdsRequest,
  getAssetsRequest,
  getAssetTypesRequest,
  listCategoriesRequest,
  pinAssetRequest,
  unpinAssetRequest,
} from '../request';
import { PermissionsDataDrawer } from './AssetSetup/PermissionsDataDrawer';
import { AssetThumbnail } from './AssetThumbnail';
import { CardDetailWrapper } from './CardDetailWrapper';
import { CardWrapper } from './CardWrapper';
import { ListEmpty } from './ListEmpty';
import { SearchEmpty } from './SearchEmpty';
import { useAssetListStore } from '../hooks/useAssetListStore';
import { useAssets as useAssetsDetail } from '../request/hooks/queries/useAssets';

function getLocale(session) {
  return session ? session.locale : navigator?.language || 'en';
}

function getOwner(asset) {
  const owner = (asset?.canAccess || []).filter((person) =>
    person.permissions.includes('owner')
  )[0];
  return !isEmpty(owner) ? `${owner?.name} ${owner?.surnames}` : '-';
}

function AssetList({
  category: categoryProp,
  categories: categoriesProp,
  asset: assetProp,
  assetType: assetTypeProp,
  search: searchProp,
  layout: layoutProp,
  showPublic: showPublicProp,
  programs,
  subjects,
  canChangeLayout,
  canChangeType,
  canSearch,
  variant,
  onlyThumbnails,
  page: pageProp,
  pageSize,
  pageSizes,
  published,
  activeStatus,
  onSearch,
  pinned,
  paperProps,
  emptyComponent,
  itemMinWidth,
  searchEmptyComponent,
  preferCurrent,
  searchInProvider,
  roles,
  filters,
  filterComponents,
  allowStatusChange,
  allowCategoryFilter,
  onStatusChange = () => {},
  onSelectItem = () => {},
  onEditItem = () => {},
  onTypeChange = () => {},
  onLoading = () => {},
}) {
  const [cardDetailIsLoading, setCardDetailIsLoading] = React.useState(false);
  if (categoryProp?.key?.includes('leebrary-subject')) {
    // eslint-disable-next-line no-param-reassign
    subjects = isArray(categoryProp.id) ? categoryProp.id : [categoryProp.id];
  }

  const location = useLocation();

  const isPinsRoute = location.pathname.includes('pins');
  const [categoryFilter, setCategoryFilter] = React.useState(null);

  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  const queryClient = useQueryClient();
  const scrollRef = React.useRef();

  const multiCategorySections = ['pins', 'leebrary-recent', 'leebrary-shared']; // TODO save this in a constants file

  const initialState = {
    loading: true,
    category: categoryProp,
    categories: categoriesProp,
    categoryFilter: null,
    layout: layoutProp,
    asset: assetProp,
    page: pageProp || 1,
    size: pageSize,
    editingAsset: null,
    assets: [],
    assetTypes: [],
    assetType: assetTypeProp,
    openDetail: false,
    isDetailOpened: false,
    pageAssetsData: {},
    showPublic: showPublicProp,
    searchCriteria: searchProp,
    stateFilter: null,
  };

  const [store, setStoreValue] = useAssetListStore(initialState);

  const [t, translations] = useTranslateLoader(prefixPN('list'));
  const [, , , getErrorMessage] = useRequestErrorMessage();
  const [containerRef, containerRect] = useResizeObserver();
  const [childRef, childRect] = useResizeObserver();
  const {
    openConfirmationModal,
    openDeleteConfirmationModal,
    setLoading: setAppLoading,
  } = useLayout();
  const [searchDebounced] = useDebouncedValue(store.searchCriteria, 300);
  const session = useSession();
  const locale = getLocale(session);
  const showThumbnails = useMemo(
    () => onlyThumbnails && store.category?.key === 'media-files',
    [onlyThumbnails, store.category]
  );

  const isEmbedded = useMemo(() => variant === 'embedded', [variant]);

  const { items: currentPageAssets } = getPageItems({
    data: store.assets,
    page: store.page - 1,
    size: store.size,
  });

  const {
    data: assetsDetail,
    isLoading,
    isError,
  } = useAssetsDetail({
    ids: currentPageAssets.map((item) => item.asset),
    filters: {
      published,
      showPublic: !pinned ? store.showPublic : true,
      onlyPinned: isPinsRoute,
    },
    options: {
      enabled: !isEmpty(store.assets) && !store.loading,
    },
  });

  // ·········································································
  // DATA PROCESSING

  async function loadCategories(selectedCategoryKey) {
    const result = await listCategoriesRequest();
    const items = result.map((data) => ({
      ...data,
      icon: data.menuItem.iconSvg,
      name: data.menuItem.label,
    }));
    store.categories = items;
    setStoreValue('categories', items);
    if (!isEmpty(selectedCategoryKey))
      setStoreValue('category', find(items, { key: selectedCategoryKey }));
  }

  async function loadAssetTypes(categoryId) {
    try {
      const response = await getAssetTypesRequest(categoryId);
      const types = uniqBy(
        response.types.map((type) => ({
          label: prepareAssetType(type),
          value: prepareAssetType(type, false),
        })),
        'value'
      );
      setStoreValue('assetTypes', types);
    } catch (err) {
      addErrorAlert(getErrorMessage(err));
    }
  }

  function clearAssetLoading(delay = 500) {
    setTimeout(() => {
      setStoreValue('loading', false);
    }, delay);
  }

  async function loadAllAssetsIds(categoryId, criteria = '', type = '', _filters = null) {
    setStoreValue('loading', true);
    setStoreValue('asset', null);
    setStoreValue('page', 1);
    setStoreValue('assets', []);
    queryClient.invalidateQueries(allAssetsKey);

    try {
      const query = {
        providerQuery: _filters ? JSON.stringify(_filters) : null,
        category: categoryId,
        criteria,
        type,
        published,
        showPublic: !pinned ? store.showPublic : true,
        pinned,
        preferCurrent,
        searchInProvider,
        subjects: JSON.stringify(subjects ? (isArray(subjects) ? subjects : [subjects]) : null),
        programs: JSON.stringify(programs ? (isArray(programs) ? programs : [programs]) : null),
        roles: JSON.stringify(roles || []),
      };

      if (categoryProp?.key?.includes('leebrary-subject')) {
        delete query.category;
      }
      if (categoryProp?.key === 'leebrary-shared') {
        delete query.category;
        query.onlyShared = true;
      }

      if (categoryProp?.key === 'leebrary-recent') {
        query.roles = JSON.stringify(['owner']);
      }

      // TODO: Category filter should apply to leebrary-shared section as well
      if (
        multiCategorySections.includes(categoryProp?.key) &&
        categoryProp?.key !== 'leebrary-shared'
      ) {
        delete query.category;
        const activateCategoryFilter = categoryFilter && categoryFilter !== 'all';
        if (activateCategoryFilter) {
          const chosenCategory = find(store.categories, { key: categoryFilter });
          if (chosenCategory) query.categoryFilter = chosenCategory.id;
        }
      }

      const response = await getAssetsRequest(query);

      const results = response?.assets || [];
      setStoreValue('assets', uniqBy(results, 'asset'));
      if (isEmpty(results)) {
        setStoreValue('pageAssetsData', []);
      }
      clearAssetLoading();
    } catch (err) {
      clearAssetLoading();
      addErrorAlert(getErrorMessage(err));
    }
    return null;
  }

  async function loadAsset(id, forceLoad) {
    try {
      const item = find(store.pageAssetsData.items, { id });

      if (item && !forceLoad) {
        setStoreValue('asset', prepareAsset(item, published));
      } else {
        const response = await getAssetsByIdsRequest([id]);
        if (!isEmpty(response?.assets)) {
          const value = response.assets[0];

          setStoreValue('asset', prepareAsset(value, published));

          if (forceLoad && item) {
            const index = store.pageAssetsData.items.findIndex((i) => i.id === id);

            const newItems = [...store.pageAssetsData.items];
            newItems[index] = value;
            setStoreValue('pageAssetsData', { ...store.pageAssetsData, items: newItems });
          }
        } else {
          setStoreValue('asset', null);
        }
      }
    } catch (err) {
      addErrorAlert(getErrorMessage(err));
    }
  }

  function reloadAssets() {
    loadAllAssetsIds(store.category?.id, searchDebounced, store.assetType, filters);
  }

  async function duplicateAsset(id) {
    setAppLoading(true);
    try {
      const response = await duplicateAssetRequest(id);
      if (response?.asset) {
        setAppLoading(false);
        addSuccessAlert(t('labels.duplicateSuccess'));
        reloadAssets();
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
      setStoreValue('asset', null);
      reloadAssets();
    } catch (err) {
      setAppLoading(false);
      addErrorAlert(getErrorMessage(err));
    }
  }

  async function pinAsset(item) {
    try {
      await pinAssetRequest(item.id);
      loadAsset(item.id, true);
    } catch (err) {
      setAppLoading(false);
    }
  }

  async function unpinAsset(item) {
    try {
      await unpinAssetRequest(item.id);
      loadAsset(item.id, true);
    } catch (err) {
      addErrorAlert(getErrorMessage(err));
    }
  }

  // ·········································································
  // EFFECTS

  useEffect(() => {
    setStoreValue('size', pageSize);
  }, [JSON.stringify(pageSize)]);
  useEffect(() => {
    setStoreValue('page', pageProp || 1);
  }, [JSON.stringify(pageProp)]);
  useEffect(() => {
    setStoreValue('layout', layoutProp);
  }, [JSON.stringify(layoutProp)]);
  useEffect(() => {
    setStoreValue('categories', categoriesProp);
  }, [JSON.stringify(categoriesProp)]);
  useEffect(() => {
    setStoreValue('assetType', assetTypeProp);
  }, [JSON.stringify(assetTypeProp)]);
  useEffect(() => {
    setStoreValue('showPublic', showPublicProp);
  }, [JSON.stringify(showPublicProp)]);

  useEffect(() => {
    onLoading(store.loading);
  }, [store.loading]);

  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => {
        if (!store.loading) setCardDetailIsLoading(false);
      }, 1000);
    } else {
      setCardDetailIsLoading(true);
    }
  }, [isLoading, store.loading]);

  useEffect(() => {
    if (assetsDetail && !isEmpty(assetsDetail)) {
      const paginated = getPageItems({
        data: store.assets,
        page: store.page - 1,
        size: store.size,
      });

      paginated.items = assetsDetail || [];
      forEach(paginated.items, (item) => {
        if (item.file?.metadata?.indexOf('pathsInfo')) {
          item.file.metadata = JSON.parse(item.file.metadata);
          delete item.file.metadata.pathsInfo;
          item.file.metadata = JSON.stringify(item.file.metadata);
        }
      });
      paginated.page += 1;
      setStoreValue('pageAssetsData', paginated);
    } else {
      setStoreValue('pageAssetsData', []);
    }
  }, [assetsDetail, isError]);

  useEffect(() => {
    if (!isEmpty(assetProp?.id) && assetProp.id !== store.asset?.id) {
      setStoreValue('asset', assetProp);
    } else if (isString(assetProp) && assetProp !== store.asset?.id) {
      loadAsset(assetProp);
    } else {
      setStoreValue('asset', null);
    }
  }, [JSON.stringify(assetProp)]);

  useEffect(() => {
    // Setea la store.category en base al categoryProp
    // Si store.categories está vacío carga las categorías con loadCategories
    if (categoryProp?.id === null || !isEmpty(categoryProp?.id)) {
      setStoreValue('category', categoryProp);
    } else if (isString(categoryProp) && isEmpty(store.categories)) {
      loadCategories(categoryProp);
    } else if (isString(categoryProp) && !isEmpty(store.categories)) {
      setStoreValue('category', find(store.categories, { key: categoryProp }));
    }
  }, [JSON.stringify(categoryProp), store.categories]);

  useEffect(() => {
    if (!isEmpty(store.category?.id)) {
      loadAssetTypes(store.category.id);
    } else {
      setStoreValue('assetTypes', null);
    }
  }, [store.category, JSON.stringify(categoryProp)]);

  useEffect(() => {
    if (store.assetTypes && !isEmpty(store.assetTypes) && store.assetTypes[0].value !== '') {
      const label = t('labels.allResourceTypes');

      if (label !== t('labels.allResourceTypes')) {
        setStoreValue('assetTypes', [{ label, value: '' }, ...store.assetTypes]);
      }
    }
  }, [store.assetTypes, t]);

  useEffect(() => {
    if (isFunction(onSearch)) onSearch(searchDebounced);
  }, [searchDebounced]);

  useEffect(() => {
    if (
      !isEmpty(store.category?.id) ||
      pinned ||
      multiCategorySections.includes(store.category?.key)
    ) {
      loadAllAssetsIds(store.category?.id, searchProp, store.assetType, filters);
    }
  }, [
    searchProp,
    store.category,
    store.assetType,
    pinned,
    filters,
    published,
    categoryFilter,
    // JSON.stringify(categoryProp),
    // store.showPublic,
  ]);

  // ·········································································
  // HANDLERS

  function handleOnSelect(item) {
    if (store.isDetailOpened) {
      setStoreValue('isDetailOpened', false);
    } else {
      setStoreValue('isDetailOpened', true);
    }
    onSelectItem(item);
  }

  function handleOnDelete(item) {
    openDeleteConfirmationModal({
      onConfirm: () => deleteAsset(item.id),
    })();
  }

  function handleOnDuplicate(item) {
    openConfirmationModal({
      onConfirm: () => duplicateAsset(item.id),
    })();
  }

  function handleOnEdit(item) {
    setStoreValue('asset', item);
    onEditItem(item);
  }

  function handleOnShare(item) {
    setStoreValue('sharingItem', item);
  }

  function handleOnPin(item) {
    pinAsset(item);
  }

  function handleOnUnpin(item) {
    unpinAsset(item);
  }

  function handleOnDownload(item) {
    window.open(item.url, '_blank', 'noopener');
  }

  function handleOnTypeChange(type) {
    if (isEmbedded) {
      setStoreValue('assetType', type);
    }

    onTypeChange(type);
  }

  function handleOnChangeCategory(value) {
    setCategoryFilter(value);
  }

  // ·········································································
  // LABELS & STATIC

  const columns = useMemo(
    () => [
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
    ],
    [t]
  );

  const cardVariant = useMemo(() => {
    const categoryKey = store.category?.key;
    return categoryKey === 'bookmarks' ? 'bookmark' : 'media';
  }, [store.category]);

  const showDrawer = useMemo(() => {
    if (!store.loading && !isNil(store.asset) && !isEmpty(store.asset)) {
      setIsDrawerOpen(true);
    } else {
      setIsDrawerOpen(false);
    }

    return !store.loading && !isNil(store.asset) && !isEmpty(store.asset);
  }, [store.loading, store.asset, store.isDetailOpened]);

  const toggleDetail = useCallback(
    (val) => {
      if (!val) {
        setTimeout(() => {
          setStoreValue('isDetailOpened', val);
        }, 10);
        setTimeout(() => {
          setStoreValue('openDetail', val);
        }, 200); // 200
      } else {
        setTimeout(() => {
          setStoreValue('isDetailOpened', val);
        }, 500); // 500
        setTimeout(() => {
          setStoreValue('openDetail', val);
        }, 10);
      }
    },
    [setStoreValue]
  );

  useEffect(() => {
    toggleDetail(showDrawer);
  }, [showDrawer]);

  useEffect(() => {
    if (!isNil(store.asset) && !isEmpty(store.asset)) {
      toggleDetail(true);
    }
  }, [store.asset]);

  const offsets = childRef.current?.getBoundingClientRect() || childRect;
  const headerOffset = Math.round(offsets.top + childRect.height + childRect.top);
  const listProps = useMemo(() => {
    if (!showThumbnails && store.layout === 'grid') {
      return {
        itemRender: (p) => (
          <Box>
            <CardWrapper
              {...p}
              variant={cardVariant || 'media'}
              category={
                store.categories.find((category) => category.id === p.item.original.category) || {
                  key: 'media-file',
                }
              }
              realCategory={categoryProp}
              published={published}
              isEmbedded={isEmbedded}
              isEmbeddedList={false}
              onRefresh={reloadAssets}
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
      };
    }

    if (showThumbnails && store.layout === 'grid') {
      return {
        itemRender: (p) => <AssetThumbnail {...p} />,
        itemMinWidth: store.category?.key === 'media-files' ? 300 : itemMinWidth,
        margin: 16,
        spacing: 4,
        paperProps: { shadow: 'none', padding: 4 },
      };
    }

    return { paperProps };
  }, [
    store.layout,
    store.category,
    store.categories,
    store.pageAssetsData.items,
    categoryProp,
    isEmbedded,
    showThumbnails,
    cardDetailIsLoading,
  ]);

  const listLayouts = useMemo(
    () => [
      { value: 'grid', icon: <LayoutModuleIcon /> },
      { value: 'table', icon: <LayoutHeadlineIcon /> },
    ],
    []
  );

  const toolbarItems = useMemo(
    () => ({
      edit: store.asset?.editable ? t('cardToolbar.edit') : false,
      duplicate: store.asset?.duplicable ? t('cardToolbar.duplicate') : false,
      download: store.asset?.downloadable ? t('cardToolbar.download') : false,
      delete: store.asset?.deleteable ? t('cardToolbar.delete') : false,
      share: store.asset?.shareable ? t('cardToolbar.share') : false,
      pin: store.asset?.pinned
        ? false
        : store.asset?.pinneable && published
          ? t('cardToolbar.pin')
          : false,
      unpin: store.asset?.pinned ? t('cardToolbar.unpin') : false,
      toggle: t('cardToolbar.toggle'),
    }),
    [store.asset, store.category, JSON.stringify(translations)]
  );

  const detailLabels = useMemo(() => {
    if (!isEmpty(translations)) {
      const items = unflatten(translations.items);
      return items.leebrary.list.labels;
    }
    return {};
  }, [JSON.stringify(translations)]);

  const getEmptyState = () => {
    if (searchDebounced && !isEmpty(searchDebounced)) {
      return searchEmptyComponent || emptyComponent || <SearchEmpty t={t} />;
    }

    return (
      emptyComponent || <ListEmpty t={t} isRecentPage={categoryProp?.key === 'leebrary-recent'} />
    );
  };

  const listWidth = useMemo(
    () =>
      // if (store.openDetail && showDrawer) {
      //   return `calc(100% - ${DRAWER_WIDTH}px)`;
      // }

      // if (showDrawer) {
      //   return `calc(100% - 50px)`;
      // }

      '100%',
    [store.openDetail, showDrawer]
  );

  const categoriesSelectData = useMemo(() => {
    const filteredCategories = store.categories
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
  }, [allowCategoryFilter, store.categories]);

  // ·········································································
  // RENDER

  const childNotEmbeddedStyles = {
    flex: 0,
    alignItems: 'end',
    width: containerRect.width,
    top: containerRect.top,
    position: 'fixed',
    zIndex: 101,
    backgroundColor: '#fff',
  };

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
            padding={isEmbedded ? 0 : 4}
            style={
              isEmbedded
                ? {
                  flex: 0,
                  alignItems: 'end',
                  padding: '16px 24px',
                  height: '72px',
                  backgroundColor: 'white',
                }
                : childNotEmbeddedStyles
            }
          >
            <Stack fullWidth spacing={4}>
              {canSearch && (
                <SearchInput
                  variant={isEmbedded ? 'default' : 'filled'}
                  onChange={(e) => {
                    setStoreValue('searchCriteria', e);
                  }}
                  value={store.searchCriteria}
                  disabled={store.loading}
                  placeholder={t('labels.searchPlaceholder')}
                />
              )}
              {!!filterComponents && filterComponents({ loading: store.loading })}
              {!isEmpty(store.assetTypes) && canChangeType && (
                <Select
                  data-cypress-id="search-asset-type-selector"
                  data={store.assetTypes}
                  value={store.assetType}
                  onChange={handleOnTypeChange}
                  placeholder={t('labels.resourceTypes')}
                  disabled={store.loading}
                  skipFlex
                />
              )}
              {multiCategorySections.includes(categoryProp?.key) &&
                categoryProp.key !== 'leebrary-shared' && (
                  <Select
                    data={categoriesSelectData}
                    onChange={handleOnChangeCategory}
                    value={categoryFilter}
                    placeholder={t('labels.resourceTypes')}
                    disabled={store.loading}
                    skipFlex
                  />
                )}
              {allowStatusChange && (
                <Select
                  data={[
                    { label: t('labels.assetStatusAll'), value: 'all' },
                    { label: t('labels.assetStatusPublished'), value: 'published' },
                    { label: t('labels.assetStatusDraft'), value: 'draft' },
                  ]}
                  onChange={onStatusChange}
                  value={activeStatus}
                  placeholder={t('labels.assetStatus')}
                  disabled={store.loading}
                  skipFlex
                />
              )}
            </Stack>
            {canChangeLayout && (
              <Box skipFlex>
                <RadioGroup
                  data={listLayouts}
                  variant="icon"
                  size="xs"
                  value={store.layout}
                  onChange={(e) => {
                    setStoreValue('layout', e);
                  }}
                />
              </Box>
            )}
          </Stack>
        }
      >
        {/* PAGINATED LIST ········· */}
        <Stack
          ref={scrollRef}
          fullHeight
          style={{
            marginTop: !isEmbedded && headerOffset,
            width: listWidth,
            transition: 'width 0.3s ease',
            padding: '0 24px',
            overflow: 'auto',
          }}
        >
          <Box
            sx={(theme) => ({
              flex: 1,
              position: 'relative',
              marginTop: theme.spacing[5],
              paddingRight: !isEmbedded && theme.spacing[5],
              paddingLeft: !isEmbedded && theme.spacing[5],
            })}
          >
            <LoadingOverlay visible={store.loading} overlayOpacity={0} style={{ height: '100%' }} />

            {!store.loading && !isEmpty(store.assets) && (
              <Box
                sx={(theme) => ({
                  paddingBottom: theme.spacing[5],
                  backgroundColor: '#f7f8fa',
                  width: '100%',
                })}
              >
                <PaginatedList
                  data-cypress-id="paginated-asset-list"
                  {...store.pageAssetsData}
                  {...listProps}
                  paperProps={paperProps}
                  selectable
                  selected={store.asset}
                  columns={columns}
                  loading={isLoading}
                  layout={store.layout}
                  page={store.page}
                  size={store.size}
                  sizes={pageSizes}
                  labels={{
                    show: t('show'),
                    goTo: t('goTo'),
                  }}
                  onSelect={handleOnSelect}
                  onPageChange={(e) => {
                    setStoreValue('page', e);
                  }}
                  onSizeChange={(e) => {
                    setStoreValue('size', e);
                  }}
                />
              </Box>
            )}
            {!store.loading && isEmpty(store.assets) && !isLoading && (
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
              category={store.category || {}}
              asset={store.asset}
              labels={detailLabels}
              variant={cardVariant}
              open={store.isDetailOpened}
              toolbarItems={toolbarItems}
              onToggle={() => toggleDetail(!store.isDetailOpened)}
              onDuplicate={handleOnDuplicate}
              onDelete={handleOnDelete}
              onEdit={handleOnEdit}
              onShare={handleOnShare}
              onPin={handleOnPin}
              onUnpin={handleOnUnpin}
              onRefresh={reloadAssets}
              onDownload={handleOnDownload}
              onCloseDrawer={() => setIsDrawerOpen(false)}
              onOpenDrawer={() => setIsDrawerOpen(true)}
              locale={locale}
            />
          </Drawer>
        </Box>
      </TotalLayoutContainer>
      <PermissionsDataDrawer
        size={720}
        hasBack={false}
        opened={!!store.sharingItem}
        asset={store.sharingItem}
        sharing={true}
        onNext={() => {
          loadAsset(store.sharingItem.id, true);
          setStoreValue('sharingItem', null);
        }}
        onClose={() => {
          setStoreValue('sharingItem', null);
        }}
      />
    </>
  );
}

AssetList.defaultProps = {
  layout: 'grid',
  searchable: true,
  category: 'media-files',
  categories: [],
  itemMinWidth: 300,
  search: '',
  page: 1,
  pageSize: 12,
  pageSizes: [12, 18, 24],
  canChangeLayout: false,
  canChangeType: true,
  canSearch: true,
  variant: 'full',
  published: 'published',
  showPublic: false,
  pinned: false,
  preferCurrent: true,
  canShowPublicToggle: true,
  paperProps: { color: 'none', shadow: 'none', padding: 0 },
  allowStatusChange: false,
};
AssetList.propTypes = {
  category: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  layout: PropTypes.oneOf(['grid', 'table']),
  searchable: PropTypes.bool,
  asset: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  categories: PropTypes.arrayOf(PropTypes.object),
  search: PropTypes.string,
  assetType: PropTypes.string,
  onSelectItem: PropTypes.func,
  onEditItem: PropTypes.func,
  onSearch: PropTypes.func,
  onTypeChange: PropTypes.func,
  onShowPublic: PropTypes.func,
  showPublic: PropTypes.bool,
  itemMinWidth: PropTypes.number,
  canChangeLayout: PropTypes.bool,
  canChangeType: PropTypes.bool,
  canSearch: PropTypes.bool,
  onlyThumbnails: PropTypes.bool,
  variant: PropTypes.oneOf(['full', 'embedded']),
  page: PropTypes.number,
  pageSize: PropTypes.number,
  pageSizes: PropTypes.array,
  published: PropTypes.string,
  activeStatus: PropTypes.string,
  pinned: PropTypes.bool,
  canShowPublicToggle: PropTypes.bool,
  paperProps: PropTypes.object,
  emptyComponent: PropTypes.element,
  searchEmptyComponent: PropTypes.element,
  onLoaded: PropTypes.func,
  onLoading: PropTypes.func,
  preferCurrent: PropTypes.bool,
  searchInProvider: PropTypes.bool,
  roles: PropTypes.arrayOf(PropTypes.string),
  programs: PropTypes.array,
  subjects: PropTypes.array,
  filters: PropTypes.any,
  filterComponents: PropTypes.any,
  allowStatusChange: PropTypes.bool,
  onStatusChange: PropTypes.func,
  allowCategoryFilter: PropTypes.oneOfType([PropTypes.bool, PropTypes.arrayOf(PropTypes.string)]),
};

export { AssetList };
export default AssetList;
