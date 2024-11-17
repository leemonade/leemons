import React from 'react';
import PropTypes from 'prop-types';
import { AssetList } from '@leebrary/components/AssetPickerDrawer/components/AssetList';

export default function Library({
  variant,
  localizations,
  categories,
  filters,
  onSelect,
  onlyImages,
}) {
  return (
    <AssetList
      variant={variant}
      localizations={localizations}
      categories={categories}
      filters={filters}
      onSelect={onSelect}
      onlyImages={onlyImages}
    />
  );
}

Library.propTypes = {
  variant: PropTypes.string,
  localizations: PropTypes.object,
  categories: PropTypes.array,
  filters: PropTypes.array,
  onSelect: PropTypes.func,
  onlyImages: PropTypes.bool,
};
