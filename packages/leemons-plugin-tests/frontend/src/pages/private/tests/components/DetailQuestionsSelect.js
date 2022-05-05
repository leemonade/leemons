import React from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  Box,
  Button,
  ContextContainer,
  InputWrapper,
  Paragraph,
  Stack,
  Title,
} from '@bubbles-ui/components';
import QuestionsTable from './QuestionsTable';

export default function DetailQuestionsSelect({
  back,
  questions,
  t,
  onChange,
  next,
  value = [],
  reorderMode,
  error,
}) {
  return (
    <ContextContainer>
      {questions && questions.length > 0 ? (
        <Title order={6}>
          {t('nQuestions', { n: reorderMode ? value.length : questions.length })}
        </Title>
      ) : null}

      <Stack justifyContent="space-between">
        <Box>
          <Paragraph>
            {t(reorderMode ? 'reorderQuestionsDescription' : 'selectQuestionDescription')}
          </Paragraph>
          <Box>
            <Button variant="link" onClick={back}>
              {t('returnFilters')}
            </Button>
          </Box>
        </Box>
        <Box>
          {questions && questions.length > 0 ? (
            <ContextContainer>
              <Box>
                <Button onClick={next}>
                  {t(reorderMode ? 'continue' : 'assignSelectedQuestions')}
                </Button>
              </Box>
              <InputWrapper error={error} />
            </ContextContainer>
          ) : null}
        </Box>
      </Stack>
      {questions && questions.length > 0 ? (
        <Box>
          <QuestionsTable
            questions={questions}
            value={value}
            onChange={(e) => onChange(e)}
            reorderMode={reorderMode}
          />
        </Box>
      ) : (
        <Box>
          <Alert closeable={false} severity="error">
            {t('selectQuestionNothingToSelect')}
          </Alert>
        </Box>
      )}
    </ContextContainer>
  );
}

DetailQuestionsSelect.propTypes = {
  t: PropTypes.func.isRequired,
  next: PropTypes.func.isRequired,
  back: PropTypes.func.isRequired,
  questionBank: PropTypes.object,
  questions: PropTypes.array,
  value: PropTypes.array,
  onChange: PropTypes.func,
  reorderMode: PropTypes.bool,
  error: PropTypes.any,
};
