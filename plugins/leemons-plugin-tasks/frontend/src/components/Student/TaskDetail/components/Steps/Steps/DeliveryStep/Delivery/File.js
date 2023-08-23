import React, { useCallback, useRef, useMemo } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { FileUpload } from '@bubbles-ui/components';
import { CloudUploadIcon } from '@bubbles-ui/icons/outline';
import { deleteAssetRequest, newAssetRequest, listCategoriesRequest } from '@leebrary/request';
import { useApi } from '@common';
import { addErrorAlert } from '@layout/alert';
import handleDeliverySubmission from './handleDeliverySubmission';

export default function File({ assignation, updateStatus, onSave, value, labels: _labels }) {
  const labels = _labels?.submission_type?.file;

  const [categories] = useApi(listCategoriesRequest);
  const category = (categories || [])?.find(({ key }) => key === 'media-files')?.id;

  const fileData = assignation?.instance?.assignable?.submission?.data;

  const savedFiles = useRef(value || []);
  const files = useRef(value || []);
  const saveSubmission = useMemo(() => handleDeliverySubmission(assignation), [assignation]);
  const handleSubmit = useCallback(async () => {
    updateStatus('loading');

    // 1. Remove the assets saved
    // 2. Save the new assets

    const filesToSave = !files.current ? [] : [files.current].flat().filter((file) => !file.id);
    const filesToRemove = _.difference(savedFiles.current, files.current);
    const filesToKeep = _.difference(savedFiles.current, filesToRemove);

    try {
      if (!filesToSave?.length && !filesToRemove?.length) {
        updateStatus(filesToKeep?.length ? 'submitted' : 'cleared');
        return true;
      }

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
      updateStatus(savedFiles.current.length ? 'submitted' : 'cleared');
      return true;
    } catch (e) {
      updateStatus('error', e.message);
      return false;
    }
  }, [updateStatus, category]);

  onSave.current = handleSubmit;
  return (
    <>
      <FileUpload
        icon={<CloudUploadIcon height={32} width={32} />}
        title={labels?.uploadTitle}
        subtitle={labels?.uploadSubtitle}
        errorMessage={{
          title: labels?.errorMessage?.title,
          message: labels?.errorMessage?.message,
        }}
        hideUploadButton
        multipleUpload={fileData?.multipleFiles}
        single={!fileData?.multipleFiles}
        initialFiles={savedFiles.current || []}
        onChange={(newFiles) => {
          if (_.isEqual(newFiles, savedFiles.current)) {
            if (!newFiles.length) {
              updateStatus('cleared');
            } else {
              updateStatus('submitted');
            }
            return;
          }
          updateStatus('changed');
          files.current = newFiles;
        }}
        onReject={(allErrors) => {
          allErrors.forEach((error) => {
            const errorMessage = labels?.errorAlert
              ?.replace('{{fileName}}', error.file.name)
              .replace('{{error}}', error?.errors?.map((e) => e.message).join(', '));

            addErrorAlert(errorMessage);
          });
        }}
        // inputWrapperProps={{ error: errors.file }}
        accept={fileData?.extensions && Object.values(fileData.extensions)}
        maxSize={fileData?.maxSize * 1024 * 1024}
        // {...field}
      />
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
