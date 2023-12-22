import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Box, createStyles } from '@bubbles-ui/components';
import { unflatten } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { keyBy, isEmpty } from 'lodash';
import { usePickerCategories } from '../hooks/usePickerCategories';
import AssetForm from '@leebrary/components/AssetForm/AssetForm';
import prefixPN from '@leebrary/helpers/prefixPN';

export const useNewResourceStyles = createStyles((theme) => {
  const globalTheme = theme.other.global;

  return {
    root: {
      paddingTop: globalTheme.spacing.padding.md,
      paddingBottom: globalTheme.spacing.padding.md,
    },
  };
});

export function NewResource({ onlyCreateImages, onSelect }) {
  const [t, translations] = useTranslateLoader(prefixPN('assetSetup'));
  const categories = usePickerCategories();
  const categoriesByKey = useMemo(() => keyBy(categories, 'key'), [categories]);

  const { classes } = useNewResourceStyles();

  // ··············································································
  // FORM LABELS & STATICS

  const formLabels = useMemo(() => {
    if (!isEmpty(translations)) {
      const items = unflatten(translations.items);
      const data = items.leebrary.assetSetup.basicData;
      data.labels.title = data.labels.content;
      return data;
    }
    return {};
  }, [translations]);

  if (!categoriesByKey['media-files']) {
    return null;
  }

  // TODO: Add other categories creation form
  // v - category.key === 'media-files'
  return (
    <Box className={classes.root}>
      <AssetForm
        {...(onlyCreateImages ? { onlyImages: true, hideTitle: true } : {})}
        {...formLabels}
        onSave={(asset) => onSelect(asset)}
      />
    </Box>
  );
}

NewResource.propTypes = {
  localizations: PropTypes.object,
  onlyCreateImages: PropTypes.bool,
  onSelect: PropTypes.func,
};
