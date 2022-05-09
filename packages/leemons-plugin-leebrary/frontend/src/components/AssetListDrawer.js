import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { isEmpty, isString, find } from 'lodash';
import { Drawer, Box, Paper, Stack, ActionButton, Tabs, TabPanel } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { RemoveIcon } from '@bubbles-ui/icons/outline';
import { PluginLeebraryIcon } from '@bubbles-ui/icons/solid';
import { listCategoriesRequest } from '../request';
import { AssetList } from './AssetList';
import { BasicData } from './AssetSetup/BasicData';
import prefixPN from '../helpers/prefixPN';

const AssetListDrawer = ({
  position,
  opened,
  size,
  layout,
  assetType,
  creatable,
  onlyCreateImages,
  shadow,
  categories: categoriesProp,
  category: categoryProp,
  onClose = () => {},
  onSelect = () => {},
  ...props
}) => {
  const [categories, setCategories] = useState(categoriesProp);
  const [category, setCategory] = useState(categoryProp);
  const [t] = useTranslateLoader(prefixPN('assetSetup'));

  // ·········································································
  // DATA PROCESSING

  const selectCategory = (item = 'media-files', items = []) => {
    if (isString(item)) {
      setCategory(find(items, { key: item }));
    } else if (item?.id) {
      setCategory(item);
    } else {
      setCategory(null);
    }
  };

  const loadCategories = async (selectedCategory) => {
    const result = await listCategoriesRequest();
    const items = result.map((data) => ({
      ...data,
      icon: data.menuItem.iconSvg,
      name: data.menuItem.label,
      creatable: data.creatable === true || data.creatable === 1,
    }));
    setCategories(items);
    selectCategory(selectedCategory, items);
  };

  // ·········································································
  // EFFECTS

  useEffect(() => {
    if (categoriesProp && !isEmpty(categoriesProp)) {
      setCategories(categoriesProp);
      selectCategory(categoryProp, categoriesProp);
    } else {
      loadCategories(categoryProp);
    }
  }, [categoriesProp, categoryProp]);

  // ·········································································
  // RENDER

  const LibraryList = (
    <AssetList
      {...props}
      category={category}
      categories={categories}
      layout={layout}
      assetType={assetType}
      variant="embedded"
      canChangeLayout={false}
      canSearch
      onSelectItem={onSelect}
      itemMinWidth={assetType === 'image' ? 200 : undefined}
    />
  );

  return (
    <Drawer position={position} opened={opened} size={size} close={false} shadow={shadow} empty>
      <Paper
        color="solid"
        shadow="none"
        padding="none"
        fullWidth
        style={{ flex: 1, height: '100%' }}
      >
        <Stack
          sx={(theme) => ({
            padding: `0 ${theme.spacing[7]}px`,
            marginTop: theme.spacing[4],
            color: theme.colors.text05,
          })}
          justifyContent="space-between"
          alignItems="center"
        >
          <PluginLeebraryIcon height={18} width={18} />
          <ActionButton icon={<RemoveIcon />} tooltip={t('header.close')} onClick={onClose} />
        </Stack>
        <Box
          sx={(theme) => ({
            padding: `0 ${theme.spacing[7]}px`,
            marginTop: creatable ? 0 : theme.spacing[4],
          })}
        >
          {creatable ? (
            <Tabs>
              <TabPanel key="library" label="Library">
                <Box
                  sx={(theme) => ({
                    marginTop: theme.spacing[5],
                    height: '100%',
                  })}
                >
                  {LibraryList}
                </Box>
              </TabPanel>
              <TabPanel key="create" label="New resource">
                <Box
                  sx={(theme) => ({
                    marginTop: theme.spacing[5],
                    maxWidth: theme.breakpoints.xs,
                    height: '100%',
                  })}
                >
                  {category?.key === 'media-files' ? (
                    <BasicData
                      {...(onlyCreateImages ? { onlyImages: true, hideTitle: true } : {})}
                      categoryId={category?.id}
                      onSave={onSelect}
                    />
                  ) : (
                    <Box>{JSON.stringify(category)}</Box>
                  )}
                </Box>
              </TabPanel>
            </Tabs>
          ) : (
            LibraryList
          )}
        </Box>
      </Paper>
    </Drawer>
  );
};

AssetListDrawer.defaultProps = {
  opened: false,
  position: 'right',
  size: 500,
  layout: 'grid',
  assetType: 'image',
  canChangeType: false,
  onlyThumbnails: true,
  creatable: false,
  onlyCreateImages: false,
  shadow: true,
};
AssetListDrawer.propTypes = {
  opened: PropTypes.bool,
  position: PropTypes.oneOf(['left', 'right']),
  size: PropTypes.number,
  onClose: PropTypes.func,
  categories: PropTypes.arrayOf(PropTypes.object),
  category: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  layout: PropTypes.string,
  onSelect: PropTypes.func,
  assetType: PropTypes.string,
  canChangeType: PropTypes.bool,
  onlyThumbnails: PropTypes.bool,
  creatable: PropTypes.bool,
  onlyCreateImages: PropTypes.bool,
  shadow: PropTypes.bool,
};

export { AssetListDrawer };
export default AssetListDrawer;
