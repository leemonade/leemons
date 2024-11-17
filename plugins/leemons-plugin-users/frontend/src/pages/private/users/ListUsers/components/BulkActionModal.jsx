import React from 'react';
import PropTypes from 'prop-types';
import { Box, Modal, Progress, Text, createStyles } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@users/helpers/prefixPN';

const useStyles = createStyles((theme) => ({
  bar: {
    background: theme.other.global.background.color.primary.default,
  },
  label: {
    color: theme.other.global.content.color.text.dark,
  },
}));

function BulkActionModal({ opened, title, info }) {
  const [t] = useTranslateLoader(prefixPN('bulkActionModal'));
  const [value, setValue] = React.useState();
  const { classes } = useStyles();

  React.useEffect(() => {
    if (info) {
      setValue(info);
    }
  }, [info]);

  const getProgressLabel = () => {
    if (value?.state === 'finalize') return t('finalizing');
    return `${value?.completed > 100 ? 100 : value?.completed?.toFixed(2)}%`;
  };

  return (
    <Modal title={title || t('title')} opened={opened} onClose={() => {}} withCloseButton={false}>
      <Box sx={(theme) => ({ marginBottom: theme.spacing[2] })}>
        <Text role="productive">
          {value?.state === 'processing' ? t('bulkProgress', value) : t(value?.state)}
        </Text>
      </Box>
      {value?.state === 'processing' || value?.state === 'finalize' ? (
        <Progress
          classNames={classes}
          value={value?.completed > 100 ? 100 : value?.completed}
          label={getProgressLabel()}
          size="xl"
          radius="xl"
        />
      ) : null}
    </Modal>
  );
}

BulkActionModal.propTypes = {
  title: PropTypes.string,
  opened: PropTypes.bool,
  info: PropTypes.any,
};

export { BulkActionModal };
export default BulkActionModal;
