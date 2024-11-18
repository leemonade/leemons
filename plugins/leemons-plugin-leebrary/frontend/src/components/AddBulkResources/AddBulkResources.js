import { Controller } from 'react-hook-form';

import { FileUpload, ContextContainer, TLayout } from '@bubbles-ui/components';
import { DownloadIcon } from '@bubbles-ui/icons/outline';
import propTypes from 'prop-types';

import BulkUploadTable from '../BulkUploadTable/BulkUploadTable';

const MAX_FILE_SIZE = 1073741824; // 1GB

const AddBulkResources = ({
  control,
  t,
  handleTitle,
  hasFilesSelected,
  assetFiles,
  uploadStatus,
  onRemoveFile,
}) => {
  return (
    <TLayout.Content>
      <ContextContainer spacing={4} title={handleTitle()}>
        {!hasFilesSelected ? (
          <Controller
            control={control}
            name="file"
            rules={{ required: t('requiredLabel') }}
            render={({ field: { ref, value, ...field } }) => (
              <FileUpload
                {...field}
                value={assetFiles}
                initialFiles={assetFiles}
                maxSize={MAX_FILE_SIZE}
                icon={<DownloadIcon height={32} width={32} />}
                title={t('fileUploadTitle')}
                subtitle={t('fileUploadSubtitle')}
                errorMessage={{
                  title: t('fileUploadErrorTitle'),
                  message: t('fileUploadErrorMessage'),
                }}
                hideUploadButton
                showItemsToUpload={false}
                accept={[
                  // Imágenes
                  'image/*',
                  // Videos
                  'video/*',
                  // Audio
                  'audio/*',
                  // Documentos de texto
                  '.txt',
                  '.pdf',
                  'application/pdf',
                  // Microsoft Office
                  '.doc',
                  '.docx',
                  '.xls',
                  '.xlsx',
                  '.ppt',
                  '.pptx',
                  // OpenDocument
                  '.odt',
                  '.ods',
                  '.odp',
                ]}
              />
            )}
          />
        ) : (
          <BulkUploadTable
            data={assetFiles}
            uploadStatus={uploadStatus}
            t={t}
            onRemoveFile={onRemoveFile}
          />
        )}
      </ContextContainer>
    </TLayout.Content>
  );
};

AddBulkResources.propTypes = {
  control: propTypes.any,
  t: propTypes.any,
  handleTitle: propTypes.any,
  hasFilesSelected: propTypes.any,
  assetFiles: propTypes.any,
  uploadStatus: propTypes.any,
  onRemoveFile: propTypes.any,
};

export default AddBulkResources;
