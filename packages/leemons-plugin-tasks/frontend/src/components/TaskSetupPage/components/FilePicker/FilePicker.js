import React from 'react';
import PropTypes from 'prop-types';
import { FileUpload } from '@bubbles-ui/components';
import { CloudUploadIcon } from '@bubbles-ui/icons/outline';

function FilePicker({ accept = 'image/*', multipleUpload = false, initialFiles, onChange }) {
  return (
    <FileUpload
      accept={accept}
      multipleUpload={multipleUpload}
      single={!multipleUpload}
      title="Click to browse your file"
      icon={<CloudUploadIcon height={32} width={32} />}
      subtitle="or drop here a file from your computer"
      hideUploadButton
      initialFiles={initialFiles}
      onChange={onChange}
      onReject={() => {}}
    />
  );
}

FilePicker.propTypes = {
  multipleUpload: PropTypes.bool,
  onChange: PropTypes.func,
  accept: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  initialFiles: PropTypes.array,
};

export default FilePicker;
