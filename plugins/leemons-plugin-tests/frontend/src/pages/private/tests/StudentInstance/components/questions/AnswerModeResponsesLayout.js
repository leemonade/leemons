import { Box, Stack } from '@bubbles-ui/components';
import PropTypes from 'prop-types';

import QuestionNoteClues from '../QuestionNoteClues';
import StemResource from '../StemResource';

const AnswerModeResponsesLayout = ({
  ResponsesComponent,
  displayStemMediaHorizontally,
  resourceWidthPercentage,
  ...props
}) => {
  const { question } = props;

  const resourceWidth = `${resourceWidthPercentage || 50}%`;
  const responsesWidth = `${100 - resourceWidthPercentage}%`;

  return (
    <>
      {/* For some questions, when stem resource is an image, items must be displayed horizontally */}
      {question.stemResource && displayStemMediaHorizontally ? (
        <Stack fullWidth spacing={2}>
          <Box noFlex sx={{ width: resourceWidth }}>
            <StemResource {...props} asset={question.stemResource} />
          </Box>
          <Box sx={{ width: responsesWidth }}>
            <ResponsesComponent {...props} />
          </Box>
        </Stack>
      ) : (
        <>
          {question.stemResource && <StemResource {...props} asset={question.stemResource} />}
          <ResponsesComponent {...props} />
        </>
      )}
      <QuestionNoteClues {...props} />
    </>
  );
};

AnswerModeResponsesLayout.propTypes = {
  ResponsesComponent: PropTypes.func,
  displayStemMediaHorizontally: PropTypes.bool,
  question: PropTypes.object,
  resourceWidthPercentage: PropTypes.number,
};

export default AnswerModeResponsesLayout;
