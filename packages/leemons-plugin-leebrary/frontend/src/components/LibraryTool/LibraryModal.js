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
import { LibraryItem } from '@bubbles-ui/leemons';
import {
  EditorLeftAlignIcon,
  EditorRightAlignIcon,
  EditorCenterAlignIcon,
} from '@bubbles-ui/icons/solid';
import { RemoveIcon, AddCircleIcon } from '@bubbles-ui/icons/outline';
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
  const { currentTool } = useTextEditor();
  const [showAssetDrawer, setShowAssetDrawer] = useState(false);
  const [asset, setAsset] = useState(currentTool.data.asset);
  const [assetType, setAssetType] = useState('');

  // SIZE ·····················································
  const { width: viewportWidth } = useViewportSize();
  const drawerSize = useMemo(() => Math.max(Math.round(viewportWidth * 0.3), 600), [viewportWidth]);

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
    setShowAssetDrawer(false);
  };

  const handleOnSelectAsset = (item) => {
    const preparedAsset = prepareAsset(item);
    setAsset(preparedAsset);
    setAssetType('');
    setShowAssetDrawer(false);
  };

  // ---------------------------------------------------------------------------------------
  // COMPONENT

  return (
    <Box {...props}>
      <Box style={{ padding: 16, paddingBottom: 18 }}>
        <form onSubmit={handleSubmit(submitHandler)} autoComplete="off">
          <ContextContainer>
            <Paper bordered padding={1} shadow="none">
              {!asset ? (
                <Button
                  variant="light"
                  onClick={() => setShowAssetDrawer(true)}
                  compact
                  leftIcon={<AddCircleIcon height={16} width={16} />}
                >
                  Añadir
                </Button>
              ) : (
                <Stack justifyContent="space-between" alignItems="center">
                  <LibraryItem asset={asset} />
                  <ActionButton
                    icon={<RemoveIcon height={16} width={16} />}
                    onClick={() => setAsset(null)}
                  />
                </Stack>
              )}
            </Paper>
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
                    { value: 'left', icon: <EditorLeftAlignIcon height={16.5} width={16} /> },
                    { value: 'center', icon: <EditorCenterAlignIcon height={16.5} width={16} /> },
                    { value: 'right', icon: <EditorRightAlignIcon height={16.5} width={16} /> },
                  ]}
                />
              )}
            />
            <Stack fullWidth justifyContent="space-between">
              <Button size="xs" variant="light" onClick={onCancelHandler}>
                {labels.cancel}
              </Button>
              <Button size="xs" onClick={handleSubmit(submitHandler)} disabled={disableCondition()}>
                {currentTool.editing ? labels.update : labels.add}
              </Button>
            </Stack>
          </ContextContainer>
        </form>
      </Box>

      <AssetListDrawer
        creatable
        canChangeType
        opened={showAssetDrawer}
        onClose={handleOnCloseAssetDrawer}
        onSelect={handleOnSelectAsset}
        size={drawerSize}
        shadow={drawerSize <= 600}
        assetType={assetType}
        onTypeChange={setAssetType}
        onlyThumbnails={false}
        allowChangeCategories={['bookmarks', 'media-files']}
        itemMinWidth={200}
      />
    </Box>
  );
};

LibraryModal.defaultProps = LIBRARY_MODAL_DEFAULT_PROPS;
LibraryModal.propTypes = LIBRARY_MODAL_PROP_TYPES;

export { LibraryModal };
