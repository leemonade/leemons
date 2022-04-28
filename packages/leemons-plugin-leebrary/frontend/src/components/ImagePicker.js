import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { ImagePreviewInput, Stack, Button, Box } from '@bubbles-ui/components';
import { unflatten } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '../helpers/prefixPN';
import { AssetListDrawer } from './AssetListDrawer';
import { AssetListModal } from './AssetListModal';
import { prepareAsset } from '../helpers/prepareAsset';

const ImagePicker = ({
  labels,
  value: valueProp,
  modal,
  styles,
  className,
  onChange = () => {},
  ...props
}) => {
  const [, translations] = useTranslateLoader(prefixPN('assetSetup'));
  const [showAssetDrawer, setShowAssetDrawer] = useState(false);
  const [assetUrl, setAssetUrl] = useState(null);
  const [asset, setAsset] = useState(null);

  useEffect(() => {
    if (!valueProp) {
      setAssetUrl(null);
      setAsset(null);
    } else if (!isEmpty(valueProp) && valueProp !== asset) {
      setAsset(valueProp);

      if (valueProp.id && valueProp.file) {
        const preparedAsset = prepareAsset(valueProp);
        setAssetUrl(preparedAsset.cover);
      } else if (valueProp.name && valueProp.path) {
        const imageSrc = URL.createObjectURL(valueProp);
        setAssetUrl(imageSrc);
      }
    }
  }, [valueProp]);

  // ··············································································
  // LABELS & STATICS

  const formLabels = useMemo(() => {
    if (!isEmpty(translations)) {
      const items = unflatten(translations.items);
      const data = items.plugins.leebrary.assetSetup.basicData;
      return {
        changeImage: data.labels.changeImage || labels.changeImage,
        uploadButton: data.labels.uploadButton || labels.uploadButton,
        search: data.labels.search || labels.search,
      };
    }
    return labels;
  }, [translations, labels]);

  const ListComponent = modal ? AssetListModal : AssetListDrawer;

  // ························································
  // HANDLERS

  const handleOnCloseAssetDrawer = () => {
    setShowAssetDrawer(false);
  };

  const handleOnSelectAsset = (item) => {
    const preparedAsset = prepareAsset(item);
    setAssetUrl(preparedAsset.cover);
    onChange(item.file.id);
    setShowAssetDrawer(false);
  };

  // ························································
  // RENDER

  return (
    <Box {...{ styles, className }}>
      <Stack direction="row" spacing={3}>
        {!assetUrl && (
          <Button variant={'outline'} onClick={() => setShowAssetDrawer(true)}>
            {formLabels.search}
          </Button>
        )}
        <ImagePreviewInput
          labels={{
            changeImage: formLabels.changeImage,
            uploadButton: formLabels.uploadButton,
          }}
          previewURL={assetUrl}
          onChange={onChange}
        />
      </Stack>

      <ListComponent
        {...props}
        opened={showAssetDrawer}
        onClose={handleOnCloseAssetDrawer}
        onSelect={handleOnSelectAsset}
        onlyCreateImages
      />
    </Box>
  );
};

ImagePicker.defaultProps = {
  labels: {
    changeImage: 'Change image',
    uploadButton: 'Upload',
    search: 'Search from library',
  },
  creatable: false,
  modal: true,
};
ImagePicker.propTypes = {
  labels: PropTypes.shape({
    changeImage: PropTypes.string,
    uploadButton: PropTypes.string,
    search: PropTypes.string,
  }),
  value: PropTypes.any,
  onChange: PropTypes.func,
  styles: PropTypes.object,
  className: PropTypes.string,
  creatable: PropTypes.bool,
  modal: PropTypes.bool,
};

export { ImagePicker };
export default ImagePicker;
