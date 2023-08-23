import {
  ActionButton,
  Alert,
  Box,
  Button,
  ContextContainer,
  InputWrapper,
  Stack,
  TableInput,
  Textarea,
  Title,
} from '@bubbles-ui/components';
import { TextEditorInput } from '@bubbles-ui/editors';
import { AddCircleIcon, ChevLeftIcon, EditIcon, RemoveIcon } from '@bubbles-ui/icons/outline';
import { useStore } from '@common';
import { getQuestionForTable } from '@feedback/helpers/getQuestionForTable';
import QuestionForm from '@feedback/pages/private/feedback/Detail/components/QuestionForm';
import { useLayout } from '@layout/context';
import ImagePicker from '@leebrary/components/ImagePicker';
import { map } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { Controller } from 'react-hook-form';

export default function DetailQuestions({ saving, form, t, onPrev, onNext }) {
  const [qStore, qRender] = useStore({
    newQuestion: false,
    isDirty: false,
    questionChanged: 1,
  });

  const { openDeleteConfirmationModal } = useLayout();
  const questions = form.watch('questions');

  function addQuestion() {
    qStore.newQuestion = true;
    qStore.questionChanged++;
    qRender();
  }

  function onCancel() {
    qStore.newQuestion = false;
    qStore.questionIndex = null;
    qStore.question = null;
    qStore.questionChanged++;
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
    qStore.questionChanged++;
    qRender();
    onCancel();
  }

  function editQuestion(index) {
    qStore.questionIndex = index;
    qStore.questionChanged++;
    qStore.question = (form.getValues('questions') || [])[index];
    qRender();
  }

  function deleteQuestion(index) {
    openDeleteConfirmationModal({
      onConfirm: async () => {
        const newQuestions = form.getValues('questions') || [];
        newQuestions.splice(index, 1);
        form.setValue('questions', newQuestions);
        qStore.questionChanged++;
        qRender();
      },
    })();
  }

  const questionsForTable = React.useMemo(
    () =>
      map(questions, (question, i) => ({
        ...getQuestionForTable(question, t),
        goodQuestion: question,
        actions: (
          <Stack justifyContent="end" fullWidth>
            <ActionButton icon={<EditIcon />} onClick={() => editQuestion(i)} />
            <ActionButton icon={<RemoveIcon />} onClick={() => deleteQuestion(i)} />
          </Stack>
        ),
      })),
    [qStore.questionChanged]
  );

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

  const tableHeaders = [
    {
      Header: t('questionLabel'),
      accessor: 'question',
      className: 'text-left',
      editable: false,
    },
    {
      Header: t('responsesLabel'),
      accessor: 'responses',
      className: 'text-left',
      editable: false,
    },
    {
      Header: t('typeLabel'),
      accessor: 'type',
      className: 'text-left',
      editable: false,
    },
    {
      Header: t('actionsHeader'),
      accessor: 'actions',
      editable: false,
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
                error={qStore.isDirty ? form.formState.errors.introductoryText : null}
                label={t('introductoryText')}
                {...field}
              />
            )}
          />

          <Controller
            control={form.control}
            name="thanksMessage"
            rules={{ required: t('thanksMessageRequired') }}
            render={({ field }) => (
              <Textarea
                required
                error={qStore.isDirty ? form.formState.errors.thanksMessage : null}
                label={t('thanksMessage')}
                {...field}
              />
            )}
          />

          {questions && questions.length ? (
            <TableInput
              labels={{}}
              showHeaders={false}
              removable={false}
              editable={false}
              columns={tableHeaders}
              data={questionsForTable}
              onChange={(data) => {
                form.setValue('questions', map(data, 'goodQuestion'));
              }}
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
          <Box>
            <Button
              variant="outline"
              loading={saving}
              onClick={() => {
                qStore.isDirty = true;
                qStore.trySend = true;
                qRender();
                form.handleSubmit(() => {
                  onNext();
                })();
              }}
            >
              {t('publish')}
            </Button>
            <Box sx={(theme) => ({ display: 'inline-block', marginLeft: theme.spacing[2] })}>
              <Button
                loading={saving}
                onClick={() => {
                  qStore.isDirty = true;
                  qStore.trySend = true;
                  qRender();
                  form.handleSubmit(() => {
                    onNext(true);
                  })();
                }}
              >
                {t('publishAndAssign')}
              </Button>
            </Box>
          </Box>
        </Stack>
      </ContextContainer>
    </>
  );
}

DetailQuestions.propTypes = {
  form: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  saving: PropTypes.boolean,
  onNext: PropTypes.func,
  onPrev: PropTypes.func,
};
