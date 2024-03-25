import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, ContextContainer, FileUpload, Text, useDebouncedValue } from '@bubbles-ui/components';
import { DownloadIcon } from '@bubbles-ui/icons/outline';
import { differenceBy, isArray, isEqual, sortBy } from 'lodash';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { v4 } from 'uuid';
import useStudentAssignationMutation from '@tasks/hooks/student/useStudentAssignationMutation';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@tasks/helpers';
import { deleteAssetRequest, newAssetRequest } from '@leebrary/request';

function updateFile({ updateFiles, id, status, leebraryId }) {
  updateFiles((prevFiles) =>
    prevFiles.map((prevFile) => {
      if (prevFile.id === id) {
        return { ...prevFile, status, leebraryId };
      }
      return prevFile;
    })
  );
}

function useUploadFiles({ files, updateFiles, t }) {
  useEffect(() => {
    files.forEach(async (file) => {
      if (!file.status && !file.leebraryId) {
        updateFile({ updateFiles, id: file.id, status: 'loading' });
        try {
          const {
            asset: { id },
          } = await newAssetRequest(
            { name: file.name, file: file.File, public: true, indexable: false },
            null,
            'media-files'
          );

          updateFile({ updateFiles, id: file.id, status: 'success', leebraryId: id });
        } catch (error) {
          updateFile({ updateFiles, id: file.id, status: 'error' });

          const errorMessage = t('errorAlert', {
            fileName: error.file.name,
            error: error?.errors?.map((e) => e.message).join(', '),
          });
          addErrorAlert(errorMessage);
        }
      }
    });
  }, [files]);
}

function useUpdateSubmission({ assignation, value }) {
  const isFirstRender = useRef(true);
  const { mutateAsync } = useStudentAssignationMutation();

  const [debouncedValue] = useDebouncedValue(value, 100, { leading: false });
  const filesToSave = useMemo(() => {
    if (!debouncedValue.length) {
      return null;
    }

    const result = (debouncedValue || [])
      .filter((file) => file.status === 'success')
      .map((file) => ({ name: file.name, id: file.leebraryId }));

    if (!result.length) {
      return null;
    }

    return result;
  }, [debouncedValue]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    mutateAsync({
      instance: assignation.instance.id,
      student: assignation.user,
      metadata: {
        ...assignation.metadata,
        submission: filesToSave,
      },
    });
  }, [JSON.stringify(filesToSave)]);
}

function File({ assignation, preview }) {
  const [t] = useTranslateLoader(prefixPN('task_realization.submission_file'));

  const initialFiles = useMemo(() => {
    if (assignation?.metadata?.submission) {
      return (assignation?.metadata?.submission || []).map((file) => ({
        name: file.name,
        leebraryId: file.id,
        status: 'success',
        id: v4(),
      }));
    }
    return [];
  }, []);

  const [value, setValue] = useState(initialFiles);

  useUploadFiles({ files: value || [], updateFiles: setValue, t });
  useUpdateSubmission({ assignation, value });

  const submissionData = assignation?.instance?.assignable?.submission?.data ?? {};

  const { names: extensionNames, format: extensionFormat } = useMemo(() => ({
    names: Object.keys(submissionData.extensions).map((key) => key.replace(/^([^.])/, '.$1')),
    format: Object.values(submissionData.extensions),
  }));

  return (
    <Box>
      <ContextContainer title={t('title')}>
        <Box>
          <Box>
            <Text>
              <b>{t('format')}:</b> {extensionNames.join(', ')}
            </Text>
          </Box>
          <Box>
            <Text>
              <b>{t('size')}:</b> {submissionData.maxSize}MB
            </Text>
          </Box>
        </Box>
        <Box sx={{ maxWidth: 610 }}>
          <FileUpload
            icon={<DownloadIcon height={32} width={32} />}
            title={t('upload_title')}
            subtitle={t('upload_subtitle')}
            hideUploadButton
            multipleUpload={!!submissionData.multipleFiles}
            single={!submissionData.multipleFiles}
            initialFiles={value ?? []}
            accept={extensionFormat}
            maxSize={submissionData.maxSize ? submissionData.maxSize * 1024 * 1024 : undefined}
            disabled={!!preview}
            onChange={(_newFiles) => {
              setValue((files) => {
                const newFiles = isArray(_newFiles) ? _newFiles : [_newFiles];

                if (isEqual(newFiles, files)) {
                  return files;
                }

                const deletedFiles = differenceBy(
                  sortBy(files, 'id'),
                  sortBy(newFiles, 'id'),
                  'id'
                );

                deletedFiles.forEach((file) => {
                  if (file.leebraryId) {
                    deleteAssetRequest(file.leebraryId)
                      .catch((e) => addErrorAlert({ message: e.message }))
                      .then(() => addSuccessAlert(`deleted ${file.name} - ${file.leebraryId}`));
                  }
                });

                return (Array.isArray(newFiles) ? newFiles : [newFiles]).map((file) => ({
                  id: v4(),
                  name: file.name,
                  path: file.path,
                  File: file,
                  status: file.status,
                  leebraryId: file.leebraryId,
                }));
              });
            }}
            onReject={(allErrors) => {
              allErrors.forEach((error) => {
                const errorMessage = t('errorAlert', {
                  fileName: error.file.name,
                  error: error?.errors?.map((e) => e.message).join(', '),
                });

                addErrorAlert(errorMessage);
              });
            }}
          />
        </Box>
      </ContextContainer>
    </Box>
  );
}

File.propTypes = {
  assignation: PropTypes.object,
  preview: PropTypes.bool,
};

export default File;
