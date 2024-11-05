import { useRef, useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';

import {
  TotalLayoutContainer,
  TotalLayoutHeader,
  TLayout,
  Text,
  ContextContainer,
  FileUpload,
  Box,
  Button,
  Stack,
} from '@bubbles-ui/components';
import { DownloadIcon } from '@bubbles-ui/icons/outline';
import { addErrorAlert } from '@layout/alert';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { ScormCardIcon } from '@scorm/components/icons';

import BulkUploadTable from '@leebrary/components/BulkUploadTable/BulkUploadTable';
import { LIBRARY_FORM_TYPES } from '@leebrary/components/LibraryForm/LibraryForm.constants';
import compressImage from '@leebrary/helpers/compressImage';
import prefixPN from '@leebrary/helpers/prefixPN';
import uploadFileAsMultipart from '@leebrary/helpers/uploadFileAsMultipart';
import { newAssetRequest } from '@leebrary/request';

const BulkAssetPage = () => {
  const [t] = useTranslateLoader(prefixPN('bulkUpload'));
  const scrollRef = useRef(null);
  const history = useHistory();
  const formForAssets = useForm({
    defaultValues: {
      file: null,
    },
  });

  const {
    control,
    handleSubmit,
    watch,
    trigger,
    setValue,
    getValues,
    formState: { errors },
  } = formForAssets;

  const assetFiles = watch('file');
  const hasFilesSelected = assetFiles?.length > 0;
  const filesSelectedCount = assetFiles?.length;

  const [uploadStatus, setUploadStatus] = useState({});

  const uploadSingleFile = async (file) => {
    try {
      setUploadStatus((prev) => ({
        ...prev,
        [file.name]: { state: 'uploading', percentageCompleted: 0 },
      }));

      let fileToUpload = file;
      if (
        file.type?.startsWith('image') &&
        !file.type?.includes('gif') &&
        !file.type?.includes('svg')
      ) {
        fileToUpload = await compressImage({ file });
      }

      const uploadedFile = await uploadFileAsMultipart(fileToUpload, {
        onProgress: (info) => {
          setUploadStatus((prev) => ({
            ...prev,
            [file.name]: info,
          }));
        },
      });

      setUploadStatus((prev) => ({
        ...prev,
        [file.name]: { state: 'finalize' },
      }));

      await newAssetRequest(
        { file: uploadedFile, name: file.name },
        null,
        LIBRARY_FORM_TYPES.MEDIA_FILES
      );

      setUploadStatus((prev) => ({
        ...prev,
        [file.name]: { state: 'completed' },
      }));
    } catch (error) {
      setUploadStatus((prev) => ({
        ...prev,
        [file.name]: { state: 'error' },
      }));
      addErrorAlert(error.message);
    }
  };

  useEffect(() => {
    const uploadFiles = async () => {
      if (assetFiles?.length) {
        for (const file of assetFiles) {
          if (!uploadStatus[file.name]) {
            await uploadSingleFile(file);
          }
        }
      }
    };

    uploadFiles();
  }, [assetFiles]);

  const handleTitle = () => {
    if (hasFilesSelected) {
      if (assetFiles?.length === 1) {
        return `${filesSelectedCount} ${t('fileSelected').toLowerCase()}`;
      }
      return `${filesSelectedCount} ${t('filesSelected').toLowerCase()}`;
    }
    return `${t('contentLabel')}`;
  };

  const areAllUploadsCompleted = () => {
    if (!assetFiles?.length) return false;
    return assetFiles.every((file) => uploadStatus[file.name]?.state === 'completed');
  };

  return (
    <TotalLayoutContainer
      scrollRef={scrollRef}
      Header={
        <TotalLayoutHeader
          title={t('title').toUpperCase()}
          icon={<ScormCardIcon />}
          onCancel={() => history.goBack()}
          direction="column"
          formTitlePlaceholder={
            <Text color="soft" style={{ fontSize: 18 }}>
              {t('bulkLoadLabel')}
            </Text>
          }
        />
      }
      Footer={
        <TLayout.Footer>
          <Stack justifyContent="flex-end" fullWidth>
            <Button disabled={!areAllUploadsCompleted()}>{t('saveButton')}</Button>
          </Stack>
        </TLayout.Footer>
      }
    >
      <TLayout.Content>
        <ContextContainer spacing={4} title={handleTitle()}>
          <Box sx={{ display: hasFilesSelected ? 'none' : 'block' }}>
            <Controller
              control={control}
              name="file"
              rules={{ required: t('requiredLabel') }}
              render={({ field: { ref, value, ...field } }) => (
                <FileUpload
                  {...field}
                  icon={<DownloadIcon height={32} width={32} />}
                  title={t('fileUploadTitle')}
                  subtitle={t('fileUploadSubtitle')}
                  errorMessage={{
                    title: t('fileUploadErrorTitle'),
                    message: t('fileUploadErrorMessage'),
                  }}
                  hideUploadButton
                  showItemsToUpload={false}
                />
              )}
            />
          </Box>
          {hasFilesSelected && (
            <BulkUploadTable data={assetFiles} uploadStatus={uploadStatus} t={t} />
          )}
        </ContextContainer>
      </TLayout.Content>
    </TotalLayoutContainer>
  );
};

export default BulkAssetPage;
