import { Box } from '@bubbles-ui/components';
import { useStore } from '@common';
import PropTypes from 'prop-types';

import Question from './Question';

export default function QuestionList(props) {
  const [store, render] = useStore({
    questionNumber: 0,
  });
  const isLast = store.questionNumber === props.store.questions.length - 1;
  const question = props.store.questions[store.questionNumber];

  return (
    <Box>
      <Question
        {...props}
        prevStep={() => {
          if (store.questionNumber > 0) {
            store.questionNumber -= 1;
            render();
          } else {
            props.prevStep();
          }
        }}
        nextStep={async (e) => {
          if (isLast) {
            await props.finishStep(e);
          } else {
            store.questionNumber += 1;
            render();
            // props.nextStep(e);
          }
        }}
        question={question}
        index={store.questionNumber}
        isLast={isLast}
        saveQuestion={() => props.saveQuestion(question.id)}
      />
    </Box>
  );
}

QuestionList.propTypes = {
  classes: PropTypes.any,
  styles: PropTypes.any,
  t: PropTypes.any,
  cx: PropTypes.any,
  store: PropTypes.any,
  prevStep: PropTypes.func,
  nextStep: PropTypes.func,
  isFirstStep: PropTypes.bool,
  question: PropTypes.any,
  render: PropTypes.func,
  index: PropTypes.number,
  finishStep: PropTypes.func,
  saveQuestion: PropTypes.func,
  onReturn: PropTypes.func,
};
