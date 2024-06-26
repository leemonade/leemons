import { Box, TabPanel, Tabs, createStyles, Drawer } from '@bubbles-ui/components';
import { unflatten } from '@common';
import prefixPN from '@leebrary/helpers/prefixPN';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { AssetList } from './components/AssetList';
import { NewResource } from './components/NewResource';

export function useAssetPickerDrawerLocalizations() {
  const key = prefixPN('pickerDrawer');
  const [, translations] = useTranslateLoader(key);

  return useMemo(() => {
    if (translations?.items) {
      const res = unflatten(translations.items);

      return get(res, key);
    }

    return {};
  });
}

export const useAssetPickerDrawerStyles = createStyles((theme) => {
  const globalTheme = theme.other.global;

  return {
    root: {
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      height: '100%',
    },
    content: {
      // marginTop: globalTheme.spacing.padding.md,
    },
    contentPadding: {
      overflowY: 'auto',
      // paddingLeft: globalTheme.spacing.padding.xlg,
      // paddingRight: globalTheme.spacing.padding.xlg,
      height: '100%',
    },
  };
});

/**
 * Renders the AssetPickerDrawer component.
 *
 * @param {object} position - The position of the drawer.
 * @param {boolean} opened - Whether the drawer is opened or not.
 * @param {string} size - The size of the drawer.
 * @param {boolean} shadow - Whether to show shadow or not.
 * @param {string} layout - The layout variant of the asset picker.
 * @param {boolean} creatable - Whether the asset picker is creatable or not.
 * @param {array} categories - The categories of the assets.
 * @param {array} filters - The filters to apply to the assets.
 * @param {function} onClose - The function to close the drawer.
 * @param {function} onSelect - The function to select an asset.
 * @param {boolean} onlyCreateImages - Whether to only create images or not.
 * @param {object} newDataOverride - Override data in asset creation.
 * @return {JSX.Element} The rendered AssetPickerDrawer component.
 */
export function AssetPickerDrawer({
  opened,
  layout,
  creatable,
  categories,
  filters,
  onClose,
  onSelect,
  onlyCreateImages,
  acceptedFileTypes,
  onlyImages,
  isPickingACover,
  newDataOverride,
}) {
  const localizations = useAssetPickerDrawerLocalizations();
  const { classes } = useAssetPickerDrawerStyles({}, { name: 'AssetPickerDrawer' });
  return (
    <Drawer opened={!!opened} size={'xl'} onClose={onClose}>
      <Drawer.Header title={localizations?.header?.title} />
      <Drawer.Content>
        <Box className={classes.root}>
          {creatable ? (
            <Tabs fullWidth className={classes.content}>
              <TabPanel key="library" label={localizations?.tabs?.library}>
                <AssetList
                  variant={layout}
                  localizations={localizations}
                  categories={categories}
                  filters={filters}
                  onSelect={onSelect}
                  onlyImages={onlyImages}
                />
              </TabPanel>
              <TabPanel key="new" label={localizations?.tabs?.new}>
                <NewResource
                  localizations={localizations}
                  onSelect={onSelect}
                  onlyCreateImages={onlyCreateImages}
                  acceptedFileTypes={acceptedFileTypes}
                  isPickingACover={isPickingACover}
                  dataOverride={newDataOverride}
                />
              </TabPanel>
            </Tabs>
          ) : (
            <Box className={classes.contentPadding}>
              <AssetList
                variant={layout}
                localizations={localizations}
                categories={categories}
                filters={filters}
                onSelect={onSelect}
                onlyImages={onlyImages}
              />
            </Box>
          )}
        </Box>
      </Drawer.Content>
    </Drawer>
  );
}

AssetPickerDrawer.defaultProps = {
  onlyCreateImages: true,
  size: 728,
};
AssetPickerDrawer.propTypes = {
  position: PropTypes.oneOf(['left', 'right']),
  opened: PropTypes.bool,
  size: PropTypes.number,
  shadow: PropTypes.bool,
  creatable: PropTypes.bool,
  onClose: PropTypes.func,
  onSelect: PropTypes.func,
  categories: PropTypes.arrayOf(PropTypes.string),
  layout: PropTypes.oneOf(['rows', 'thumbnails', 'cards']),
  filters: PropTypes.object,
  onlyCreateImages: PropTypes.bool,
  onlyImages: PropTypes.bool,
  acceptedFileTypes: PropTypes.arrayOf(PropTypes.string),
  isPickingACover: PropTypes.bool,
  newDataOverride: PropTypes.object,
};
