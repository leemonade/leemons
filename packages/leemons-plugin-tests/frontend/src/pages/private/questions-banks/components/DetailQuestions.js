import React from 'react';
import PropTypes from 'prop-types';
import { Box, Button, ContextContainer, Stack, Title } from '@bubbles-ui/components';
import { useStore } from '@common';
import QuestionForm from './QuestionForm';

export default function DetailQuestions({ form, t, store, render, onNext }) {
  const [qStore, qRender] = useStore({
    newQuestion: false,
  });

  function next() {
    form.handleSubmit(() => {
      onNext();
    })();
  }

  function addQuestion() {
    qStore.newQuestion = true;
    qRender();
  }

  function onSave() {}

  function onCancel() {
    qStore.newQuestion = false;
    qRender();
  }

  React.useEffect(() => {
    // eslint-disable-next-line no-param-reassign
    store.activeStep = 'questions';
    render();
  }, []);

  if (qStore.newQuestion) {
    return (
      <QuestionForm
        t={t}
        onSave={onSave}
        defaultValues={qStore.newQuestion ? {} : {}}
        onCancel={onCancel}
      />
    );
  }

  return (
    <ContextContainer>
      <Stack alignItems="center" justifyContent="space-between">
        <Title order={4}>{t('questions')}</Title>
        <Box>
          <Button onClick={addQuestion}>{t('addQuestion')}</Button>
        </Box>
      </Stack>
    </ContextContainer>
  );
}

DetailQuestions.propTypes = {
  form: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  store: PropTypes.object.isRequired,
  render: PropTypes.func.isRequired,
};
