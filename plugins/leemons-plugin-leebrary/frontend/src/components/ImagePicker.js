import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { isEmpty, isString, noop } from 'lodash';
import { Box, Button, ImagePreviewInput, Stack } from '@bubbles-ui/components';
import { unflatten } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { PluginLeebraryIcon } from '@bubbles-ui/icons/outline';
import prefixPN from '../helpers/prefixPN';
import { AssetPickerDrawer } from './AssetPickerDrawer';
import { getFileUrl, prepareAsset } from '../helpers/prepareAsset';

const ImagePicker = ({
  labels,
  value: valueProp,
  modal,
  styles,
  className,
  onChange = noop,
  readonly,
  disabled,
  returnAsset,
  acceptedFileTypes,
  objectFit,
  ...props
}) => {
  const [, translations] = useTranslateLoader(prefixPN('assetSetup'));
  const [showAssetDrawer, setShowAssetDrawer] = useState(false);
  const [assetUrl, setAssetUrl] = useState(null);

  useEffect(() => {
    if (!valueProp) {
      setAssetUrl(null);
    } else if (isString(valueProp)) {
      setAssetUrl(getFileUrl(valueProp));
    } else if (!isEmpty(valueProp.id) && !isEmpty(valueProp.cover)) {
      const preparedAsset = prepareAsset(valueProp);
      setAssetUrl(preparedAsset.cover);
    } else if (!isEmpty(valueProp.name) && !isEmpty(valueProp.path)) {
      const imageSrc = URL.createObjectURL(valueProp);
      setAssetUrl(imageSrc);
    } else {
      setAssetUrl(null);
    }
  }, [valueProp]);

  // ··············································································
  // LABELS & STATICS

  const formLabels = useMemo(() => {
    if (translations?.items) {
      const items = unflatten(translations.items);
      const data = items.leebrary.assetSetup.basicData;
      return {
        changeImage: data.labels.changeImage || labels.changeImage,
        uploadButton: data.labels.uploadButton || labels.uploadButton,
        search: data.labels.search || labels.search,
        removeButton: data.labels.removeButton || labels.removeButton,
      };
    }
    return labels;
  }, [translations, labels]);

  // ························································
  // HANDLERS

  const handleOnCloseAssetDrawer = () => {
    setShowAssetDrawer(false);
  };

  const handleOnSelectAsset = (item) => {
    const preparedAsset = prepareAsset(item);
    setAssetUrl(preparedAsset.cover);
    onChange(returnAsset ? item : preparedAsset.original.cover.id);
    setShowAssetDrawer(false);
  };

  // ························································
  // RENDER
  return (
    <Box {...{ styles, className }}>
      <Stack direction="row" spacing={3}>
        {!assetUrl && !readonly && !disabled ? (
          <Button
            variant={'link'}
            leftIcon={<PluginLeebraryIcon height={18} width={18} />}
            onClick={() => setShowAssetDrawer(true)}
          >
            {formLabels.search}
          </Button>
        ) : null}
        <ImagePreviewInput
          labels={{
            changeImage: formLabels.changeImage,
            uploadButton: formLabels.uploadButton,
            removeButton: formLabels.removeButton,
          }}
          previewURL={assetUrl}
          onChange={onChange}
          readonly={readonly}
          disabled={disabled}
          onShowDrawer={setShowAssetDrawer}
          noPicker
          objectFit={objectFit}
        />
      </Stack>

      <AssetPickerDrawer
        {...props}
        layout={'thumbnails'}
        opened={showAssetDrawer}
        onClose={handleOnCloseAssetDrawer}
        onSelect={handleOnSelectAsset}
        categories={['media-files']}
        acceptedFileTypes={acceptedFileTypes}
        onlyCreateImages
        filters={{ type: 'image' }}
      />
    </Box>
  );
};

ImagePicker.defaultProps = {
  labels: {
    changeImage: 'Change image',
    uploadButton: 'Upload',
    search: 'Search from library',
    removeButton: 'Remove',
  },
  creatable: true,
  modal: false,
  returnAsset: false,
  isPickingACover: false,
  acceptedFileTypes: ['image/*'],
};
ImagePicker.propTypes = {
  labels: PropTypes.shape({
    changeImage: PropTypes.string,
    uploadButton: PropTypes.string,
    search: PropTypes.string,
    removeButton: PropTypes.string,
  }),
  readonly: PropTypes.bool,
  disabled: PropTypes.bool,
  value: PropTypes.any,
  onChange: PropTypes.func,
  styles: PropTypes.object,
  className: PropTypes.string,
  creatable: PropTypes.bool,
  modal: PropTypes.bool,
  returnAsset: PropTypes.bool,
  isPickingACover: PropTypes.bool,
  acceptedFileTypes: PropTypes.array,
  objectFit: PropTypes.string,
};

export { ImagePicker };
export default ImagePicker;
