import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Box, Drawer, TabPanel, Tabs, createStyles } from '@bubbles-ui/components';
import prefixPN from '@leebrary/helpers/prefixPN';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { unflatten } from '@common';
import { get } from 'lodash';
import { Header } from './components/Header';
import { AssetList } from './components/AssetList';
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

export function AssetPickerDrawer({
  position,
  opened,
  size,
  shadow,
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
      opened={opened}
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
              {' '}
              <AssetList
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
  filters: PropTypes.object,
};
