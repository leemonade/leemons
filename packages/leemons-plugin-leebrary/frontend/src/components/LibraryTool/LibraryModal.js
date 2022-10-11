import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Controller, useForm } from 'react-hook-form';
import {
  Box,
  Button,
  ContextContainer,
  RadioGroup,
  Select,
  Stack,
  TextInput,
} from '@bubbles-ui/components';
import {
  EditorLeftAlignIcon,
  EditorRightAlignIcon,
  EditorCenterAlignIcon,
} from '@bubbles-ui/icons/solid';
import { isFunction } from 'lodash';
import { useTextEditor } from '@bubbles-ui/editors';
import { prepareAsset } from '../../helpers/prepareAsset';
import { AssetListDrawer } from '../AssetListDrawer';

export const LIBRARY_MODAL_DEFAULT_PROPS = {
  labels: {
    width: '',
    display: '',
    align: '',
    cancel: '',
    add: '',
    update: '',
  },
  placeholders: {
    width: '',
    display: '',
    cancel: '',
    add: '',
  },
  errorMessages: {},
};

export const LIBRARY_MODAL_PROP_TYPES = {
  labels: PropTypes.shape({
    width: PropTypes.string,
    display: PropTypes.string,
    align: PropTypes.string,
    cancel: PropTypes.string,
    add: PropTypes.string,
    update: PropTypes.string,
  }),
  placeholders: PropTypes.any,
  errorMessages: PropTypes.any,
  onCancel: PropTypes.func,
  onChange: PropTypes.func,
};

const LibraryModal = ({ labels, placeholders, errorMessages, onCancel, onChange, ...props }) => {
  const { libraryContent } = useTextEditor();
  const [showAssetDrawer, setShowAssetDrawer] = useState(false);
  const [asset, setAsset] = useState(null);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: { ...libraryContent },
  });

  const watchInputs = watch(['width', 'display', 'align']);

  const disableCondition = () => !asset?.id || !watchInputs[0] || !watchInputs[1];

  // ---------------------------------------------------------------------------------------
  // HANDLERS

  const submitHandler = (values) => {
    console.log('submitHandler > values:', values);
    if (isFunction(onChange)) onChange({ ...values, asset });
  };

  const onCancelHandler = () => {
    if (isFunction(onCancel)) onCancel();
  };

  const handleOnCloseAssetDrawer = () => {
    setShowAssetDrawer(false);
  };

  const handleOnSelectAsset = (item) => {
    const preparedAsset = prepareAsset(item);
    setAsset(preparedAsset);
    setShowAssetDrawer(false);
  };

  // ---------------------------------------------------------------------------------------
  // COMPONENT

  return (
    <Box {...props}>
      <Box style={{ padding: 16, paddingBottom: 18 }}>
        <form onSubmit={handleSubmit(submitHandler)} autoComplete="off">
          <ContextContainer>
            {!asset ? (
              <Button onClick={() => setShowAssetDrawer(true)}>Añadir</Button>
            ) : (
              <Button onClick={() => setAsset(null)}>Borrar {asset.name}</Button>
            )}
            <Controller
              name="width"
              control={control}
              rules={{ required: errorMessages.width || 'Required field' }}
              render={({ field }) => (
                <TextInput
                  {...field}
                  label={labels.width}
                  placeholder={placeholders.width}
                  error={errors.width}
                />
              )}
            />
            <Controller
              name="display"
              control={control}
              rules={{ required: errorMessages.display || 'Required field' }}
              render={({ field }) => (
                <Select
                  {...field}
                  label={labels.display}
                  placeholder={placeholders.display}
                  error={errors.display}
                  data={[
                    { label: 'Card', value: 'card' },
                    { label: 'Embed', value: 'embed' },
                    { label: 'Player', value: 'player' },
                  ]}
                />
              )}
            />
            <Controller
              name="align"
              control={control}
              rules={{ required: errorMessages.align || 'Required field' }}
              render={({ field }) => (
                <RadioGroup
                  {...field}
                  variant="icon"
                  size="xs"
                  label={labels.align}
                  data={[
                    { value: 'left', icon: <EditorLeftAlignIcon /> },
                    { value: 'center', icon: <EditorCenterAlignIcon /> },
                    { value: 'right', icon: <EditorRightAlignIcon /> },
                  ]}
                />
              )}
            />
            <Stack fullWidth justifyContent="space-between">
              <Button size="xs" variant="light" onClick={onCancelHandler}>
                {labels.cancel}
              </Button>
              <Button size="xs" type="submit" disabled={disableCondition()}>
                {libraryContent.editing ? labels.update : labels.add}
              </Button>
            </Stack>
          </ContextContainer>
        </form>
      </Box>

      <AssetListDrawer
        opened={showAssetDrawer}
        onClose={handleOnCloseAssetDrawer}
        onSelect={handleOnSelectAsset}
        creatable
      />
    </Box>
  );
};

LibraryModal.defaultProps = LIBRARY_MODAL_DEFAULT_PROPS;
LibraryModal.propTypes = LIBRARY_MODAL_PROP_TYPES;

export { LibraryModal };
