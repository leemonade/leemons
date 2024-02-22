import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, createStyles } from '@bubbles-ui/components';
import { unflatten, useRequestErrorMessage } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { keyBy, isEmpty } from 'lodash';
import AssetForm from '@leebrary/components/AssetForm/AssetForm';
import prefixPN from '@leebrary/helpers/prefixPN';
import UploadingFileModal from '@leebrary/components/UploadingFileModal';
import uploadFileAsMultipart from '@leebrary/helpers/uploadFileAsMultipart';
import { newAssetRequest } from '@leebrary/request';
import compressImage from '@leebrary/helpers/compressImage';
import { addErrorAlert } from '@layout/alert';
import { usePickerCategories } from '../hooks/usePickerCategories';

export const useNewResourceStyles = createStyles((theme) => {
  const globalTheme = theme.other.global;

  return {
    root: {
      paddingTop: globalTheme.spacing.padding.md,
      paddingBottom: globalTheme.spacing.padding.md,
    },
  };
});

export function NewResource({
  categories: creatableCategories,
  acceptedFileTypes,
  onSelect,
  isPickingACover,
}) {
  const [, translations] = useTranslateLoader(prefixPN('assetSetup'));
  const categories = usePickerCategories();
  const categoriesByKey = useMemo(() => keyBy(categories, 'key'), [categories]);
  const [uploadingFileInfo, setUploadingFileInfo] = useState(null);
  const [, , , getErrorMessage] = useRequestErrorMessage();

  const { classes } = useNewResourceStyles();

  // ··············································································
  // FORM LABELS & STATICS

  const formLabels = useMemo(() => {
    if (!isEmpty(translations)) {
      const items = unflatten(translations.items);
      const data = items.leebrary.assetSetup.basicData;
      data.labels.title = data.labels.content;
      return data;
    }
    return {};
  }, [translations]);

  if (!categoriesByKey['media-files']) {
    return null;
  }

  // ··············································································
  // HANDLERS

  const handleOnSubmit = async (data) => {
    try {
      const body = { ...data };
      if (
        body.file.type.startsWith('image') &&
        body.file.type.indexOf('/gif') < 0 &&
        body.file.type.indexOf('/svg') < 0
      ) {
        const compressedImage = await compressImage({ file: body.file });
        body.file = compressedImage;
      }

      const uploadedFile = await uploadFileAsMultipart(body.file, {
        onProgress: (info) => {
          setUploadingFileInfo(info);
        },
      });
      setUploadingFileInfo({ state: 'finalize' });
      try {
        const { asset } = await newAssetRequest(
          { ...body, file: uploadedFile, isCover: !!isPickingACover },
          null,
          'media-files'
        );
        setUploadingFileInfo(null);
        onSelect(asset);
      } catch (err) {
        addErrorAlert(getErrorMessage(err));
      }
    } catch (e) {
      setUploadingFileInfo(null);
    }
  };

  // ··············································································
  // RENDER

  // TODO: Add other categories creation form
  // v - category.key === 'media-files'

  const onlyCreateMediaFiles =
    creatableCategories.length === 1 && creatableCategories[0] === 'media-files';

  return (
    <Box className={classes.root}>
      <AssetForm
        {...(onlyCreateMediaFiles ? { hideTitle: true } : {})}
        {...formLabels}
        acceptedFileTypes={acceptedFileTypes}
        categories={creatableCategories}
        onSubmit={handleOnSubmit}
        drawerLayout
        hideCover
      />
      <UploadingFileModal opened={uploadingFileInfo !== null} info={uploadingFileInfo} />
    </Box>
  );
}

NewResource.propTypes = {
  localizations: PropTypes.object,
  onSelect: PropTypes.func,
  categories: PropTypes.arrayOf(PropTypes.string),
  acceptedFileTypes: PropTypes.arrayOf(PropTypes.string),
  isPickingACover: PropTypes.bool,
};

NewResource.defaultProps = {
  localizations: null,
  categories: ['media-files'],
  acceptedFileTypes: ['image/*', 'audio/*', 'video/*', 'application/pdf'],
};
