import React, { useCallback, useRef, useMemo } from 'react';
import _, { find } from 'lodash';
import PropTypes from 'prop-types';
import { ContextContainer, Alert, Button, Stack, Text, FileUpload } from '@bubbles-ui/components';
import { CloudUploadIcon } from '@bubbles-ui/icons/outline';
import { deleteAssetRequest, newAssetRequest, listCategoriesRequest } from '@leebrary/request';
import { useApi } from '@common';
import { addErrorAlert } from '@layout/alert';
import handleDeliverySubmission from './handleDeliverySubmission';

function TaggedText({ tag, text }) {
  return (
    <Stack>
      <Text strong>{tag}:&nbsp;</Text>
      <Text>{text}</Text>
    </Stack>
  );
}

TaggedText.propTypes = {
  tag: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

export default function File({ assignation, onLoading, onSubmit, onError, value }) {
  const [categories] = useApi(listCategoriesRequest);
  const category = (categories || [])?.find(({ key }) => key === 'media-files')?.id;

  const fileData = assignation?.instance?.assignable?.submission?.data;

  const savedFiles = useRef(value);
  const files = useRef();
  const saveSubmission = useMemo(() => handleDeliverySubmission(assignation), [assignation]);
  const handleSubmit = useCallback(async () => {
    onLoading();

    // 1. Remove the assets saved
    // 2. Save the new assets

    const filesToSave = !files.current ? [] : [files.current].flat().filter((file) => !file.id);
    const filesToRemove = _.difference(savedFiles.current, files.current);
    const filesToKeep = _.difference(savedFiles.current, filesToRemove);

    try {
      if (filesToRemove?.length) {
        await Promise.all(filesToRemove.map((file) => deleteAssetRequest(file.id)));
      }

      let filesSaved = [];

      if (filesToSave?.length) {
        filesSaved = await Promise.all(
          filesToSave.map((file) =>
            newAssetRequest(
              { file, name: file.name, indexable: 0, public: 1 },
              category,
              'media-files'
            )
          )
        );

        filesSaved = _.map(_.map(filesSaved, 'asset'), (file) => _.pick(file, ['id', 'name']));
      }

      filesSaved = [...filesToKeep, ...filesSaved];
      await saveSubmission(filesSaved, !filesSaved.length);
      savedFiles.current = filesSaved;

      onSubmit(Boolean(savedFiles.current.length));
    } catch (e) {
      onError(e.message);
    }
  }, [onSubmit, onError, onLoading, category]);
  return (
    <>
      <FileUpload
        icon={<CloudUploadIcon height={32} width={32} />}
        title="Click to browse your file"
        subtitle="or drop here a file from your computer"
        errorMessage={{ title: 'Error', message: 'File was rejected' }}
        hideUploadButton
        multipleUpload={fileData?.multipleFiles}
        single={!fileData?.multipleFiles}
        initialFiles={savedFiles.current || []}
        onChange={(newFiles) => {
          files.current = newFiles;
        }}
        onReject={(allErrors) => {
          allErrors.forEach((error) => {
            addErrorAlert(
              `File ${error.file.name} was rejected: ${error?.errors
                ?.map((e) => e.message)
                .join(', ')}`
            );
          });
        }}
        // inputWrapperProps={{ error: errors.file }}
        accept={fileData?.extensions && Object.values(fileData.extensions)}
        maxSize={fileData?.maxSize * 1024 * 1024}
        // {...field}
      />
      <Stack>
        <Button onClick={handleSubmit}>Upload</Button>
      </Stack>
    </>
  );
}

File.propTypes = {
  submission: PropTypes.shape({
    data: PropTypes.shape({
      multipleFiles: PropTypes.bool,
      extensions: PropTypes.arrayOf(PropTypes.string),
      maxSize: PropTypes.number,
    }),
  }).isRequired,
};
