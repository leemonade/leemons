import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { find, isArray, isEmpty, isFunction, isNil, isString, uniqBy } from 'lodash';
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
import { LibraryItem } from '@bubbles-ui/leemons';
import { LayoutHeadlineIcon, LayoutModuleIcon } from '@bubbles-ui/icons/solid';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { LocaleDate, unflatten, useRequestErrorMessage } from '@common';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { useLayout } from '@layout/context';
import { useSession } from '@users/session';
import prefixPN from '../helpers/prefixPN';
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
import { getPageItems } from '../helpers/getPageItems';
import { CardWrapper } from './CardWrapper';
import { CardDetailWrapper } from './CardDetailWrapper';
import { AssetThumbnail } from './AssetThumbnail';
import { prepareAsset } from '../helpers/prepareAsset';
import { prepareAssetType } from '../helpers/prepareAssetType';
import { PermissionsData } from './AssetSetup/PermissionsData';
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

const AssetList = ({
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
}) => {
  if (categoryProp?.key?.includes('leebrary-subject')) {
    // eslint-disable-next-line no-param-reassign
    subjects = isArray(categoryProp.id) ? categoryProp.id : [categoryProp.id];
  }

  const [t, translations] = useTranslateLoader(prefixPN('list'));
  const [category, setCategory] = useState(categoryProp);
  const [categories, setCategories] = useState(categoriesProp);
  const [layout, setLayout] = useState(layoutProp);
  const [asset, setAsset] = useState(assetProp);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(pageProp);
  const [size, setSize] = useState(pageSize);
  const [assets, setAssets] = useState([]);
  const [assetTypes, setAssetTypes] = useState([]);
  const [assetType, setAssetType] = useState(assetTypeProp);
  const [openDetail, setOpenDetail] = useState(false);
  const [isDetailOpened, setIsDetailOpened] = useState(false);
  const [serverData, setServerData] = useState({});
  const [showPublic, setShowPublic] = useState(showPublicProp);
  const [searchCriteria, setSearhCriteria] = useState(searchProp);
  const [, , , getErrorMessage] = useRequestErrorMessage();
  const [containerRef, containerRect] = useResizeObserver();
  const [childRef, childRect] = useResizeObserver();
  const [drawerRef, drawerRect] = useResizeObserver();
  const {
    openConfirmationModal,
    openDeleteConfirmationModal,
    setLoading: setAppLoading,
    openModal,
    closeModal,
  } = useLayout();
  const [searchDebounced] = useDebouncedValue(searchCriteria, 300);
  const session = useSession();
  const locale = getLocale(session);
  const loadingRef = useRef({ firstTime: false, loading: false });
  const showThumbnails = useMemo(
    () => onlyThumbnails && category?.key === 'media-files',
    [onlyThumbnails, category]
  );

  const isEmbedded = useMemo(() => variant === 'embedded', [variant]);

  // ·········································································
  // DATA PROCESSING

  const loadCategories = async (selectedCategoryKey) => {
    const result = await listCategoriesRequest();
    const items = result.map((data) => ({
      ...data,
      icon: data.menuItem.iconSvg,
      name: data.menuItem.label,
    }));
    setCategories(items);
    if (!isEmpty(selectedCategoryKey)) {
      setCategory(find(items, { key: selectedCategoryKey }));
    }
  };

  const loadAssetTypes = async (categoryId) => {
    try {
      const response = await getAssetTypesRequest(categoryId);
      const types = uniqBy(
        response.types.map((type) => ({
          label: prepareAssetType(type),
          value: prepareAssetType(type, false),
        })),
        'value'
      );
      setAssetTypes(types);
    } catch (err) {
      addErrorAlert(getErrorMessage(err));
    }
  };

  const clearAssetLoading = () => {
    setTimeout(() => {
      setLoading(false);
      loadingRef.current.loading = false;
      // console.log('Ahora está permitido cargar Assets!!');
    }, 500);
  };

  const loadAssets = async (categoryId, criteria = '', type = '', filters) => {
    if (!loadingRef.current.loading || loadingRef.current.firstTime) {
      loadingRef.current.loading = true;
      loadingRef.current.waitQuery = null;
      loadingRef.current.firstTime = false;

      setLoading(true);
      // console.log('Pasamos por aquí!!');
      try {
        setAsset(null);
        const query = {
          providerQuery: filters ? JSON.stringify(filters) : null,
          category: categoryId,
          criteria,
          type,
          published,
          showPublic: !pinned ? showPublic : true,
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
        // console.log('results:', results);
        setAssets(uniqBy(results, 'asset'));

        if (isEmpty(results)) {
          setServerData([]);
          clearAssetLoading();
        }
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
  };

  const loadAssetsData = async () => {
    if (assets && !isEmpty(assets)) {
      setLoading(true);

      try {
        if (!isEmpty(assets)) {
          const paginated = getPageItems({ data: assets, page: page - 1, size });
          const assetIds = paginated.items.map((item) => item.asset);
          const response = await getAssetsByIdsRequest(assetIds, {
            published,
            showPublic: !pinned ? showPublic : true,
          });
          paginated.items = response.assets || [];
          paginated.page += 1;
          // console.log('paginated.items:', paginated.items);
          setServerData(paginated);
        } else {
          setServerData([]);
        }

        clearAssetLoading();
      } catch (err) {
        clearAssetLoading();
        addErrorAlert(getErrorMessage(err));
      }
    }
  };

  const loadAsset = async (id, forceLoad) => {
    try {
      const item = find(serverData.items, { id });

      if (item && !forceLoad) {
        setAsset(prepareAsset(item, published));
      } else {
        // console.log('loadAsset > id:', id);
        const response = await getAssetsByIdsRequest([id]);
        if (!isEmpty(response?.assets)) {
          const value = response.assets[0];
          // console.log('asset:', value);
          setAsset(prepareAsset(value, published));

          if (forceLoad && item) {
            const index = serverData.items.findIndex((i) => i.id === id);
            serverData.items[index] = value;
            setServerData({ ...serverData });
          }
        } else {
          setAsset(null);
        }
      }
    } catch (err) {
      addErrorAlert(getErrorMessage(err));
    }
  };

  const reloadAssets = () => {
    loadAssets(category?.id, searchDebounced, assetType, filters);
  };

  const duplicateAsset = async (id) => {
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
  };

  const deleteAsset = async (id) => {
    setAppLoading(true);
    try {
      await deleteAssetRequest(id);
      setAppLoading(false);
      addSuccessAlert(t('labels.removeSuccess'));
      setAsset(null);
      reloadAssets();
    } catch (err) {
      setAppLoading(false);
      addErrorAlert(getErrorMessage(err));
    }
  };

  const pinAsset = async (item) => {
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
  };

  const unpinAsset = async (item) => {
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
  };

  // ·········································································
  // EFFECTS

  useEffect(() => setSize(pageSize), [pageSize]);
  useEffect(() => setPage(pageProp), [pageProp]);
  useEffect(() => setLayout(layoutProp), [layoutProp]);
  useEffect(() => setCategories(categoriesProp), [categoriesProp]);
  useEffect(() => setAssetType(assetTypeProp), [assetTypeProp]);
  useEffect(() => setShowPublic(showPublicProp), [showPublicProp]);
  useEffect(() => {
    onLoading(loading);
  }, [loading]);

  useEffect(() => {
    if (!isEmpty(assetProp?.id) && assetProp.id !== asset?.id) {
      setAsset(assetProp);
    } else if (isString(assetProp) && assetProp !== asset?.id) {
      loadAsset(assetProp);
    } else {
      setAsset(null);
    }
  }, [assetProp]);

  useEffect(() => {
    if (!isEmpty(categoryProp?.id)) {
      setCategory(categoryProp);
    } else if (isString(categoryProp) && isEmpty(categories)) {
      loadCategories(categoryProp);
    } else if (isString(categoryProp) && !isEmpty(categories)) {
      setCategory(find(categories, { key: categoryProp }));
    }
  }, [categoryProp, categories]);

  useEffect(() => {
    if (!isEmpty(category?.id)) {
      // loadAssets(category.id);
      loadAssetTypes(category.id);
    } else if (categoryProp?.key === 'pins') {
      const cat = find(categories, { key: 'media-files' });
      if (cat) loadAssetTypes(cat.id);
    } else {
      setAssetTypes(null);
    }
  }, [category, categoryProp]);

  useEffect(() => {
    if (assetTypes && !isEmpty(assetTypes) && assetTypes[0].value !== '') {
      const label = t('labels.allResourceTypes');

      if (label !== 'labels.allResourceTypes') {
        setAssetTypes([{ label, value: '' }, ...assetTypes]);
      }
    }
  }, [assetTypes, t]);

  useEffect(() => {
    loadAssetsData();
  }, [assets, page, size]);

  useEffect(() => {
    if (isFunction(onSearch)) {
      onSearch(searchDebounced);
    } else if (!isEmpty(category?.id) || pinned) {
      loadAssets(category?.id, searchDebounced, assetType, filters);
    }
  }, [searchDebounced, category, pinned, assetType, filters]);

  useEffect(() => {
    if (!isEmpty(category?.id) || pinned) {
      loadAssets(category?.id, searchProp, assetType, filters);
    }
  }, [searchProp, category, assetType, showPublic, pinned, published, filters]);

  // ·········································································
  // HANDLERS

  const handleOnSelect = (item) => {
    setOpenDetail(true);
    onSelectItem(item);
  };

  const handleOnDelete = (item) => {
    openDeleteConfirmationModal({
      onConfirm: () => deleteAsset(item.id),
    })();
  };

  const handleOnDuplicate = (item) => {
    openConfirmationModal({
      onConfirm: () => duplicateAsset(item.id),
    })();
  };

  const handleOnEdit = (item) => {
    setAsset(item);
    onEditItem(item);
  };

  const handleOnShare = (item) => {
    const id = openModal({
      children: (
        <PermissionsData
          asset={item}
          sharing={true}
          onNext={() => {
            closeModal(id);
            loadAsset(item.id, true);
          }}
        />
      ),
      size: 'lg',
      withCloseButton: true,
    });
  };

  /*
  const handleOnShowPublic = (value) => {
    setShowPublic(value);
    onShowPublic(value);
  };
  */

  const handleOnPin = (item) => {
    pinAsset(item);
  };

  const handleOnUnpin = (item) => {
    openConfirmationModal({
      onConfirm: () => unpinAsset(item),
    })();
  };

  const handleOnDownload = (item) => {
    window.open(item.url, '_blank');
  };

  const handleOnChangeCategory = (key) => {
    setAssetType('');
    setCategory(find(categories, { key }));
  };

  const handleOnTypeChange = (type) => {
    if (isEmbedded) {
      setAssetType(type);
    }

    onTypeChange(type);
  };

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
    switch (category?.key) {
      case 'bookmarks':
        option = 'bookmark';
        break;
      default:
        break;
    }
    return option;
  }, [category]);

  const showDrawer = useMemo(() => !loading && !isNil(asset) && !isEmpty(asset), [loading, asset]);

  const toggleDetail = (val) => {
    if (!val) {
      setTimeout(() => setIsDetailOpened(val), 10);
      setTimeout(() => setOpenDetail(val), 200); // 200
    } else {
      setTimeout(() => setIsDetailOpened(val), 500); // 500
      setTimeout(() => setOpenDetail(val), 10);
    }
  };

  useEffect(() => {
    toggleDetail(showDrawer);
  }, [showDrawer]);

  useEffect(() => {
    if (!isNil(asset) && !isEmpty(asset)) {
      toggleDetail(true);
    }
  }, [asset]);

  const offsets = childRef.current?.getBoundingClientRect() || childRect;
  const headerOffset = Math.round(offsets.top + childRect.height + childRect.top);

  const listProps = useMemo(() => {
    if (!showThumbnails && layout === 'grid') {
      return {
        itemRender: (p) => (
          <CardWrapper
            {...p}
            variant={cardVariant || 'media'}
            category={category || { key: 'media-file' }}
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

    if (showThumbnails && layout === 'grid') {
      return {
        itemRender: (p) => <AssetThumbnail {...p} />,
        itemMinWidth: category?.key === 'media-files' ? 200 : itemMinWidth,
        margin: 16,
        spacing: 4,
        paperProps: { shadow: 'none', padding: 4 },
      };
    }

    return { paperProps };
  }, [layout, category, categoryProp, isEmbedded, showThumbnails]);

  const listLayouts = useMemo(
    () => [
      { value: 'grid', icon: <LayoutModuleIcon /> },
      { value: 'table', icon: <LayoutHeadlineIcon /> },
    ],
    []
  );

  const toolbarItems = useMemo(
    () => ({
      edit: asset?.editable ? t('cardToolbar.edit') : false,
      duplicate: asset?.duplicable ? t('cardToolbar.duplicate') : false,
      download: asset?.downloadable ? t('cardToolbar.download') : false,
      delete: asset?.deleteable ? t('cardToolbar.delete') : false,
      share: asset?.shareable ? t('cardToolbar.share') : false,
      // assign: asset?.assignable ? t('cardToolbar.assign') : false,
      // eslint-disable-next-line no-nested-ternary
      pin: asset?.pinned ? false : asset?.pinneable && published ? t('cardToolbar.pin') : false,
      unpin: asset?.pinned ? t('cardToolbar.unpin') : false,
      toggle: t('cardToolbar.toggle'),
    }),
    [asset, category, t]
  );

  const detailLabels = useMemo(() => {
    if (!isEmpty(translations)) {
      const items = unflatten(translations.items);
      const data = items.plugins.leebrary.list.labels;
      return data;
    }
    return {};
  }, [translations]);

  const getEmptyState = () => {
    if (searchDebounced && !isEmpty(searchDebounced)) {
      return searchEmptyComponent || emptyComponent || <SearchEmpty t={t} />;
    }

    return emptyComponent || <ListEmpty t={t} />;
  };

  const listWidth = useMemo(() => {
    if (openDetail && showDrawer) {
      return `calc(100% - ${DRAWER_WIDTH}px)`;
    }

    if (showDrawer) {
      return `calc(100% - 50px)`;
    }

    return '100%';
  }, [openDetail, showDrawer]);

  const categoriesRadioData = useMemo(
    () =>
      categories
        .filter((item) =>
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
    [allowChangeCategories, categories]
  );

  // ·········································································
  // RENDER

  return (
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
              onChange={setSearhCriteria}
              value={searchCriteria}
              disabled={loading}
              label={t('labels.search')}
              placeholder={t('labels.searchPlaceholder')}
            />
          )}
          {!!filterComponents && filterComponents({ loading })}
          {!isEmpty(assetTypes) && canChangeType && (
            <Select
              skipFlex
              data={assetTypes}
              value={assetType}
              onChange={handleOnTypeChange}
              label={t('labels.type')}
              placeholder={t('labels.resourceTypes')}
              disabled={loading}
            />
          )}
        </Stack>
        {canChangeLayout && (
          <Box skipFlex>
            <RadioGroup
              data={listLayouts}
              variant="icon"
              size="xs"
              value={layout}
              onChange={setLayout}
            />
          </Box>
        )}
      </Stack>

      {/* CATEGORY RADIO GROUP ···· */}
      {allowChangeCategories !== false && !isNil(categories) && !isEmpty(categories) && (
        <Box
          skipFlex
          sx={(theme) => ({ marginTop: theme.spacing[5] })}
          style={{ cursor: loading ? 'wait' : 'default' }}
        >
          <Box style={{ pointerEvents: loading ? 'none' : 'auto' }}>
            <RadioGroup
              data={categoriesRadioData}
              variant="icon"
              onChange={handleOnChangeCategory}
              value={category.key}
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
          <LoadingOverlay visible={loading} overlayOpacity={0} />

          {/* !loading && !pinned && canShowPublicToggle && (
            <Switch
              label={t('labels.showPublic')}
              checked={showPublic}
              onChange={handleOnShowPublic}
            />
          ) */}

          {!loading && !isEmpty(serverData?.items) && (
            <Box
              sx={(theme) => ({
                paddingBottom: theme.spacing[5],
              })}
            >
              <PaginatedList
                {...serverData}
                {...listProps}
                paperProps={paperProps}
                selectable
                selected={asset}
                columns={columns}
                loading={loading}
                layout={layout}
                page={page}
                size={size}
                sizes={pageSizes}
                labels={{
                  show: t('show'),
                  goTo: t('goTo'),
                }}
                onSelect={handleOnSelect}
                onPageChange={setPage}
                onSizeChange={setSize}
              />
            </Box>
          )}
          {!loading && isEmpty(serverData?.items) && (
            <Stack justifyContent="center" alignItems="center" fullWidth fullHeight>
              {getEmptyState()}
            </Stack>
          )}
        </Box>
      </Stack>

      {/* SIDE PANEL ········· */}
      <Box
        ref={drawerRef}
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
              width: isDetailOpened ? DRAWER_WIDTH : 0,
              height: '100%',
            }}
          >
            <CardDetailWrapper
              category={category || {}}
              asset={asset}
              labels={detailLabels}
              variant={cardVariant}
              open={isDetailOpened}
              toolbarItems={toolbarItems}
              onToggle={() => toggleDetail(!isDetailOpened)}
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
  );
};

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
