import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Controller, useForm } from 'react-hook-form';
import {
  Box,
  ActionButton,
  Button,
  ContextContainer,
  RadioGroup,
  Select,
  Stack,
  TextInput,
  Paper,
  useViewportSize,
} from '@bubbles-ui/components';
import { LibraryItem } from '@leebrary/components/LibraryItem';
import {
  EditorLeftAlignIcon,
  EditorRightAlignIcon,
  EditorCenterAlignIcon,
  AddCircleIcon,
} from '@bubbles-ui/icons/solid';
import { RemoveIcon } from '@bubbles-ui/icons/outline';
import { isFunction } from 'lodash';
import { useTextEditor } from '@bubbles-ui/editors';
import { prepareAsset } from '../../helpers/prepareAsset';
import { AssetListDrawer } from '../AssetListDrawer';
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
  placeholders,
  errorMessages,
  openLibraryModal,
  onCancel,
  onChange,
  readOnly,
  ...props
}) => {
  const { currentTool } = useTextEditor();
  const openLibraryDrawer = !openLibraryModal;
  const [showAssetDrawer, setShowAssetDrawer] = useState(openLibraryDrawer);
  const [asset, setAsset] = useState(currentTool.data.asset);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      width: currentTool.data.width || '100%',
      display: currentTool.data.display || 'card',
      align: currentTool.data.align || 'left',
      readOnly,
    },
  });

  const watchInputs = watch(['width', 'display', 'align']);

  const disableCondition = () => !asset?.id || !watchInputs[0] || !watchInputs[1];

  // ---------------------------------------------------------------------------------------
  // HANDLERS

  const submitHandler = (values) => {
    // console.log('submitHandler > values:', values);
    if (isFunction(onChange)) onChange({ ...values, asset });
  };

  const onCancelHandler = () => {
    if (isFunction(onCancel)) onCancel();
  };

  const handleOnCloseAssetDrawer = () => {
    onCancelHandler();
    setShowAssetDrawer(false);
  };

  const handleOnSelectAsset = (item) => {
    const preparedAsset = prepareAsset(item);
    if (openLibraryDrawer) {
      if (isFunction(onChange))
        onChange({
          width: '100%',
          align: 'left',
          display: 'player',
          asset: preparedAsset,
          readOnly,
        });
    } else {
      setAsset(preparedAsset);
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
