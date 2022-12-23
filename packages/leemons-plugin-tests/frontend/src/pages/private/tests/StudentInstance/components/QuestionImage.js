import React from 'react';
import PropTypes from 'prop-types';
import { Box, Text, ModalZoom } from '@bubbles-ui/components';
import { LeebraryImage } from '@leebrary/components';

export default function QuestionImage(props) {
  const { styles, question, cx, style = 1 } = props;

  if (question.questionImage?.cover) {
    if (style === 1) {
      let classImage = styles.questionImage;
      if (question.questionImage.description) {
        classImage = cx(classImage, styles.questionImageBottomMargin);
      }
      return (
        <Box className={styles.questionImageContainer}>
          <ModalZoom>
            <LeebraryImage className={classImage} src={question.questionImage} />
          </ModalZoom>
          {question.questionImage.description ? (
            <Text role="productive" size="md" color="primary">
              {question.questionImage.description}
            </Text>
          ) : null}
        </Box>
      );
    }
  }

  return null;
}

QuestionImage.propTypes = {
  classes: PropTypes.any,
  styles: PropTypes.any,
  t: PropTypes.any,
  cx: PropTypes.any,
  store: PropTypes.any,
  question: PropTypes.any,
  prevStep: PropTypes.func,
  nextStep: PropTypes.func,
  isFirstStep: PropTypes.bool,
  style: PropTypes.number,
};
