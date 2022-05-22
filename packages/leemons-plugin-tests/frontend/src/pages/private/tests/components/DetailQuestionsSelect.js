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
import { ChevLeftIcon } from '@bubbles-ui/icons/outline';
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
    <ContextContainer divided>
      <ContextContainer>
        {questions && questions.length > 0 ? (
          <Title order={6}>
            {t('nQuestions', { n: reorderMode ? value.length : questions.length })}
          </Title>
        ) : null}

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
              <InputWrapper error={error} />
            </ContextContainer>
          ) : null}
        </Box>
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
      <Stack fullWidth justifyContent="space-between">
        <Box>
          <Button
            compact
            variant="light"
            leftIcon={<ChevLeftIcon height={20} width={20} />}
            onClick={back}
          >
            {t('previous')}
          </Button>
        </Box>
        <Box>
          <Button onClick={next}>{t(reorderMode ? 'continue' : 'assignSelectedQuestions')}</Button>
        </Box>
      </Stack>
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
