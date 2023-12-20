import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Box, createStyles } from '@bubbles-ui/components';
import { keyBy } from 'lodash';
import { BasicData } from '@leebrary/components/AssetSetup';
import { usePickerCategories } from '../hooks/usePickerCategories';

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
  const categories = usePickerCategories();
  const categoriesByKey = useMemo(() => keyBy(categories, 'key'), [categories]);

  const { classes } = useNewResourceStyles();

  if (!categoriesByKey['media-files']) {
    return null;
  }

  // TODO: Add other categories creation form
  // v - category.key === 'media-files'
  return (
    <Box className={classes.root}>
      <BasicData
        {...(onlyCreateImages ? { onlyImages: true, hideTitle: true } : {})}
        onSave={(asset) => onSelect(asset)}
        categoryId={categoriesByKey['media-files'].id}
      />
    </Box>
  );
}

NewResource.propTypes = {
  localizations: PropTypes.object,
  onlyCreateImages: PropTypes.bool,
  onSelect: PropTypes.func,
};
