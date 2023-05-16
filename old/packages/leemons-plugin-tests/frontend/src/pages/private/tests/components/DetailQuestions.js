import React from 'react';
import PropTypes from 'prop-types';
import { filter, isNil } from 'lodash';
import { ContextContainer, Paragraph, Title } from '@bubbles-ui/components';
import { useStore } from '@common';
import { addErrorAlert } from '@layout/alert';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { Controller } from 'react-hook-form';
import { getQuestionBankRequest } from '../../../../request';
import DetailQuestionsFilters from './DetailQuestionsFilters';
import DetailQuestionsSelect from './DetailQuestionsSelect';

export default function DetailQuestions({ form, t, onNext, onPrev }) {
  const [isDirty, setIsDirty] = React.useState(false);
  const [, , , getErrorMessage] = useRequestErrorMessage();
  const [store, render] = useStore();

  const questions = form.watch('questions');
  const filters = form.watch('filters');

  function getQuestionsApplyingFilters() {
    const f = form.getValues('filters');
    const q = filter(store.questionBank.questions, (question) => {
      if (f.useAllQuestions) {
        return true;
      }
      let good = true;
      if (f.type && f.type.length > 0) {
        if (!f.type.includes(question.type)) {
          good = false;
        }
      }
      if (f.level && f.level.length > 0) {
        if (!f.level.includes(question.level)) {
          good = false;
        }
      }
      if (f.categories && f.categories.length > 0) {
        if (!f.categories.includes(question.category)) {
          good = false;
        }
      }
      if (f.tags && f.tags.length > 0) {
        let tagsGood = true;
        f.tags.forEach((tag) => {
          if (!question.tags.includes(tag)) {
            tagsGood = false;
          }
        });
        if (!tagsGood) {
          good = false;
        }
      }
      return good;
    });
    return q.slice(0, f.nQuestions);
  }

  function onFiltersChange() {
    store.questionsFiltered = getQuestionsApplyingFilters();
    render();
  }

  async function load() {
    try {
      const questionBankId = form.getValues('questionBank');
      const { questionBank } = await getQuestionBankRequest(questionBankId);
      store.questionBank = questionBank;
      const currentQuestions = form.getValues('questions');
      const currentFilters = form.getValues('filters');
      if (currentQuestions?.length > 0) {
        store.reorderPage = true;
      }
      if (currentFilters) {
        store.questionsFiltered = getQuestionsApplyingFilters();
      }
      render();
    } catch (e) {
      addErrorAlert(getErrorMessage(e));
    }
  }

  function returnToFilters() {
    if (store.reorderPage) {
      store.reorderPage = false;
    } else {
      store.questionsFiltered = null;
    }
    render();
  }

  async function questionsSelected() {
    setIsDirty(true);
    const isGood = await form.trigger(['questions']);
    if (isGood) {
      if (store.reorderPage) {
        onNext();
      } else {
        store.reorderPage = true;
        render();
      }
    }
  }

  React.useEffect(() => {
    load();
  }, []);

  if (!store.questionBank) {
    return null;
  }

  const reorderMode = questions?.length && store.reorderPage;
  let nQuestions = store.questionBank.questions.length;
  if (!isNil(store.questionsFiltered)) {
    nQuestions = reorderMode ? questions.length : store.questionsFiltered.length;
  }

  return (
    <ContextContainer>
      <Title order={4}>{t('questionBank', { name: store.questionBank.name })}</Title>

      <Title order={6}>{t('nQuestions', { n: nQuestions })}</Title>

      <Paragraph>
        {t(reorderMode ? 'questionsDescriptionReorder' : 'questionsDescription')}
      </Paragraph>

      {!isNil(store.questionsFiltered) ? (
        <Controller
          key={1}
          control={form.control}
          name="questions"
          render={({ field }) => (
            <DetailQuestionsSelect
              questions={store.questionsFiltered}
              questionBank={store.questionBank}
              t={t}
              next={questionsSelected}
              back={returnToFilters}
              error={isDirty ? form.formState.errors.questions : null}
              reorderMode={reorderMode}
              {...field}
            />
          )}
        />
      ) : (
        <Controller
          key={2}
          control={form.control}
          name="filters"
          render={({ field }) => (
            <DetailQuestionsFilters
              defaultValues={filters}
              questionBank={store.questionBank}
              t={t}
              {...field}
              back={onPrev}
              onChange={(v) => {
                field.onChange(v);
                onFiltersChange();
              }}
            />
          )}
        />
      )}
    </ContextContainer>
  );
}

DetailQuestions.propTypes = {
  form: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  onNext: PropTypes.func,
};
