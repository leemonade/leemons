import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { isEmpty, find, isString, isNil } from 'lodash';
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
} from '@bubbles-ui/components';
import { LibraryDetail, LibraryItem } from '@bubbles-ui/leemons';
import { CommonFileSearchIcon } from '@bubbles-ui/icons/outline';
import { LayoutModuleIcon, LayoutHeadlineIcon } from '@bubbles-ui/icons/solid';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { useRequestErrorMessage, LocaleDate } from '@common';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import prefixPN from '../helpers/prefixPN';
import { getAssetsRequest, getAssetsByIdsRequest, listCategoriesRequest } from '../request';
import { getPageItems } from '../helpers/getPageItems';
import { CardWrapper } from './CardWrapper';
import { prepareAsset } from '../helpers/prepareAsset';

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
  layout: layoutProp,
  itemMinWidth,
  onItemClick = () => {},
}) => {
  const [t] = useTranslateLoader(prefixPN('list'));
  const [category, setCategory] = useState(categoryProp);
  const [categories, setCategories] = useState(categoriesProp);
  const [layout, setLayout] = useState(layoutProp);
  const [asset, setAsset] = useState(assetProp);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(6);
  const [assets, setAssets] = useState([]);
  const [openDetail, setOpenDetail] = useState(true);
  const [serverData, setServerData] = useState({});
  const [, , , getErrorMessage] = useRequestErrorMessage();
  const [containerRef, containerRect] = useResizeObserver();
  const [childRef, childRect] = useResizeObserver();
  const [drawerRef, drawerRect] = useResizeObserver();

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

  const loadAssets = async (categoryId) => {
    console.log('loadAssets > categoryId:', categoryId);
    try {
      setLoading(true);
      const response = await getAssetsRequest({ category: categoryId });
      setAssets(response?.assets || []);
      setTimeout(() => setLoading(false), 1000);
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

  const loadAsset = async (id) => {
    try {
      const item = find(serverData.items, { id });
      if (item) {
        setAsset(prepareAsset(item));
      } else {
        console.log('loadAsset > id:', id);
        const response = await getAssetsByIdsRequest([id]);
        if (!isEmpty(response?.assets)) {
          setAsset(prepareAsset(response.assets[0]));
        } else {
          setAsset(null);
        }
      }
    } catch (err) {
      addErrorAlert(getErrorMessage(err));
    }
  };

  // ·········································································
  // EFFECTS

  useEffect(() => setLayout(layoutProp), [layoutProp]);
  useEffect(() => setCategories(categoriesProp), [categoriesProp]);

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
      loadAssets(category.id);
    }
  }, [category]);

  useEffect(() => {
    loadAssetsData();
  }, [assets, page, size]);

  // ·········································································
  // HANDLERS

  const handleOnSelect = (item) => {
    setOpenDetail(true);
    onItemClick(item);
  };

  const handleOnCardDelete = (item) => {
    console.log(item);
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
    let variant = 'media';
    switch (category?.key) {
      case 'bookmarks':
        variant = 'bookmark';
        break;
      default:
        break;
    }
    return variant;
  }, [category]);

  const showDrawer = useMemo(() => !loading && !isNil(asset) && !isEmpty(asset), [loading, asset]);

  const headerOffset = useMemo(() => Math.round(childRect.bottom + childRect.top), [childRect]);

  const listProps = useMemo(() => {
    if (layout === 'grid') {
      return {
        itemRender: (p) => (
          <CardWrapper {...p} variant={cardVariant} onDelete={handleOnCardDelete} />
        ),
        itemMinWidth,
        margin: 16,
        spacing: 4,
      };
    }

    return {};
  }, [layout]);

  const listLayouts = useMemo(
    () => [
      { value: 'grid', icon: <LayoutModuleIcon /> },
      { value: 'table', icon: <LayoutHeadlineIcon /> },
    ],
    []
  );

  // ·········································································
  // RENDER

  return (
    <Stack ref={containerRef} direction="column" fullHeight style={{ position: 'relative' }}>
      <Stack
        ref={childRef}
        fullWidth
        spacing={5}
        padding={5}
        style={{
          width: containerRect.width,
          top: containerRect.top,
          position: 'fixed',
          zIndex: 999,
          backgroundColor: '#fff',
        }}
      >
        <Box>
          <SearchInput variant="filled" />
        </Box>
        <Box skipFlex>
          <RadioGroup
            data={listLayouts}
            variant="icon"
            size="xs"
            value={layout}
            onChange={setLayout}
          />
        </Box>
      </Stack>

      <Stack
        fullHeight
        style={{
          marginTop: headerOffset,
          marginRight: drawerRect.width,
        }}
      >
        <Box
          sx={(theme) => ({
            flex: 1,
            position: 'relative',
            paddingRight: theme.spacing[5],
            paddingLeft: theme.spacing[5],
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
                paperProps={{ shadow: 'none', padding: 0 }}
                columns={columns}
                loading={loading}
                layout={layout}
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
          zIndex: 999,
        }}
      >
        {showDrawer && (
          <Box style={{ background: '#FFF', width: openDetail ? 360 : 'auto', height: '100%' }}>
            <LibraryDetail
              asset={asset}
              variant={cardVariant}
              open={openDetail}
              onToggle={() => setOpenDetail(!openDetail)}
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
};
AssetList.propTypes = {
  category: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  layout: PropTypes.oneOf(['grid', 'table']),
  searchable: PropTypes.bool,
  asset: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  categories: PropTypes.arrayOf(PropTypes.object),
  onItemClick: PropTypes.func,
  itemMinWidth: PropTypes.number,
};

export { AssetList };
export default AssetList;
