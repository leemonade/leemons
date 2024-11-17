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
import { LIBRARY_FORM_TYPES } from '@leebrary/components/LibraryForm/LibraryForm.constants';
import imageUrlToFile from '@leebrary/helpers/imageUrlToFile';
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
  dataOverride,
  externalFile,
  onRemoveExternalFile,
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

  if (!categoriesByKey[LIBRARY_FORM_TYPES.MEDIA_FILES]) {
    return null;
  }

  // ··············································································
  // HANDLERS

  const handleOnSubmit = async (data) => {
    try {
      const body = { ...data };

      if (
        body.file?.type?.startsWith('image') &&
        body.file?.type?.indexOf('/gif') < 0 &&
        body.file?.type?.indexOf('/svg') < 0
      ) {
        const compressedImage = await compressImage({ file: body.file });
        body.file = compressedImage;
      }

      let originalExternalResource = null;
      if (body.externalFile && body.externalFile.type === 'image') {
        originalExternalResource = body.externalFile;

        setUploadingFileInfo({ state: 'processingImage' });
        const fileFromUrl = await imageUrlToFile(originalExternalResource.url);
        const compressedImage = await compressImage({ file: fileFromUrl });
        body.file = compressedImage;
        body.url = originalExternalResource.url;
        body.cover = null;
        delete body.externalFile;
      }

      const uploadedFile = await uploadFileAsMultipart(body.file, {
        onProgress: (info) => {
          setUploadingFileInfo(info);
        },
        externalFileInfo: {
          copyright: originalExternalResource?.copyright,
          externalUrl: originalExternalResource?.url,
        },
      });
      setUploadingFileInfo({ state: 'finalize' });
      try {
        const { asset } = await newAssetRequest(
          { ...body, file: uploadedFile, isCover: !!isPickingACover, ...dataOverride },
          null,
          LIBRARY_FORM_TYPES.MEDIA_FILES
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
    creatableCategories.length === 1 && creatableCategories[0] === LIBRARY_FORM_TYPES.MEDIA_FILES;

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
        externalFileFromDrawer={externalFile}
        onRemoveExternalFile={onRemoveExternalFile}
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
  dataOverride: PropTypes.object,
  externalFile: PropTypes.object,
  onRemoveExternalFile: PropTypes.func,
};

NewResource.defaultProps = {
  localizations: null,
  categories: [LIBRARY_FORM_TYPES.MEDIA_FILES],
  dataOverride: {},
  externalFile: null,
  onRemoveExternalFile: () => {},
};
