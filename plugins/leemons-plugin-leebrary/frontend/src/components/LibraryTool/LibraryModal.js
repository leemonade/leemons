import { useState } from 'react';

import { Box } from '@bubbles-ui/components';
import { noop } from 'lodash';
import PropTypes from 'prop-types';

import { prepareAsset } from '../../helpers/prepareAsset';
import { AssetPickerDrawer } from '../AssetPickerDrawer';

export const LIBRARY_MODAL_DEFAULT_PROPS = {
  labels: {
    width: '',
    display: '',
    align: '',
    cancel: '',
    add: '',
    update: '',
    card: '',
    embed: '',
    player: '',
  },
  placeholders: {
    width: '',
    display: '',
    cancel: '',
    add: '',
  },
  errorMessages: {},
  openLibraryModal: true,
};

export const LIBRARY_MODAL_PROP_TYPES = {
  labels: PropTypes.shape({
    width: PropTypes.string,
    display: PropTypes.string,
    align: PropTypes.string,
    cancel: PropTypes.string,
    add: PropTypes.string,
    update: PropTypes.string,
    card: PropTypes.string,
    embed: PropTypes.string,
    player: PropTypes.string,
  }),
  placeholders: PropTypes.any,
  errorMessages: PropTypes.any,
  openLibraryModal: PropTypes.bool,
  onCancel: PropTypes.func,
  onChange: PropTypes.func,
  readOnly: PropTypes.bool,
};

const LibraryModal = ({
  labels,
  readOnly,
  placeholders,
  errorMessages,
  openLibraryModal,
  onCancel = noop,
  onChange = noop,
  ...props
}) => {
  const openLibraryDrawer = !openLibraryModal;
  const [showAssetDrawer, setShowAssetDrawer] = useState(openLibraryDrawer);

  // ---------------------------------------------------------------------------------------
  // HANDLERS

  const onCancelHandler = () => {
    onCancel();
  };

  const handleOnCloseAssetDrawer = () => {
    onCancelHandler();
    setShowAssetDrawer(false);
  };

  const handleOnSelectAsset = (item) => {
    const preparedAsset = prepareAsset(item);
    if (openLibraryDrawer) {
      onChange({
        width: '100%',
        align: 'left',
        display:
          ['image', 'video', 'audio'].includes(preparedAsset.fileType) ||
          (preparedAsset.fileType === 'bookmark' && preparedAsset.mediaType === 'video')
            ? 'player'
            : 'embed',
        asset: preparedAsset,
        readOnly,
      });
    }
    setShowAssetDrawer(false);
  };

  // ---------------------------------------------------------------------------------------
  // COMPONENT

  return (
    <Box {...props}>
      <AssetPickerDrawer
        creatable
        layout="rows"
        opened={showAssetDrawer}
        onClose={handleOnCloseAssetDrawer}
        onSelect={handleOnSelectAsset}
        shadow
        categories={['bookmarks', 'media-files']}
        itemMinWidth={250}
      />
    </Box>
  );
};

LibraryModal.defaultProps = LIBRARY_MODAL_DEFAULT_PROPS;
LibraryModal.propTypes = LIBRARY_MODAL_PROP_TYPES;

export { LibraryModal };
