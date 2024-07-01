import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import { Box, ContextContainer, FileUpload, Text, useDebouncedValue } from '@bubbles-ui/components';
import { DownloadIcon } from '@bubbles-ui/icons/outline';
import { uuidv4 } from '@bubbles-ui/leemons';

import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { deleteAssetRequest, newAssetRequest } from '@leebrary/request';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@tasks/helpers';
import useStudentAssignationMutation from '@tasks/hooks/student/useStudentAssignationMutation';
import mime from 'mime';
import {
  FileUploadProvider,
  useFileUploadStore,
} from '../../../../../../../../stores/filesUploadedStore';

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

  const files = useFileUploadStore((state) => state.files);
  const filesArray = useMemo(() => files.values().toArray(), [files]);

  const { addNewFiles, removeMissingFiles, updateLeebraryId, changeStatus } = useFileUploadStore(
    (state) => state.actions
  );

  useUpdateSubmission({ assignation, value: filesArray });

  const submissionData = useMemo(
    () => assignation?.instance?.assignable?.submission?.data ?? {},
    [assignation?.instance?.assignable?.submission?.data]
  );

  const sanitizeSubmissionData = (submission) => {
    const newExtensions = {};
    if (!submission) {
      return null;
    }
    const extractExtensions = Object.keys(submission?.extensions).map((key) =>
      key.replace(/[ .]/g, '')
    );
    extractExtensions.forEach((extension) => {
      if (extension.includes('rtf')) {
        newExtensions[extension] = '.rtf';
      } else {
        newExtensions[extension] = mime.getType(extension);
      }
    });
    return {
      ...submission,
      extensions: newExtensions,
    };
  };

  const submissionDataSanitized = useMemo(
    () => sanitizeSubmissionData(submissionData),
    [submissionData]
  );

  const { names: extensionNames, format: extensionFormat } = useMemo(() => {
    const extensions = Object.keys(submissionDataSanitized.extensions);
    const formats = Object.values(submissionDataSanitized.extensions);
    const additionalFormats = [];

    formats.forEach((format) => {
      if (format === '.rtf') {
        additionalFormats.push('application/rtf', 'text/rtf');
      }
    });

    return {
      names: extensions.map((key) => key.replace(/^([^.])/, '.$1')),
      format: [...formats, ...additionalFormats],
    };
  }, [submissionDataSanitized, submissionData]);

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
            initialFiles={filesArray}
            accept={extensionFormat}
            maxSize={submissionData.maxSize ? submissionData.maxSize * 1024 * 1024 : undefined}
            disabled={!!preview}
            onChange={(_inputFiles) => {
              const inputFiles = Array.isArray(_inputFiles) ? _inputFiles : [_inputFiles];
              const removedFiles = removeMissingFiles(inputFiles);
              const newFiles = addNewFiles(inputFiles, 'loading');

              newFiles.forEach(async (file) => {
                try {
                  const {
                    asset: { id },
                  } = await newAssetRequest(
                    { name: file.name, file: file.File, public: true, indexable: false },
                    null,
                    'media-files'
                  );

                  updateLeebraryId(file.id, id);
                  changeStatus(file.id, 'success');

                  addSuccessAlert(t('uploadSuccess', { fileName: file.name }));
                } catch (error) {
                  changeStatus(file.id, 'error');
                  const errorMessage = t('uploadError', {
                    fileName: file.name,
                  });

                  addErrorAlert(errorMessage, error.message ?? error.error);
                }
              });

              removedFiles.forEach((file) => {
                if (file.leebraryId) {
                  deleteAssetRequest(file.leebraryId)
                    .then(() => addSuccessAlert(t('removedSuccess', { fileName: file.name })))
                    .catch((e) =>
                      addErrorAlert(t('removedError', { fileName: file.name }), e.message)
                    );
                }
              });
            }}
            onReject={(allErrors) => {
              allErrors.forEach((error) => {
                const errorMessage = t('uploadError', {
                  fileName: error.file.name,
                });

                addErrorAlert(errorMessage, error?.errors?.map((e) => e.message).join(', '));
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

function FileWrapper(props) {
  const { assignation } = props;

  const [initialFiles] = useState(() => {
    if (assignation?.metadata?.submission) {
      return (assignation?.metadata?.submission || []).map((file) => ({
        name: file.name,
        leebraryId: file.id,
        status: 'success',
        id: uuidv4(),
      }));
    }
    return [];
  });

  return (
    <FileUploadProvider initialFiles={initialFiles}>
      <File {...props} />
    </FileUploadProvider>
  );
}

FileWrapper.propTypes = File.propTypes;

export default FileWrapper;
