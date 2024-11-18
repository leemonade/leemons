import { useMemo, useState, useEffect } from 'react';

import { Box, Button, Stack, ActionButton } from '@bubbles-ui/components';
import { PluginLeebraryIcon } from '@bubbles-ui/icons/outline';
import { DeleteBinIcon } from '@bubbles-ui/icons/solid';
import { unflatten } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { noop } from 'lodash';
import PropTypes from 'prop-types';

import prefixPN from '../helpers/prefixPN';
import { prepareAsset } from '../helpers/prepareAsset';
import { useAsset } from '../request/hooks/queries/useAsset';

import { AssetPickerDrawer } from './AssetPickerDrawer';
import { LibraryCardEmbed } from './LibraryCardEmbed';

const AssetPicker = ({
  labels,
  value: valueProp,
  styles,
  className,
  onChange = noop,
  readonly,
  disabled,
  returnAsset,
  acceptedFileTypes,
  ...props
}) => {
  const [, translations] = useTranslateLoader(prefixPN('assetSetup'));
  const [showAssetDrawer, setShowAssetDrawer] = useState(false);
  const [asset, setAsset] = useState(null);

  const assetId = useMemo(() => valueProp?.id ?? valueProp, [valueProp]);

  const { data: assetData } = useAsset({ id: assetId, enabled: !!assetId });

  useEffect(() => {
    if (assetData) {
      setAsset(prepareAsset(assetData));
    }
  }, [assetData]);

  // ··············································································
  // LABELS & STATICS

  const formLabels = useMemo(() => {
    if (translations?.items) {
      const items = unflatten(translations.items);
      const data = items.leebrary.assetSetup.basicData;
      return {
        selectButton: data.labels.selectButton || labels.selectButton,
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
    setAsset(preparedAsset);
    onChange(returnAsset ? item : preparedAsset.id);
    setShowAssetDrawer(false);
  };

  const handleOnReset = () => {
    setAsset(null);
    onChange(null);
  };

  // ························································
  // RENDER
  return (
    <Box {...{ styles, className }}>
      {!asset && !readonly && (
        <Button
          variant={'link'}
          leftIcon={<PluginLeebraryIcon height={18} width={18} />}
          onClick={() => setShowAssetDrawer(true)}
          disabled={disabled}
        >
          {formLabels.selectButton}
        </Button>
      )}
      {asset && (
        <Stack spacing={3} alignItems="center">
          <LibraryCardEmbed asset={asset} hasActionButton={false} fullWidth />

          {!readonly && (
            <ActionButton
              icon={<DeleteBinIcon width={18} height={18} />}
              onClick={handleOnReset}
            />
          )}
        </Stack>
      )}

      <AssetPickerDrawer
        {...props}
        opened={showAssetDrawer}
        onClose={handleOnCloseAssetDrawer}
        onSelect={handleOnSelectAsset}
        acceptedFileTypes={acceptedFileTypes}
      />
    </Box>
  );
};

AssetPicker.defaultProps = {
  labels: {
    selectButton: 'Pick from library',
    removeButton: 'Remove',
  },
  layout: 'thumbnails',
  categories: ['media-files'],
  filters: {},
  readonly: false,
  creatable: true,
  returnAsset: false,
  acceptedFileTypes: ['image/*'],
  hideChangeButton: false,
};
AssetPicker.propTypes = {
  labels: PropTypes.shape({
    selectButton: PropTypes.string,
    removeButton: PropTypes.string,
  }),
  layout: PropTypes.string,
  categories: PropTypes.array,
  filters: PropTypes.object,
  readonly: PropTypes.bool,
  disabled: PropTypes.bool,
  value: PropTypes.any,
  onChange: PropTypes.func,
  styles: PropTypes.object,
  className: PropTypes.string,
  creatable: PropTypes.bool,
  returnAsset: PropTypes.bool,
  acceptedFileTypes: PropTypes.array,
  hideChangeButton: PropTypes.bool,
};

export { AssetPicker };
