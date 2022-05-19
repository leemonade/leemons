import React from 'react';
import PropTypes from 'prop-types';
import { Box, ImageLoader, Text } from '@bubbles-ui/components';
import { htmlToText } from '../helpers/htmlToText';

export default function QuestionTitle(props) {
  const { styles, question } = props;
  return (
    <Box className={styles.questionTitle}>
      <Box className={styles.questionTitleIcon}>
        <ImageLoader className="stroke-current" src={'/public/tests/question.svg'} />
      </Box>
      <Text size="md" role="productive" color="primary" strong>
        {htmlToText(question.question)}
      </Text>
    </Box>
  );
}

QuestionTitle.propTypes = {
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
