import { useState } from 'react';

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
import { isLRN } from '@leebrary/helpers/isLRN';
import { compact, get, isArray, map, noop, omit, set } from 'lodash';
import PropTypes from 'prop-types';

import { getQuestionForTable } from '../../../../helpers/getQuestionForTable';
import {
  QUESTION_TYPES,
  QUESTION_TYPES_WITH_HIDDEN_ANSWERS,
  SOLUTION_KEY_BY_TYPE,
} from '../questionConstants';

import DetailQuestionForm from './DetailQuestionForm';

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

  const handleCategoriesChange = (newCategories) => {
    const currentQuestions = form.getValues('questions') || [];

    const updatedQuestions = currentQuestions.map((question) => {
      if (!question.category) return question;

      const categoryStillExists = newCategories.some((cat) => cat.id === question.category);

      return {
        ...question,
        category: categoryStillExists ? question.category : null,
      };
    });

    form.setValue('questions', updatedQuestions);
    form.setValue('categories', [...newCategories]);
  };

  const processCategories = (categories) => {
    if (!categories) return;
    const categoriesOrderMap = {};
    const processedCategories = categories.map((category, index) => {
      categoriesOrderMap[category.id] = index;
      if (isLRN(category.id)) return { ...category, order: index };
      return { value: category.value, order: index };
    });

    const processedQuestions = form.getValues('questions').map((question) => {
      if (!question.category) return question;
      return { ...question, category: categoriesOrderMap[question.category] };
    });

    form.setValue('categories', processedCategories);
    form.setValue('questions', processedQuestions);
  };

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

  const removeHideOnHelp = (answers) => answers.map((item) => omit(item, 'hideOnHelp'));

  function processHasHelp(question, solutionKey) {
    if (!question.hasHelp) return false;
    if (question.clues?.length) return true;
    return get(question, solutionKey).some((answer) => answer.hideOnHelp);
  }

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

    // HELP: CLUES && HIDE ANSWER OPTIONS
    processedQuestion.clues = compact(processedQuestion.clues);
    if (!question.hasHelp) {
      if (QUESTION_TYPES_WITH_HIDDEN_ANSWERS.includes(question.type)) {
        const solutionWithCleanHideOnHelp = removeHideOnHelp(get(processedQuestion, solutionKey));
        set(processedQuestion, solutionKey, solutionWithCleanHideOnHelp);
      }
      processedQuestion.clues = [];
    } else {
      processedQuestion.hasHelp = processHasHelp(processedQuestion, solutionKey);
    }

    return processedQuestion;
  };

  function onSaveQuestion(question) {
    const processedQuestion = cleanQuestion(question);

    const currentQuestions = form.getValues('questions') ?? [];
    if (questionIndex !== null && questionIndex >= 0) {
      currentQuestions[questionIndex] = processedQuestion;
    } else {
      currentQuestions.push(processedQuestion);
    }

    form.setValue('questions', currentQuestions);
    onCancel();
  }

  const onEditQuestion = (index) => {
    setQuestionToEdit((questions || [])[index]);
    setQuestionIndex(index);
  };

  const onDeleteQuestion = (index) => {
    openDeleteConfirmationModal({
      onConfirm: () => {
        const currentQuestions = form.getValues('questions') || [];
        currentQuestions.splice(index, 1);
        form.setValue('questions', currentQuestions);
      },
    })();
  };

  function onSaveQBank(handler = noop) {
    setSaveAttempt(true);
    processCategories(categories);
    if (questions?.length) {
      handler();
    }
  }

  const tableColumns = [
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
        onCategoriesChange={handleCategoriesChange}
        scrollRef={scrollRef}
      />
    );
  }

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
                loading={savingAs === 'published'}
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
              columns={tableColumns}
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
