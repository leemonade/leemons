import { Box, Drawer, TabPanel, Tabs, createStyles } from '@bubbles-ui/components';
import { unflatten } from '@common';
import prefixPN from '@leebrary/helpers/prefixPN';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { AssetList } from './components/AssetList';
import { Header } from './components/Header';
import { NewResource } from './components/NewResource';

export function useAssetPickerDrawerLocalizations() {
  const key = prefixPN('pickerDrawer');
  const [, translations] = useTranslateLoader(key);

  return useMemo(() => {
    if (translations && translations.items) {
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
    contentPadding: {
      overflowY: 'auto',
      paddingLeft: globalTheme.spacing.padding.xlg,
      paddingRight: globalTheme.spacing.padding.xlg,
    },
  };
});

/**
 *
 * @param {{
 *  layout: 'rows' | 'thumbnails' | 'cards'
 *  filters: {type: 'image' | 'audio' | 'video' | 'document'}
 * }} param0
 */
export function AssetPickerDrawer({
  position,
  opened,
  size,
  shadow,
  layout,
  creatable,
  categories,
  filters,
  onClose,
  onSelect,
}) {
  const localizations = useAssetPickerDrawerLocalizations();

  const { classes } = useAssetPickerDrawerStyles();

  return (
    <Drawer
      position={position}
      opened={!!opened}
      size={size}
      shadow={shadow}
      close={false}
      empty
      onClose={onClose}
    >
      <Box className={classes.root}>
        <Header localizations={localizations?.header} onClose={onClose} />
        {creatable ? (
          <Tabs usePaddedLayout fullHeight>
            <TabPanel key="library" label={localizations?.tabs?.library}>
              <AssetList
                variant={layout}
                localizations={localizations}
                categories={categories}
                filters={filters}
                onSelect={onSelect}
              />
            </TabPanel>
            <TabPanel key="new" label={localizations?.tabs?.new}>
              <NewResource localizations={localizations} onSelect={onSelect} />
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
            />
          </Box>
        )}
      </Box>
    </Drawer>
  );
}

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
};
