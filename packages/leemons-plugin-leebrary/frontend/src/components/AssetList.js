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
} from '@bubbles-ui/components';
import { LayoutHeadlineIcon, LayoutModuleIcon } from '@bubbles-ui/icons/solid';
import { LibraryItem } from '@bubbles-ui/leemons';
import { LocaleDate, unflatten, useRequestErrorMessage, useStore } from '@common';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { useLayout } from '@layout/context';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { useSession } from '@users/session';
import { find, forEach, isArray, isEmpty, isFunction, isNil, isString, uniqBy } from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useRef } from 'react';
import { getPageItems } from '../helpers/getPageItems';
import prefixPN from '../helpers/prefixPN';
import { prepareAsset } from '../helpers/prepareAsset';
import { prepareAssetType } from '../helpers/prepareAssetType';
import {
  deleteAssetRequest,
  duplicateAssetRequest,
  getAssetTypesRequest,
  getAssetsByIdsRequest,
  getAssetsRequest,
  listCategoriesRequest,
  pinAssetRequest,
  unpinAssetRequest,
} from '../request';
import { PermissionsDataDrawer } from './AssetSetup';
import { AssetThumbnail } from './AssetThumbnail';
import { CardDetailWrapper } from './CardDetailWrapper';
import { CardWrapper } from './CardWrapper';
import { ListEmpty } from './ListEmpty';
import { SearchEmpty } from './SearchEmpty';

const DRAWER_WIDTH = 350;

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
  itemMinWidth,
  canChangeLayout,
  canChangeType,
  canSearch,
  variant,
  onlyThumbnails,
  page: pageProp,
  pageSize,
  pageSizes,
  published,
  onSearch,
  pinned,
  paperProps,
  emptyComponent,
  searchEmptyComponent,
  allowChangeCategories,
  preferCurrent,
  searchInProvider,
  roles,
  filters,
  filterComponents,
  onSelectItem = () => {},
  onEditItem = () => {},
  onTypeChange = () => {},
  onLoading = () => {},
}) {
  if (categoryProp?.key?.includes('leebrary-subject')) {
    // eslint-disable-next-line no-param-reassign
    subjects = isArray(categoryProp.id) ? categoryProp.id : [categoryProp.id];
  }

  const [store, render] = useStore({
    loading: true,
    category: categoryProp,
    categories: categoriesProp,
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
    serverData: {},
    showPublic: showPublicProp,
    searchCriteria: searchProp,
  });

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
  const loadingRef = useRef({ firstTime: false, loading: false });
  const showThumbnails = useMemo(
    () => onlyThumbnails && store.category?.key === 'media-files',
    [onlyThumbnails, store.category]
  );

  const isEmbedded = useMemo(() => variant === 'embedded', [variant]);

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
    if (!isEmpty(selectedCategoryKey)) store.category = find(items, { key: selectedCategoryKey });
    render();
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
      store.assetTypes = types;
      render();
    } catch (err) {
      addErrorAlert(getErrorMessage(err));
    }
  }

  function clearAssetLoading() {
    setTimeout(() => {
      store.loading = false;
      loadingRef.current.loading = false;
      render();
    }, 500);
  }

  async function loadAssets(categoryId, criteria = '', type = '', _filters) {
    if (!loadingRef.current.loading || loadingRef.current.firstTime) {
      loadingRef.current.loading = true;
      loadingRef.current.waitQuery = null;
      loadingRef.current.firstTime = false;

      store.page = 1;
      store.asset = null;
      store.loading = true;
      render();
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

        const response = await getAssetsRequest(query);

        if (loadingRef.current.waitQuery) {
          loadingRef.current.loading = false;
          loadAssets(
            loadingRef.current.waitQuery.categoryId,
            loadingRef.current.waitQuery.criteria,
            loadingRef.current.waitQuery.type,
            loadingRef.current.waitQuery.filters
          );
          return null;
        }

        const results = response?.assets || [];
        store.assets = uniqBy(results, 'asset');

        if (isEmpty(results)) {
          store.serverData = [];
          clearAssetLoading();
        }
        render();
      } catch (err) {
        clearAssetLoading();
        addErrorAlert(getErrorMessage(err));
      }
    } else {
      loadingRef.current.waitQuery = {
        categoryId,
        criteria,
        type,
        filters,
      };
    }
    return null;
  }

  async function loadAssetsData() {
    if (store.assets && !isEmpty(store.assets)) {
      store.loading = true;
      render();

      try {
        if (!isEmpty(store.assets)) {
          const paginated = getPageItems({
            data: store.assets,
            page: store.page - 1,
            size: store.size,
          });
          const assetIds = paginated.items.map((item) => item.asset);
          const response = await getAssetsByIdsRequest(assetIds, {
            published,
            showPublic: !pinned ? store.showPublic : true,
          });

          paginated.items = response.assets || [];
          forEach(paginated.items, (item) => {
            if (item.file?.metadata?.indexOf('pathsInfo')) {
              item.file.metadata = JSON.parse(item.file.metadata);
              delete item.file.metadata.pathsInfo;
              item.file.metadata = JSON.stringify(item.file.metadata);
            }
          });
          paginated.page += 1;
          store.serverData = paginated;
        } else {
          store.serverData = [];
        }
        clearAssetLoading();
        render();
      } catch (err) {
        clearAssetLoading();
        addErrorAlert(getErrorMessage(err));
      }
    }
  }

  async function loadAsset(id, forceLoad) {
    try {
      const item = find(store.serverData.items, { id });

      if (item && !forceLoad) {
        store.asset = prepareAsset(item, published);
      } else {
        const response = await getAssetsByIdsRequest([id]);
        if (!isEmpty(response?.assets)) {
          const value = response.assets[0];

          if (store.asset) store.asset = prepareAsset(value, published);

          if (forceLoad && item) {
            const index = store.serverData.items.findIndex((i) => i.id === id);
            store.serverData.items[index] = value;
            store.serverData.items = [...store.serverData.items];
            store.serverData = { ...store.serverData };
          }
        } else {
          store.asset = null;
        }
      }
      render();
    } catch (err) {
      addErrorAlert(getErrorMessage(err));
    }
  }

  function reloadAssets() {
    loadAssets(store.category?.id, searchDebounced, store.assetType, filters);
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
      store.asset = null;
      reloadAssets();
    } catch (err) {
      setAppLoading(false);
      addErrorAlert(getErrorMessage(err));
    }
  }

  async function pinAsset(item) {
    setAppLoading(true);
    try {
      await pinAssetRequest(item.id);
      setAppLoading(false);
      addSuccessAlert(t('labels.pinnedSuccess'));
      loadAsset(item.id, true);
    } catch (err) {
      setAppLoading(false);
      addErrorAlert(getErrorMessage(err));
    }
  }

  async function unpinAsset(item) {
    setAppLoading(true);
    try {
      await unpinAssetRequest(item.id);
      setAppLoading(false);
      addSuccessAlert(t('labels.unpinnedSuccess'));
      loadAsset(item.id, true);
    } catch (err) {
      setAppLoading(false);
      addErrorAlert(getErrorMessage(err));
    }
  }

  // ·········································································
  // EFFECTS

  useEffect(() => {
    store.size = pageSize;
    render();
  }, [JSON.stringify(pageSize)]);
  useEffect(() => {
    store.page = pageProp || 1;
    render();
  }, [JSON.stringify(pageProp)]);
  useEffect(() => {
    store.layout = layoutProp;
    render();
  }, [JSON.stringify(layoutProp)]);
  useEffect(() => {
    store.categories = categoriesProp;
    render();
  }, [JSON.stringify(categoriesProp)]);
  useEffect(() => {
    store.assetType = assetTypeProp;
    render();
  }, [JSON.stringify(assetTypeProp)]);
  useEffect(() => {
    store.showPublic = showPublicProp;
    render();
  }, [JSON.stringify(showPublicProp)]);
  useEffect(() => {
    onLoading(store.loading);
  }, [store.loading]);

  useEffect(() => {
    if (!isEmpty(assetProp?.id) && assetProp.id !== store.asset?.id) {
      store.asset = assetProp;
      render();
    } else if (isString(assetProp) && assetProp !== store.asset?.id) {
      loadAsset(assetProp);
    } else {
      store.asset = null;
      render();
    }
  }, [JSON.stringify(assetProp)]);

  useEffect(() => {
    if (!isEmpty(categoryProp?.id)) {
      store.category = categoryProp;
      render();
    } else if (isString(categoryProp) && isEmpty(store.categories)) {
      loadCategories(categoryProp);
    } else if (isString(categoryProp) && !isEmpty(store.categories)) {
      store.category = find(store.categories, { key: categoryProp });
      render();
    }
  }, [JSON.stringify(categoryProp), store.categories]);

  useEffect(() => {
    if (!isEmpty(store.category?.id)) {
      // loadAssets(category.id);
      loadAssetTypes(store.category.id);
    } else if (categoryProp?.key === 'pins' || categoryProp?.key === 'leebrary-shared') {
      const cat = find(store.categories, { key: 'media-files' });
      if (cat) loadAssetTypes(cat.id);
    } else {
      store.assetTypes = null;
      render();
    }
  }, [store.category, JSON.stringify(categoryProp)]);

  useEffect(() => {
    if (store.assetTypes && !isEmpty(store.assetTypes) && store.assetTypes[0].value !== '') {
      const label = t('labels.allResourceTypes');

      if (label !== 'labels.allResourceTypes') {
        store.assetTypes = [{ label, value: '' }, ...store.assetTypes];
        render();
      }
    }
  }, [store.assetTypes, t]);

  useEffect(() => {
    // Good
    loadAssetsData();
  }, [store.assets, store.page, store.size]);

  useEffect(() => {
    // Good
    if (isFunction(onSearch)) {
      onSearch(searchDebounced);
    } else if (!isEmpty(store.category?.id) || pinned) {
      loadAssets(store.category?.id, searchDebounced, store.assetType, filters);
    }
  }, [searchDebounced, store.category, pinned, store.assetType, filters]);

  useEffect(() => {
    // Good
    if (!isEmpty(store.category?.id) || pinned || categoryProp?.key === 'leebrary-shared') {
      loadAssets(store.category?.id, searchProp, store.assetType, filters);
    }
  }, [
    JSON.stringify(categoryProp),
    searchProp,
    store.category,
    store.assetType,
    store.showPublic,
    pinned,
    published,
    filters,
  ]);

  // ·········································································
  // HANDLERS

  function handleOnSelect(item) {
    store.openDetail = true;
    onSelectItem(item);
    render();
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
    store.asset = item;
    onEditItem(item);
    render();
  }

  function handleOnShare(item) {
    store.sharingItem = item;
    render();
  }

  /*
  const handleOnShowPublic = (value) => {
    setShowPublic(value);
    onShowPublic(value);
  };
  */

  function handleOnPin(item) {
    pinAsset(item);
  }

  function handleOnUnpin(item) {
    openConfirmationModal({
      onConfirm: () => unpinAsset(item),
    })();
  }

  function handleOnDownload(item) {
    window.open(item.url, '_blank', 'noopener');
  }

  function handleOnChangeCategory(key) {
    store.assetType = '';
    store.category = find(store.categories, { key });
    render();
  }

  function handleOnTypeChange(type) {
    if (isEmbedded) {
      store.assetType = type;
      render();
    }

    onTypeChange(type);
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
        valueRender: (_, row) => <LocaleDate date={row.updated_at} />,
      },
    ],
    [t]
  );

  const cardVariant = useMemo(() => {
    let option = 'media';
    switch (store.category?.key) {
      case 'bookmarks':
        option = 'bookmark';
        break;
      default:
        break;
    }
    return option;
  }, [store.category]);

  const showDrawer = useMemo(
    () => !store.loading && !isNil(store.asset) && !isEmpty(store.asset),
    [store.loading, store.asset]
  );

  function toggleDetail(val) {
    if (!val) {
      setTimeout(() => {
        store.isDetailOpened = val;
        render();
      }, 10);
      setTimeout(() => {
        store.openDetail = val;
        render();
      }, 200); // 200
    } else {
      setTimeout(() => {
        store.isDetailOpened = val;
        render();
      }, 500); // 500
      setTimeout(() => {
        store.openDetail = val;
        render();
      }, 10);
    }
  }

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
          <CardWrapper
            {...p}
            variant={cardVariant || 'media'}
            category={store.category || { key: 'media-file' }}
            realCategory={categoryProp}
            published={published}
            isEmbedded={isEmbedded}
            onRefresh={reloadAssets}
            onDuplicate={handleOnDuplicate}
            onDelete={handleOnDelete}
            onEdit={handleOnEdit}
            onShare={handleOnShare}
            onPin={handleOnPin}
            onUnpin={handleOnUnpin}
            onDownload={handleOnDownload}
            locale={locale}
          />
        ),
        itemMinWidth,
        margin: 16,
        spacing: 4,
        paperProps: { shadow: 'none', padding: 0 },
      };
    }

    if (showThumbnails && store.layout === 'grid') {
      return {
        itemRender: (p) => <AssetThumbnail {...p} />,
        itemMinWidth: store.category?.key === 'media-files' ? 200 : itemMinWidth,
        margin: 16,
        spacing: 4,
        paperProps: { shadow: 'none', padding: 4 },
      };
    }

    return { paperProps };
  }, [store.layout, store.category, categoryProp, isEmbedded, showThumbnails]);

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
      // assign: asset?.assignable ? t('cardToolbar.assign') : false,
      // eslint-disable-next-line no-nested-ternary
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
      const data = items.plugins.leebrary.list.labels;
      return data;
    }
    return {};
  }, [JSON.stringify(translations)]);

  const getEmptyState = () => {
    if (searchDebounced && !isEmpty(searchDebounced)) {
      return searchEmptyComponent || emptyComponent || <SearchEmpty t={t} />;
    }

    return emptyComponent || <ListEmpty t={t} />;
  };

  const listWidth = useMemo(() => {
    if (store.openDetail && showDrawer) {
      return `calc(100% - ${DRAWER_WIDTH}px)`;
    }

    if (showDrawer) {
      return `calc(100% - 50px)`;
    }

    return '100%';
  }, [store.openDetail, showDrawer]);

  const categoriesRadioData = useMemo(
    () =>
      store.categories
        ?.filter((item) =>
          Array.isArray(allowChangeCategories) ? allowChangeCategories.includes(item.key) : true
        )
        .map((item) => ({
          value: item.key,
          label: item.name,
          icon: (
            <Box style={{ height: 16, marginBottom: 5 }}>
              <ImageLoader
                src={item.icon}
                style={{ width: 16, height: 16, position: 'relative' }}
              />
            </Box>
          ),
        })),
    [allowChangeCategories, store.categories]
  );

  // ·········································································
  // RENDER

  return (
    <>
      <Stack
        ref={containerRef}
        direction="column"
        fullWidth
        fullHeight
        style={{ position: 'relative' }}
      >
        {/* SEARCH BAR ············· */}
        <Stack
          ref={childRef}
          fullWidth
          skipFlex
          spacing={5}
          padding={isEmbedded ? 0 : 5}
          style={
            isEmbedded
              ? { flex: 0, alignItems: 'end' }
              : {
                  flex: 0,
                  alignItems: 'end',
                  width: containerRect.width,
                  top: containerRect.top,
                  position: 'fixed',
                  zIndex: 101,
                  backgroundColor: '#fff',
                }
          }
        >
          <Stack fullWidth spacing={5}>
            {canSearch && (
              <SearchInput
                variant={isEmbedded ? 'default' : 'filled'}
                onChange={(e) => {
                  store.searchCriteria = e;
                  render();
                }}
                value={store.searchCriteria}
                disabled={store.loading}
                label={t('labels.search')}
                placeholder={t('labels.searchPlaceholder')}
              />
            )}
            {!!filterComponents && filterComponents({ loading: store.loading })}
            {!isEmpty(store.assetTypes) && canChangeType && (
              <Select
                skipFlex
                data={store.assetTypes}
                value={store.assetType}
                onChange={handleOnTypeChange}
                label={t('labels.type')}
                placeholder={t('labels.resourceTypes')}
                disabled={store.loading}
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
                  store.layout = e;
                  render();
                }}
              />
            </Box>
          )}
        </Stack>

        {/* CATEGORY RADIO GROUP ···· */}
        {allowChangeCategories !== false && !isNil(store.categories) && !isEmpty(store.categories) && (
          <Box
            skipFlex
            sx={(theme) => ({ marginTop: theme.spacing[5] })}
            style={{ cursor: store.loading ? 'wait' : 'default' }}
          >
            <Box style={{ pointerEvents: store.loading ? 'none' : 'auto' }}>
              <RadioGroup
                data={categoriesRadioData}
                variant="icon"
                onChange={handleOnChangeCategory}
                value={store.category?.key}
                fullWidth
              />
            </Box>
          </Box>
        )}
        {/* PAGINATED LIST ········· */}
        <Stack
          fullHeight
          style={{
            marginTop: !isEmbedded && headerOffset,
            width: listWidth,
            transition: 'width 0.3s ease',
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
            <LoadingOverlay visible={store.loading} overlayOpacity={0} />

            {/* !loading && !pinned && canShowPublicToggle && (
            <Switch
              label={t('labels.showPublic')}
              checked={showPublic}
              onChange={handleOnShowPublic}
            />
          ) */}

            {!store.loading && !isEmpty(store.serverData?.items) && (
              <Box
                sx={(theme) => ({
                  paddingBottom: theme.spacing[5],
                })}
              >
                <PaginatedList
                  {...store.serverData}
                  {...listProps}
                  paperProps={paperProps}
                  selectable
                  selected={store.asset}
                  columns={columns}
                  loading={store.loading}
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
                    store.page = e;
                    render();
                  }}
                  onSizeChange={(e) => {
                    store.size = e;
                    render();
                  }}
                />
              </Box>
            )}
            {!store.loading && isEmpty(store.serverData?.items) && (
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
          {showDrawer && (
            <Box
              style={{
                width: store.isDetailOpened ? DRAWER_WIDTH : 0,
                height: '100%',
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
                locale={locale}
              />
            </Box>
          )}
        </Box>
      </Stack>
      <PermissionsDataDrawer
        size={720}
        hasBack={false}
        opened={!!store.sharingItem}
        asset={store.sharingItem}
        sharing={true}
        onNext={() => {
          loadAsset(store.sharingItem.id, true);
          store.sharingItem = null;
          render();
        }}
        onClose={() => {
          store.sharingItem = null;
          render();
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
  canChangeLayout: true,
  canChangeType: true,
  canSearch: true,
  variant: 'full',
  published: true,
  showPublic: false,
  pinned: false,
  preferCurrent: true,
  canShowPublicToggle: true,
  paperProps: { color: 'none', shadow: 'none', padding: 0 },
  allowChangeCategories: false,
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
  published: PropTypes.bool,
  pinned: PropTypes.bool,
  canShowPublicToggle: PropTypes.bool,
  paperProps: PropTypes.object,
  emptyComponent: PropTypes.element,
  searchEmptyComponent: PropTypes.element,
  onLoaded: PropTypes.func,
  onLoading: PropTypes.func,
  preferCurrent: PropTypes.bool,
  allowChangeCategories: PropTypes.oneOfType([PropTypes.bool, PropTypes.arrayOf(PropTypes.string)]),
  searchInProvider: PropTypes.bool,
  roles: PropTypes.arrayOf(PropTypes.string),
  programs: PropTypes.array,
  subjects: PropTypes.array,
  filters: PropTypes.any,
  filterComponents: PropTypes.any,
};

export { AssetList };
export default AssetList;
