import ScoreFeedback from '@assignables/widgets/dashboard/nya/components/EvaluationCardStudent/components/ScoreFeedback';
import { useScoreFeedbackData } from '@assignables/widgets/dashboard/nya/hooks';
import { ContextContainer, Box, Stack } from '@bubbles-ui/components';
import PropTypes from 'prop-types';

import ResultsGraph from '../ResultsGraph';

import Feedback from './Feedback';

function EvaluationAndFeedback({
  assignation,
  subject,
  questions,
  questionResponses,
  isTeacher,
  onSaveFeedback,
  t,
}) {
  const { instance, program, score } = useScoreFeedbackData({ assignation, subject });
  return (
    <ContextContainer spacing={5}>
      <Stack spacing={5}>
        <Box>
          <Stack
            fullHeight
            justifyContent="center"
            alignItems="center"
            sx={(theme) => ({
              width: 160,
            })}
          >
            <ScoreFeedback
              instance={instance}
              program={program}
              score={score}
              isFeedback={false}
              hideBadge
              fullSize
            />
          </Stack>
        </Box>
        <ResultsGraph questions={questions} questionResponses={questionResponses} />
      </Stack>

      <Stack>
        <Feedback
          isTeacher={isTeacher}
          instance={instance}
          assignation={assignation}
          onSaveFeedback={onSaveFeedback}
          t={t}
        />
      </Stack>
    </ContextContainer>
  );
}

export default EvaluationAndFeedback;

EvaluationAndFeedback.propTypes = {
  assignation: PropTypes.object,
  subject: PropTypes.string,
  isTeacher: PropTypes.bool,
  t: PropTypes.func,
  questions: PropTypes.array,
  questionResponses: PropTypes.array,
  onSaveFeedback: PropTypes.func,
};
