import { useMemo, useState } from 'react';

import { Box, Button, Stack, ActionButton } from '@bubbles-ui/components';
import { PluginLeebraryIcon } from '@bubbles-ui/icons/outline';
import { DeleteBinIcon } from '@bubbles-ui/icons/solid';
import { AssetPickerDrawer } from '@leebrary/components/AssetPickerDrawer';
import { LibraryCardEmbed } from '@leebrary/components/LibraryCardEmbed';
import { prepareAsset } from '@leebrary/helpers/prepareAsset';
import useAsset from '@leebrary/request/hooks/queries/useAsset';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import PropTypes from 'prop-types';

import prefixPN from '@tests/helpers/prefixPN';

const QUESTION_RESOURCE_ALLOWED_FILE_TYPES = ['image/*', 'video/*', 'audio/*'];

export const ResourcePicker = ({
  value,
  onChange,
  allowedFileTypes = QUESTION_RESOURCE_ALLOWED_FILE_TYPES,
}) => {
  const [showAssetDrawer, setShowAssetDrawer] = useState(false);
  const [t] = useTranslateLoader(prefixPN('common'));

  const { data: fetchedAsset } = useAsset({
    id: value,
    showPublic: true,
    enabled: !!value && typeof value === 'string',
  });

  const assetObject = value?.id ? value : fetchedAsset;

  const handleOnSelectResource = (selectedAsset) => {
    onChange(selectedAsset);
    setShowAssetDrawer(false);
  };

  const ResourceCard = useMemo(() => {
    const preparedResource = prepareAsset(assetObject);
    const finalFileType =
      preparedResource.fileType === 'document' ? 'file' : preparedResource.fileType;

    return (
      <Stack sx={{ width: 380 }} alignItems="center" spacing={2}>
        <LibraryCardEmbed
          asset={{
            ...preparedResource,
            fileType: finalFileType,
          }}
          fullWidth={true}
        />

        <Box sx={{ height: 24, width: 24 }}>
          <ActionButton
            tooltip={t('tooltips.remove')}
            onClick={() => onChange(null)}
            icon={<DeleteBinIcon width={18} height={18} />}
          />
        </Box>
      </Stack>
    );
  }, [assetObject, onChange, t]);

  return (
    <>
      <Box sx={{ width: 440 }}>
        {assetObject?.id ? (
          ResourceCard
        ) : (
          <Button
            variant={'link'}
            leftIcon={<PluginLeebraryIcon height={18} width={18} />}
            onClick={() => setShowAssetDrawer(true)}
            textAlign="left"
          >
            {t('searchInLibrary')}
          </Button>
        )}
      </Box>

      <AssetPickerDrawer
        layout="rows"
        categories={['media-files']}
        size="md"
        onClose={() => setShowAssetDrawer(false)}
        onSelect={handleOnSelectResource}
        opened={showAssetDrawer}
        shadow
        creatable
        acceptedFileTypes={allowedFileTypes}
        filters={{ type: ['audio', 'video', 'image'] }}
      />
    </>
  );
};

ResourcePicker.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  allowedFileTypes: PropTypes.arrayOf(PropTypes.string),
};

export default ResourcePicker;
