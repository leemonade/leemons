import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@bubbles-ui/components';
import QuestionTitle from '../../QuestionTitle';
import QuestionNoteClues from '../../QuestionNoteClues';

export default function Index(props) {
  const { styles, question } = props;

  return (
    <>
      <Box className={styles.questionCard}>
        <QuestionTitle {...props} />
      </Box>
      <QuestionNoteClues {...props} />
    </>
  );
}

Index.propTypes = {
  classes: PropTypes.any,
  styles: PropTypes.any,
  t: PropTypes.any,
  cx: PropTypes.any,
  store: PropTypes.any,
  question: PropTypes.any,
  prevStep: PropTypes.func,
  nextStep: PropTypes.func,
  isFirstStep: PropTypes.bool,
};
