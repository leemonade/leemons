import React, { useMemo } from 'react';

import { Box, TabPanel, Tabs, createStyles, Drawer } from '@bubbles-ui/components';
import { unflatten } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { ZoneWidgets } from '@widgets';
import { get } from 'lodash';
import PropTypes from 'prop-types';

import { AssetList } from './components/AssetList';

import prefixPN from '@leebrary/helpers/prefixPN';

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

export const useAssetPickerDrawerStyles = createStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    height: '100%',
  },
  content: {},
  contentPadding: {
    overflowY: 'auto',
    height: '100%',
  },
}));

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
  size = 'xl',
}) {
  const localizations = useAssetPickerDrawerLocalizations();
  const { classes } = useAssetPickerDrawerStyles({}, { name: 'AssetPickerDrawer' });

  const classTabs = React.useCallback(
    ({ Component, key, properties }) => (
      <TabPanel label={get(localizations ?? {}, properties.label, '-')} key={key}>
        <Component
          {...properties}
          variant={layout}
          localizations={localizations}
          categories={categories}
          filters={filters}
          onSelect={onSelect}
          onlyImages={onlyImages}
          onlyCreateImages={onlyCreateImages}
          acceptedFileTypes={acceptedFileTypes}
          isPickingACover={isPickingACover}
          dataOverride={newDataOverride}
        />
      </TabPanel>
    ),
    [
      layout,
      localizations,
      categories,
      filters,
      onSelect,
      onlyImages,
      onlyCreateImages,
      acceptedFileTypes,
      isPickingACover,
      newDataOverride,
    ]
  );
  return (
    <Drawer opened={!!opened} size={size} onClose={onClose}>
      <Drawer.Header title={localizations?.header?.title} />
      <Drawer.Content>
        <Box className={classes.root}>
          {creatable ? (
            <ZoneWidgets
              zone="leebrary.drawer.tabs"
              container={<Tabs fullWidth className={classes.content} />}
            >
              {classTabs}
            </ZoneWidgets>
          ) : (
            <Box className={classes.contentPadding}>
              <AssetList
                variant={layout}
                localizations={localizations}
                categories={categories}
                filters={filters}
                onSelect={onSelect}
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
};
AssetPickerDrawer.propTypes = {
  position: PropTypes.oneOf(['left', 'right']),
  opened: PropTypes.bool,
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
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'xl', 'full']),
};
