import { useRef, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';

import {
  TotalLayoutContainer,
  TotalLayoutHeader,
  TLayout,
  Text,
  Button,
  Stack,
  LoadingOverlay,
} from '@bubbles-ui/components';
import { addErrorAlert } from '@layout/alert';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { ScormCardIcon } from '@scorm/components/icons';

import AddBulkResources from '@leebrary/components/AddBulkResources/AddBulkResources';
import { LIBRARY_FORM_TYPES } from '@leebrary/components/LibraryForm/LibraryForm.constants';
import { ManageBulkAssets } from '@leebrary/components/ManageBulkAssets/ManageBulkAssets';
import compressImage from '@leebrary/helpers/compressImage';
import prefixPN from '@leebrary/helpers/prefixPN';
import uploadFileAsMultipart from '@leebrary/helpers/uploadFileAsMultipart';
import { newAssetRequest, getAssetsByIdsRequest } from '@leebrary/request';

const BulkAssetPage = () => {
  const [t] = useTranslateLoader(prefixPN('bulkUpload'));
  const scrollRef = useRef(null);
  const history = useHistory();
  const formForAssets = useForm({
    defaultValues: {
      file: null,
    },
  });

  const { control, watch } = formForAssets;

  const assetFiles = watch('file');
  const hasFilesSelected = assetFiles?.length > 0;
  const filesSelectedCount = assetFiles?.length;

  const [uploadStatus, setUploadStatus] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [createdAssets, setCreatedAssets] = useState([]);
  const [step, setStep] = useState(1);
  const [isCreatingAssets, setIsCreatingAssets] = useState(false);
  const [uploadQueue, setUploadQueue] = useState([]);
  const [currentBatch, setCurrentBatch] = useState([]);

  useEffect(() => {
    if (assetFiles?.length) {
      const newQueue = assetFiles.filter(
        (file) => !uploadStatus[file.name] && !currentBatch.find((f) => f.name === file.name)
      );
      setUploadQueue(newQueue);
    }
  }, [assetFiles]);

  useEffect(() => {
    const processQueue = async () => {
      if (currentBatch.length > 0) return;
      if (uploadQueue.length === 0) return;

      const batch = uploadQueue.slice(0, 2);
      const remainingQueue = uploadQueue.slice(2);

      setCurrentBatch(batch);
      setUploadQueue(remainingQueue);

      await Promise.all(batch.map((file) => uploadSingleFile(file)));

      setCurrentBatch([]);
    };

    processQueue();
  }, [uploadQueue, currentBatch]);

  const removeFile = (fileName) => {
    const newFiles = assetFiles?.filter((file) => file.name !== fileName);
    formForAssets.setValue('file', newFiles);

    setUploadStatus((prev) => {
      const newStatus = { ...prev };
      delete newStatus[fileName];
      return newStatus;
    });

    setUploadedFiles((prev) => {
      const newUploaded = { ...prev };
      delete newUploaded[fileName];
      return newUploaded;
    });

    setUploadQueue((prev) => prev.filter((file) => file.name !== fileName));
    setCurrentBatch((prev) => prev.filter((file) => file.name !== fileName));
  };

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

      setUploadedFiles((prev) => ({
        ...prev,
        [file.name]: { fileId: uploadedFile, name: file.name },
      }));

      setUploadStatus((prev) => ({
        ...prev,
        [file.name]: { state: 'uploaded', fileId: uploadedFile },
      }));
    } catch (error) {
      setUploadStatus((prev) => ({
        ...prev,
        [file.name]: { state: 'error' },
      }));
      addErrorAlert(error.message);
    }
  };

  const handleSave = async () => {
    setIsCreatingAssets(true);
    try {
      const uploadedFilesList = Object.values(uploadedFiles);

      const assets = [];
      for (const fileInfo of uploadedFilesList) {
        try {
          const createdAsset = await newAssetRequest(
            { file: fileInfo.fileId, name: fileInfo.name },
            null,
            LIBRARY_FORM_TYPES.MEDIA_FILES
          );
          assets.push(createdAsset?.asset);

          setUploadStatus((prev) => ({
            ...prev,
            [fileInfo.name]: { ...prev[fileInfo.name], state: 'completed' },
          }));
        } catch (error) {
          setUploadStatus((prev) => ({
            ...prev,
            [fileInfo.name]: { state: 'error' },
          }));
          addErrorAlert(error.message);
        }
      }

      setCreatedAssets(assets);
      if (assets.length > 0) {
        setStep(2);
      }
    } finally {
      setIsCreatingAssets(false);
    }
  };

  const handleTitle = () => {
    if (hasFilesSelected) {
      if (assetFiles?.length === 1) {
        return `${filesSelectedCount} ${t('fileSelected').toLowerCase()}`;
      }
      return `${filesSelectedCount} ${t('filesSelected').toLowerCase()}`;
    }
    return `${t('contentLabel')}`;
  };

  const areAllFilesUploaded = () => {
    return (
      assetFiles?.length > 0 &&
      assetFiles.every(
        (file) =>
          uploadStatus[file.name]?.state === 'uploaded' ||
          uploadStatus[file.name]?.state === 'completed'
      )
    );
  };

  const handleAssetsUpdate = async (updatedAssets) => {
    try {
      const refreshedAssets = await getAssetsByIdsRequest(updatedAssets.map((asset) => asset.id));
      if (refreshedAssets?.assets) {
        setCreatedAssets(refreshedAssets.assets);
      }
    } catch (error) {
      addErrorAlert(error.message);
    }
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
        step === 1 && (
          <TLayout.Footer>
            <Stack justifyContent="flex-end" fullWidth>
              <Button
                loading={isCreatingAssets}
                disabled={!areAllFilesUploaded()}
                onClick={handleSave}
              >
                {t('saveButton')}
              </Button>
            </Stack>
          </TLayout.Footer>
        )
      }
    >
      {isCreatingAssets && <LoadingOverlay visible />}
      {step === 1 && (
        <AddBulkResources
          control={control}
          t={t}
          handleTitle={handleTitle}
          hasFilesSelected={hasFilesSelected}
          assetFiles={assetFiles}
          uploadStatus={uploadStatus}
          onRemoveFile={removeFile}
        />
      )}
      {step === 2 && (
        <ManageBulkAssets
          initialData={createdAssets}
          assets={createdAssets}
          onAssetsUpdate={handleAssetsUpdate}
          t={t}
        />
      )}
    </TotalLayoutContainer>
  );
};

export default BulkAssetPage;
