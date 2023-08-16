import { Alert, Box, Button, ContextContainer, InputWrapper, Stack } from '@bubbles-ui/components';
import { ChevLeftIcon } from '@bubbles-ui/icons/outline';
import PropTypes from 'prop-types';
import React from 'react';
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
        {/*
        // Juanjo: quitar que no aporta nada: https://www.notion.so/leemons/Redise-o-m-nimo-test-botones-y-poco-m-s-de26307f47554dd2b52f6c1b697e03d8#16f056fd83434061982b04a7cf918791
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
        */}

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
              hideOpenIcon
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
