import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { compact, get, isArray, map, noop, set } from 'lodash';
import {
  ActionButton,
  Alert,
  Box,
  Button,
  ContextContainer,
  Stack,
  Table,
  Text,
  TotalLayoutFooterContainer,
  TotalLayoutStepContainer,
} from '@bubbles-ui/components';
import { ChevLeftIcon } from '@bubbles-ui/icons/outline';
import { AddCircleIcon, DeleteBinIcon, EditWriteIcon } from '@bubbles-ui/icons/solid';
import { useLayout } from '@layout/context';
import { getQuestionForTable } from '../../../../helpers/getQuestionForTable';
import DetailQuestionForm from './DetailQuestionForm';
import { QUESTION_TYPES, SOLUTION_KEY_BY_TYPE } from '../questionConstants';

export default function DetailQuestions({
  form,
  t,
  stepName,
  scrollRef,
  onPrev,
  onPublish,
  onSaveDraft,
  savingAs,
}) {
  const [newQuestion, setNewQuestion] = useState(null);
  const [questionToEdit, setQuestionToEdit] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(null);
  const [saveAttempt, setSaveAttempt] = useState(false);
  const { openDeleteConfirmationModal } = useLayout();

  const formValues = form.watch();
  const categories = form.watch('categories');
  const questions = form.watch('questions');

  // FUNCTIONS ························································|
  function onCancel() {
    setNewQuestion(null);
    setQuestionToEdit(null);
    setQuestionIndex(null);
  }

  const processFeedback = (processedQuestion, solutionField) => {
    let solution = solutionField;
    let cleanGlobalFeedback = processedQuestion.globalFeedback;
    if (isArray(solutionField)) {
      if (!processedQuestion.hasAnswerFeedback) {
        solution = solutionField.map((item) => ({
          ...item,
          feedback: null,
        }));
      } else {
        cleanGlobalFeedback = null;
      }
    }
    return [solution, cleanGlobalFeedback];
  };

  const cleanQuestion = (question) => {
    const processedQuestion = { ...question };
    const solutionKey = SOLUTION_KEY_BY_TYPE[question.type];
    const solutionField = get(processedQuestion, solutionKey);

    // FEEDBACK
    if (QUESTION_TYPES.MAP !== question.type) {
      const [solutionWithCleanFeedback, cleanGlobalFeedback] = processFeedback(
        processedQuestion,
        solutionField
      );
      set(processedQuestion, solutionKey, solutionWithCleanFeedback);
      processedQuestion.globalFeedback = cleanGlobalFeedback;
    }

    // CLUES
    processedQuestion.clues = compact(processedQuestion.clues);

    return processedQuestion;
  };

  function onSaveQuestion(question) {
    const processedQuestion = cleanQuestion(question);
    console.log('dirty question', question);
    console.log('processedQuestion', processedQuestion);

    const currentQuestions = form.getValues('questions') ?? [];
    if (questionIndex !== null && questionIndex >= 0) {
      currentQuestions[questionIndex] = processedQuestion;
    } else {
      currentQuestions.push(processedQuestion);
    }
    console.log('currentQuestions', currentQuestions);

    form.setValue('questions', currentQuestions);
    onCancel();
  }

  function onEditQuestion(index) {
    setQuestionToEdit((questions || [])[index]);
    setQuestionIndex(index);
  }

  function onDeleteQuestion(index) {
    // TODO: check this works
    openDeleteConfirmationModal({
      onConfirm: async () => {
        const currentQuestions = form.getValues('questions') || [];
        const questionsAfterDeletion = currentQuestions.splice(index, 1);
        form.setValue('questions', questionsAfterDeletion);
      },
    })();
  }

  function onSaveQBank(handler = noop) {
    setSaveAttempt(true);
    if (questions?.length) {
      handler();
    }
  }

  const showQuestionForm = !!(newQuestion || questionToEdit);

  if (showQuestionForm) {
    return (
      <DetailQuestionForm
        t={t}
        isPublished={formValues.published}
        onSaveDraft={onSaveDraft}
        onSaveQuestion={onSaveQuestion}
        savingAs={savingAs}
        onCancel={onCancel}
        defaultValues={newQuestion ? {} : questionToEdit}
        categories={categories}
        onAddCategory={(newCategory) => {
          form.setValue('categories', [
            ...(form.getValues('categories') || []),
            { value: newCategory },
          ]);
        }}
        scrollRef={scrollRef}
      />
    );
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
      style: { textAlign: 'right' },
    },
  ];

  return (
    <TotalLayoutStepContainer
      stepName={stepName}
      Footer={
        <TotalLayoutFooterContainer
          fixed
          scrollRef={scrollRef}
          leftZone={
            <Button
              variant="outline"
              leftIcon={<ChevLeftIcon height={20} width={20} />}
              onClick={onPrev}
            >
              {t('previous')}
            </Button>
          }
          rightZone={
            <>
              {!formValues.published ? (
                <Button
                  variant="link"
                  onClick={() => onSaveQBank(onSaveDraft)}
                  disabled={savingAs}
                  loading={savingAs === 'draft'}
                >
                  {t('saveDraft')}
                </Button>
              ) : null}
              <Button
                onClick={() => onSaveQBank(onPublish)}
                disabled={savingAs || !questions?.length}
                loading={savingAs === 'publish'}
              >
                {t('publish')}
              </Button>
            </>
          }
        />
      }
    >
      <Box>
        <ContextContainer title={t('questionList')}>
          <Box>
            <Button variant="link" leftIcon={<AddCircleIcon />} onClick={() => setNewQuestion({})}>
              {t('addQuestion')}
            </Button>
          </Box>
          {questions?.length ? (
            <Table
              columns={tableHeaders}
              data={map(questions, (question, i) => ({
                ...getQuestionForTable(question, t),
                actions: (
                  <Stack justifyContent="end" fullWidth>
                    <ActionButton
                      icon={<EditWriteIcon width={18} height={18} />}
                      onClick={() => onEditQuestion(i)}
                    />
                    <ActionButton
                      icon={<DeleteBinIcon width={18} height={18} />}
                      onClick={() => onDeleteQuestion(i)}
                    />
                  </Stack>
                ),
              }))}
            />
          ) : (
            <Text>{t('questionListEmpty')}</Text>
          )}

          {saveAttempt && form.formState.errors.questions ? (
            <Alert severity="error" closeable={false}>
              {form.formState.errors.questions?.message}
            </Alert>
          ) : null}
        </ContextContainer>
      </Box>
    </TotalLayoutStepContainer>
  );
}

DetailQuestions.propTypes = {
  form: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  onPublish: PropTypes.func,
  onPrev: PropTypes.func,
  onSaveDraft: PropTypes.func,
  stepName: PropTypes.string,
  scrollRef: PropTypes.object,
  savingAs: PropTypes.string,
};
