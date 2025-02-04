import { useHistory } from 'react-router-dom';

import { useSearchParams } from '@common/useSearchParams';
import { useLayout } from '@layout/context';
import { compact, get, isArray, omit, set, cloneDeep } from 'lodash';
import PropTypes from 'prop-types';

import {
  QUESTION_TYPES,
  QUESTION_TYPES_WITH_HIDDEN_ANSWERS,
  SOLUTION_KEY_BY_TYPE,
} from '../questionConstants';

import DetailQuestionForm from './DetailQuestionForm';
import DetailQuestions from './DetailQuestions';

function DetailQuestionsRouter({ t, form, savingAs, scrollRef, onPrev, onPublish, onSaveDraft }) {
  const searchParams = useSearchParams();
  const history = useHistory();
  const { openDeleteConfirmationModal } = useLayout();

  const createFrom = searchParams.get('createFrom');
  const questionIndex = searchParams.get('questionIndex');

  const formValues = form.watch();
  const questions = form.watch('questions');
  const categories = form.watch('categories');

  // ························································
  // FUNCTIONS

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

  const processOpenResponseQuestions = (question) => {
    const _question = cloneDeep(question);

    _question.openResponseProperties = {
      minCharacters: question.openResponseProperties?.minCharacters || null,
      maxCharacters: question.openResponseProperties?.maxCharacters || null,
    };

    return _question;
  };

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

  // ························································
  // HANDLERS

  function onCancel() {
    searchParams.delete('createFrom');
    searchParams.delete('questionIndex');
    history.push(`${window.location.pathname}?${searchParams.toString()}`);
  }

  const onEditQuestion = (index) => {
    searchParams.set('questionIndex', index);
    searchParams.delete('from');
    history.push(`${window.location.pathname}?${searchParams.toString()}`);
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

  function onSaveQuestion(question) {
    let processedQuestion = cleanQuestion(question);

    if (processedQuestion.type === QUESTION_TYPES.OPEN_RESPONSE) {
      processedQuestion = processOpenResponseQuestions(processedQuestion);
    }

    const currentQuestions = form.getValues('questions') ?? [];
    if (questionIndex !== null && questionIndex >= 0) {
      currentQuestions[questionIndex] = processedQuestion;
    } else {
      currentQuestions.push(processedQuestion);
    }

    form.setValue('questions', currentQuestions);
    onCancel();
  }

  function onAddQuestions(questions) {
    const currentQuestions = form.getValues('questions') ?? [];
    const newQuestions = questions.map(cleanQuestion);

    form.setValue('questions', [...currentQuestions, ...newQuestions]);
    onCancel();
  }

  // ························································
  // RENDER

  if (createFrom === 'new' || questionIndex) {
    const questionToEdit = questions?.[questionIndex];

    return (
      <DetailQuestionForm
        t={t}
        isPublished={formValues?.published}
        onSaveDraft={onSaveDraft}
        onSaveQuestion={onSaveQuestion}
        savingAs={savingAs}
        onCancel={onCancel}
        defaultValues={!questionIndex ? {} : questionToEdit}
        categories={categories}
        onCategoriesChange={handleCategoriesChange}
        scrollRef={scrollRef}
      />
    );
  }

  return (
    <DetailQuestions
      t={t}
      form={form}
      savingAs={savingAs}
      scrollRef={scrollRef}
      stepName={t('questions')}
      onPrev={onPrev}
      onPublish={onPublish}
      onSaveDraft={onSaveDraft}
      onAddQuestions={onAddQuestions}
      onEditQuestion={onEditQuestion}
      onDeleteQuestion={onDeleteQuestion}
    />
  );
}

DetailQuestionsRouter.propTypes = {
  t: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  savingAs: PropTypes.string,
  scrollRef: PropTypes.any,
  stepName: PropTypes.string,
  onPrev: PropTypes.func,
  onPublish: PropTypes.func,
  onSaveDraft: PropTypes.func,
};

export { DetailQuestionsRouter };
