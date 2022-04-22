import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { isEmpty, find, isString, isNil, isFunction } from 'lodash';
import {
  Box,
  Stack,
  Paper,
  SearchInput,
  PaginatedList,
  Title,
  LoadingOverlay,
  useResizeObserver,
  RadioGroup,
  useDebouncedValue,
  Text,
  Button,
  Select,
} from '@bubbles-ui/components';
import { LibraryDetail, LibraryItem } from '@bubbles-ui/leemons';
import { CommonFileSearchIcon } from '@bubbles-ui/icons/outline';
import { LayoutModuleIcon, LayoutHeadlineIcon } from '@bubbles-ui/icons/solid';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { useRequestErrorMessage, LocaleDate } from '@common';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { useLayout } from '@layout/context';
import prefixPN from '../helpers/prefixPN';
import {
  getAssetsRequest,
  getAssetsByIdsRequest,
  listCategoriesRequest,
  duplicateAssetRequest,
  deleteAssetRequest,
  getAssetTypesRequest,
} from '../request';
import { getPageItems } from '../helpers/getPageItems';
import { CardWrapper } from './CardWrapper';
import { AssetThumbnail } from './AssetThumbnail';
import { prepareAsset } from '../helpers/prepareAsset';
import { prepareAssetType } from '../helpers/prepareAssetType';
import { PermissionsData } from './AssetSetup/PermissionsData';

function getOwner(asset) {
  const owner = (asset?.canAccess || []).filter((person) =>
    person.permissions.includes('owner')
  )[0];
  return `${owner.name} ${owner.surnames}`;
}

const AssetList = ({
  category: categoryProp,
  categories: categoriesProp,
  asset: assetProp,
  assetType: assetTypeProp,
  search: searchProp,
  layout: layoutProp,
  itemMinWidth,
  canChangeLayout,
  canChangeType,
  canSearch,
  variant,
  onlyThumbnails,
  page: pageProp,
  pageSize,
  onSelectItem = () => {},
  onEditItem = () => {},
  onTypeChange = () => {},
  onSearch,
}) => {
  const [t] = useTranslateLoader(prefixPN('list'));
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
  const [openDetail, setOpenDetail] = useState(true);
  const [serverData, setServerData] = useState({});
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
      const types = response.types.map((type) => ({
        label: prepareAssetType(type),
        value: prepareAssetType(type, false),
      }));
      setAssetTypes(types);
    } catch (err) {
      addErrorAlert(getErrorMessage(err));
    }
  };

  const loadAssets = async (categoryId, criteria = '', type = '') => {
    console.log('loadAssets > categoryId:', categoryId);
    try {
      setLoading(true);
      setAsset(null);
      const response = await getAssetsRequest({ category: categoryId, criteria, type });
      console.log('assets:', response.assets);
      setAssets(response?.assets || []);
      setTimeout(() => setLoading(false), 200);
    } catch (err) {
      setLoading(false);
      addErrorAlert(getErrorMessage(err));
    }
  };

  const loadAssetsData = async () => {
    console.log('loadAssetsData');
    try {
      setLoading(true);
      if (!isEmpty(assets)) {
        const paginated = getPageItems({ data: assets, page: page - 1, size });
        const assetIds = paginated.items.map((item) => item.asset);
        const response = await getAssetsByIdsRequest(assetIds);
        paginated.items = response.assets || [];
        setServerData(paginated);
      } else {
        setServerData([]);
      }
      setTimeout(() => setLoading(false), 1000);
    } catch (err) {
      setLoading(false);
      addErrorAlert(getErrorMessage(err));
    }
  };

  const loadAsset = async (id, forceLoad) => {
    try {
      const item = find(serverData.items, { id });

      if (item && !forceLoad) {
        setAsset(prepareAsset(item));
      } else {
        console.log('loadAsset > id:', id);
        const response = await getAssetsByIdsRequest([id]);
        if (!isEmpty(response?.assets)) {
          const value = response.assets[0];
          setAsset(prepareAsset(value));

          if (forceLoad && item) {
            const index = serverData.items.findIndex((i) => i.id === id);
            serverData.items[index] = value;
            setServerData(serverData);
          }
        } else {
          setAsset(null);
        }
      }
    } catch (err) {
      addErrorAlert(getErrorMessage(err));
    }
  };

  const duplicateAsset = async (id) => {
    setAppLoading(true);
    try {
      const response = await duplicateAssetRequest(id);
      if (response?.asset) {
        setAppLoading(false);
        addSuccessAlert(t('labels.duplicateSuccess'));
        loadAssets(category.id);
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
      loadAssets(category.id);
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
    }
  }, [category]);

  useEffect(() => {
    loadAssetsData();
  }, [assets, page, size]);

  useEffect(() => {
    if (isFunction(onSearch)) {
      onSearch(searchDebounced);
    } else {
      loadAssets(category.id, searchDebounced, assetType);
    }
  }, [searchDebounced]);

  useEffect(() => {
    if (!isEmpty(category?.id)) {
      loadAssets(category.id, searchProp, assetType);
    }
    /*
    if (!isEmpty(searchProp) && !isEmpty(category?.id)) {
      loadAssets(category.id, searchProp, assetType);
    }

    if ((isEmpty(searchProp) || isNil(searchProp)) && !isEmpty(category?.id)) {
      loadAssets(category.id);
    }
    */
  }, [searchProp, category, assetType]);

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

  // ·········································································
  // LABELS & STATIC

  const columns = [
    {
      Header: 'Name',
      accessor: 'name',
      valueRender: (_, row) => <LibraryItem asset={prepareAsset(row)} />,
    },
    {
      Header: 'Owner',
      accessor: 'owner',
      valueRender: (_, row) => getOwner(row),
    },
    {
      Header: 'Last change',
      accessor: 'updated',
      valueRender: (_, row) => <LocaleDate date={row.updated_at} />,
    },
  ];

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

  const headerOffset = useMemo(() => Math.round(childRect.bottom + childRect.top), [childRect]);

  const listProps = useMemo(() => {
    const paperProps = { shadow: 'none', padding: 0 };

    if (!onlyThumbnails && layout === 'grid') {
      return {
        itemRender: (p) => <CardWrapper {...p} variant={cardVariant} />,
        itemMinWidth,
        margin: 16,
        spacing: 4,
        paperProps,
      };
    }

    if (onlyThumbnails && layout === 'grid') {
      return {
        itemRender: (p) => <AssetThumbnail {...p} />,
        itemMinWidth,
        margin: 16,
        spacing: 4,
        paperProps: { shadow: 'none', padding: 4 },
      };
    }

    return { paperProps };
  }, [layout]);

  const listLayouts = useMemo(
    () => [
      { value: 'grid', icon: <LayoutModuleIcon /> },
      { value: 'table', icon: <LayoutHeadlineIcon /> },
    ],
    []
  );

  const toolbarItems = useMemo(
    () => ({
      edit: 'Edit',
      duplicate: asset?.duplicable ? 'Duplicate' : false,
      download: asset?.downloadable ? 'Download' : false,
      delete: 'Delete',
      share: 'Share',
      assign: asset?.assignable ? 'Assign' : false,
      toggle: 'Toggle',
    }),
    [asset]
  );

  const isEmbedded = useMemo(() => variant === 'embedded', [variant]);

  // ·········································································
  // RENDER

  return (
    <Stack ref={containerRef} direction="column" fullHeight style={{ position: 'relative' }}>
      <Stack
        ref={childRef}
        fullWidth
        spacing={5}
        padding={isEmbedded ? 0 : 5}
        style={
          isEmbedded
            ? {}
            : {
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
            />
          )}
          {!isEmpty(assetTypes) && canChangeType && (
            <Select
              skipFlex
              data={assetTypes}
              value={assetType}
              onChange={onTypeChange}
              placeholder="Type of resource"
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

      <Stack
        fullHeight
        style={
          isEmbedded
            ? {}
            : {
                marginTop: headerOffset,
                marginRight: drawerRect.width,
              }
        }
      >
        <Box
          sx={(theme) => ({
            flex: 1,
            position: 'relative',
            marginTop: isEmbedded && theme.spacing[5],
            paddingRight: !isEmbedded && theme.spacing[5],
            paddingLeft: !isEmbedded && theme.spacing[5],
          })}
        >
          <LoadingOverlay visible={loading} />
          {!loading && !isEmpty(serverData?.items) && (
            <Box
              sx={(theme) => ({
                paddingBottom: theme.spacing[5],
              })}
            >
              <PaginatedList
                {...serverData}
                {...listProps}
                selectable
                selected={asset}
                columns={columns}
                loading={loading}
                layout={layout}
                page={page}
                size={size}
                onSelect={handleOnSelect}
                onPageChange={setPage}
                onSizeChange={setSize}
              />
            </Box>
          )}
          {!loading && isEmpty(serverData?.items) && (
            <Stack justifyContent="center" alignItems="center" fullWidth fullHeight>
              <Stack
                alignItems="center"
                direction="column"
                spacing={2}
                sx={(theme) => ({ color: theme.colors.text05 })}
              >
                <CommonFileSearchIcon style={{ fontSize: 24 }} />
                <Title order={4} color="soft">
                  No assets found
                </Title>
              </Stack>
            </Stack>
          )}
        </Box>
      </Stack>
      <Box
        ref={drawerRef}
        style={{
          position: 'fixed',
          height: `calc(100% - ${headerOffset}px)`,
          right: 0,
          top: headerOffset,
          zIndex: 99,
        }}
      >
        {showDrawer && (
          <Box style={{ background: '#FFF', width: openDetail ? 360 : 'auto', height: '100%' }}>
            <LibraryDetail
              asset={asset}
              variant={cardVariant}
              open={openDetail}
              toolbarItems={toolbarItems}
              onToggle={() => setOpenDetail(!openDetail)}
              onDuplicate={handleOnDuplicate}
              onDelete={handleOnDelete}
              onEdit={handleOnEdit}
              onShare={handleOnShare}
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
  itemMinWidth: 340,
  search: '',
  page: 1,
  pageSize: 6,
  canChangeLayout: true,
  canChangeType: true,
  canSearch: true,
  variant: 'full',
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
  itemMinWidth: PropTypes.number,
  canChangeLayout: PropTypes.bool,
  canChangeType: PropTypes.bool,
  canSearch: PropTypes.bool,
  onlyThumbnails: PropTypes.bool,
  variant: PropTypes.oneOf(['full', 'embedded']),
  page: PropTypes.number,
  pageSize: PropTypes.number,
};

export { AssetList };
export default AssetList;
