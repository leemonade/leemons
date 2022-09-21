import React from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash';
import {
  ActionButton,
  Alert,
  Box,
  Button,
  ContextContainer,
  InputWrapper,
  Stack,
  Table,
  Title,
} from '@bubbles-ui/components';
import ImagePicker from '@leebrary/components/ImagePicker';
import { TextEditorInput } from '@bubbles-ui/editors';
import { AddCircleIcon, ChevLeftIcon, EditIcon, RemoveIcon } from '@bubbles-ui/icons/outline';
import { useStore } from '@common';
import { useLayout } from '@layout/context';
import { getQuestionForTable } from '@feedback/helpers/getQuestionForTable';
import { Controller } from 'react-hook-form';
import QuestionForm from '@feedback/pages/private/feedback/Detail/components/QuestionForm';

export default function DetailQuestions({ form, t, onPrev, onNext }) {
  const [qStore, qRender] = useStore({
    newQuestion: false,
  });

  const { openDeleteConfirmationModal } = useLayout();
  const questions = form.watch('questions');

  function addQuestion() {
    qStore.newQuestion = true;
    qRender();
  }

  function onCancel() {
    qStore.newQuestion = false;
    qStore.questionIndex = null;
    qStore.question = null;
    qRender();
  }

  function onSave(question) {
    const currentQuestions = form.getValues('questions') || [];
    if (qStore.questionIndex !== null && qStore.questionIndex >= 0) {
      currentQuestions[qStore.questionIndex] = question;
    } else {
      currentQuestions.push(question);
    }
    form.setValue('questions', currentQuestions);
    onCancel();
  }

  if (qStore.newQuestion || qStore.question) {
    return (
      <QuestionForm
        t={t}
        onSave={onSave}
        defaultValues={qStore.newQuestion ? {} : qStore.question}
        onCancel={onCancel}
      />
    );
  }

  function editQuestion(index) {
    qStore.questionIndex = index;
    qStore.question = (form.getValues('questions') || [])[index];
    qRender();
  }

  function deleteQuestion(index) {
    openDeleteConfirmationModal({
      onConfirm: async () => {
        const newQuestions = form.getValues('questions') || [];
        newQuestions.splice(index, 1);
        form.setValue('questions', newQuestions);
      },
    })();
  }

  const tableHeaders = [
    {
      Header: t('questionLabel'),
      accessor: 'question',
      className: 'text-left',
    },
    {
      Header: t('responsesLabel'),
      accessor: 'responses',
      className: 'text-left',
    },
    {
      Header: t('typeLabel'),
      accessor: 'type',
      className: 'text-left',
    },
    {
      Header: t('actionsHeader'),
      accessor: 'actions',
    },
  ];

  return (
    <>
      <ContextContainer divided>
        <ContextContainer>
          <Stack alignItems="center" justifyContent="space-between">
            <Title order={4}>{t('questions')}</Title>
          </Stack>

          <Controller
            control={form.control}
            name="featuredImage"
            render={({ field }) => (
              <InputWrapper label={t('featuredImage')}>
                <ImagePicker required error={form.formState.errors.featuredImage} {...field} />
              </InputWrapper>
            )}
          />

          <Controller
            control={form.control}
            name="introductoryText"
            rules={{ required: t('introductoryTextRequired') }}
            render={({ field }) => (
              <TextEditorInput
                required
                error={form.formState.errors.introductoryText}
                label={t('introductoryText')}
                {...field}
              />
            )}
          />

          {questions && questions.length ? (
            <Table
              columns={tableHeaders}
              data={map(questions, (question, i) => ({
                ...getQuestionForTable(question, t),
                actions: (
                  <Stack justifyContent="end" fullWidth>
                    <ActionButton icon={<EditIcon />} onClick={() => editQuestion(i)} />
                    <ActionButton icon={<RemoveIcon />} onClick={() => deleteQuestion(i)} />
                  </Stack>
                ),
              }))}
            />
          ) : null}
          <Box>
            <Button variant="light" leftIcon={<AddCircleIcon />} onClick={addQuestion}>
              {t('addQuestion')}
            </Button>
          </Box>
          {qStore.trySend && form.formState.errors.questions ? (
            <Alert severity="error" closeable={false}>
              {form.formState.errors.questions?.message}
            </Alert>
          ) : null}
        </ContextContainer>
        <Stack alignItems="center" justifyContent="space-between">
          <Button
            variant="light"
            leftIcon={<ChevLeftIcon height={20} width={20} />}
            onClick={onPrev}
          >
            {t('previous')}
          </Button>
          <Button
            onClick={() => {
              qStore.trySend = true;
              qRender();
              form.handleSubmit(() => {
                onNext();
              })();
            }}
          >
            {t('publish')}
          </Button>
        </Stack>
      </ContextContainer>
    </>
  );
}

DetailQuestions.propTypes = {
  form: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  onNext: PropTypes.func,
  onPrev: PropTypes.func,
};
