import React from 'react';
import PropTypes from 'prop-types';
import { Box, TextClamp, Text } from '@bubbles-ui/components';
import { OpenIcon } from '@bubbles-ui/icons/solid';
import { useLinkSubmissionStyles } from './LinkSubmission.style';

function LinkSubmission({ assignation }) {
  const { classes } = useLinkSubmissionStyles();

  const submission = assignation?.metadata?.submission;

  if (!submission) {
    return null;
  }

  return (
    <Box className={classes.linkSubmission} onClick={() => window.open(submission)}>
      <TextClamp lines={1} showTooltip>
        <Text className={classes.linkSubmissionText}>{submission}</Text>
      </TextClamp>
      <Box>
        <OpenIcon />
      </Box>
    </Box>
  );
}

LinkSubmission.propTypes = {
  assignation: PropTypes.object,
};

export default LinkSubmission;
