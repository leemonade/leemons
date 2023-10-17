import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { find, isEmpty, isString } from 'lodash';
import { ActionButton, Box, Modal, Paper, Stack, TabPanel, Tabs } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { RemoveIcon } from '@bubbles-ui/icons/outline';
import { PluginLeebraryIcon } from '@bubbles-ui/icons/solid';
import { listCategoriesRequest } from '../request';
import { AssetList } from './AssetList';
import { BasicData } from './AssetSetup/BasicData';
import prefixPN from '../helpers/prefixPN';

const AssetListModal = ({
  opened,
  size,
  layout,
  assetType,
  creatable,
  onlyCreateImages,
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
    <Modal
      opened={opened}
      size={size}
      onClose={onClose}
      withCloseButton={false}
      trapFocus={false}
      empty
    >
      <Paper
        color="solid"
        shadow="none"
        padding="none"
        radius="none"
        fullWidth
        style={{ flex: 1, height: '100%', minHeight: 300 }}
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
    </Modal>
  );
};

AssetListModal.defaultProps = {
  opened: false,
  size: 'xl',
  layout: 'grid',
  assetType: 'image',
  canChangeType: false,
  onlyThumbnails: true,
  creatable: false,
  onlyCreateImages: false,
};
AssetListModal.propTypes = {
  opened: PropTypes.bool,
  size: PropTypes.string,
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
};

export { AssetListModal };
export default AssetListModal;
