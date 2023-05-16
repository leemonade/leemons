import { Modal, Progress } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import PropTypes from 'prop-types';
import React from 'react';
import prefixPN from '../helpers/prefixPN';

function UploadingFileModal({ opened, title, percentage }) {
  const [t] = useTranslateLoader(prefixPN('uploadFileModal'));

  return (
    <Modal title={title || t('title')} opened={opened} onClose={() => {}} withCloseButton={false}>
      <Progress
        value={percentage}
        label={`${percentage ? percentage.toFixed(2) : 100}%`}
        size="xl"
        radius="xl"
      />
    </Modal>
  );
}

UploadingFileModal.propTypes = {
  title: PropTypes.string,
  opened: PropTypes.bool,
  percentage: PropTypes.number,
};

export { UploadingFileModal };
export default UploadingFileModal;
