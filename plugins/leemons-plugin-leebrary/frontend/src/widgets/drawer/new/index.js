import React from 'react';
import PropTypes from 'prop-types';
import { NewResource } from '@leebrary/components/AssetPickerDrawer/components/NewResource';

export default function New({
  localizations,
  onSelect,
  onlyCreateImages,
  acceptedFileTypes,
  isPickingACover,
  dataOverride,
}) {
  return (
    <NewResource
      localizations={localizations}
      onSelect={onSelect}
      onlyCreateImages={onlyCreateImages}
      acceptedFileTypes={acceptedFileTypes}
      isPickingACover={isPickingACover}
      dataOverride={dataOverride}
    />
  );
}

New.propTypes = {
  localizations: PropTypes.object,
  onSelect: PropTypes.func,
  onlyCreateImages: PropTypes.bool,
  acceptedFileTypes: PropTypes.array,
  isPickingACover: PropTypes.bool,
  dataOverride: PropTypes.object,
};
