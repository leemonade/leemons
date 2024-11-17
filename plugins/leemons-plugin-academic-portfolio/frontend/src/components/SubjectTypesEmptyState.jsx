import React from 'react';
import { Box, createStyles, Paragraph } from '@bubbles-ui/components';
import propTypes from 'prop-types';
import emptyStateImg from './assets/empty-state-image.png';

const useEmptyStateStyles = createStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing[2],
    width: '100%',
    padding: theme.spacing[8],
    flex: 1,
  },
  textBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: 370,
  },
  text: {
    textAlign: 'center',
  },
  image: {
    maxHeight: 117,
  },
}));

const SubjectTypesEmptyState = ({ labels }) => {
  const { classes } = useEmptyStateStyles({});
  return (
    <Box className={classes.root}>
      <img src={emptyStateImg} className={classes.image} alt={labels?.altText} />
      <Box className={classes.textBox}>
        <Paragraph className={classes.text}>{labels?.text}</Paragraph>
      </Box>
    </Box>
  );
};

SubjectTypesEmptyState.propTypes = {
  labels: propTypes.object,
};

export default SubjectTypesEmptyState;
