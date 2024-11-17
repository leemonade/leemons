import { Box, Modal, Progress, Text, createStyles } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import PropTypes from 'prop-types';
import React from 'react';
import prefixPN from '../helpers/prefixPN';

const useUploadingFileModalStyles = createStyles((theme) => ({
  bar: {
    background: theme.other.global.background.color.primary.default,
  },
  label: {
    color: theme.other.global.content.color.text.dark,
  },
}));

function UploadingFileModal({ opened, title, info }) {
  const [t] = useTranslateLoader(prefixPN('uploadFileModal'));
  const [value, setValue] = React.useState();
  const { classes } = useUploadingFileModalStyles();

  React.useEffect(() => {
    if (info) {
      setValue(info);
    }
  }, [info]);

  const getProgressLabel = () => {
    if (value?.state === 'finalize') return t('finalizing');
    return `${value?.percentageCompleted > 100 ? 100 : value?.percentageCompleted?.toFixed(2)}%`;
  };

  return (
    <Modal title={title || t('title')} opened={opened} onClose={() => {}} withCloseButton={false}>
      <Box sx={(theme) => ({ marginBottom: theme.spacing[2] })}>
        <Text role="productive">
          {value?.state === 'uploading' ? t('fileOf', value) : t(value?.state)}
        </Text>
      </Box>
      {value?.state === 'uploading' || value?.state === 'finalize' ? (
        <Progress
          classNames={classes}
          value={value?.percentageCompleted > 100 ? 100 : value?.percentageCompleted}
          label={getProgressLabel()}
          size="xl"
          radius="xl"
        />
      ) : null}
    </Modal>
  );
}

UploadingFileModal.propTypes = {
  title: PropTypes.string,
  opened: PropTypes.bool,
  info: PropTypes.any,
};

export { UploadingFileModal };
export default UploadingFileModal;
