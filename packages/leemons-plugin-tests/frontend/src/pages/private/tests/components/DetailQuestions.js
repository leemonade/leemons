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

export default function DetailQuestions({ form, t, onNext }) {
  const [, , , getErrorMessage] = useRequestErrorMessage();
  const [store, render] = useStore();
  const questions = form.watch('questions');

  async function load() {
    try {
      const currentQuestions = form.getValues('questions');
      if (currentQuestions.length > 0) {
        store.reorderPage = true;
      }
      const questionBankId = form.getValues('questionBank');
      const { questionBank } = await getQuestionBankRequest(questionBankId);
      store.questionBank = questionBank;
      render();
    } catch (e) {
      addErrorAlert(getErrorMessage(e));
    }
  }

  function getQuestionsApplyingFilters() {
    const q = filter(store.questionBank.questions, (question) => {
      if (store.filters.useAllQuestions) {
        return true;
      }
      let good = true;
      if (store.filters.type && store.filters.type.length > 0) {
        if (!store.filters.type.includes(question.type)) {
          good = false;
        }
      }
      if (store.filters.level && store.filters.level.length > 0) {
        if (!store.filters.level.includes(question.level)) {
          good = false;
        }
      }
      if (store.filters.tags && store.filters.tags.length > 0) {
        let tagsGood = true;
        store.filters.tags.forEach((tag) => {
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
    return q.slice(0, store.filters.nQuestions);
  }

  function onFiltersChange(filters) {
    store.filters = filters;
    store.questionsFiltered = getQuestionsApplyingFilters();
    render();
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
    const isGood = await form.trigger(['questions']);
    if (isGood) {
      store.reorderPage = true;
      render();
    }
  }

  React.useEffect(() => {
    load();
  }, []);

  if (!store.questionBank) {
    return null;
  }

  let component = null;
  if (!isNil(store.questionsFiltered)) {
    component = (
      <Controller
        control={form.control}
        name="questions"
        rules={{
          required: t('questionsRequired'),
          min: {
            value: 1,
            message: t('questionsRequired'),
          },
        }}
        render={({ field }) => (
          <DetailQuestionsSelect
            questions={store.questionsFiltered}
            questionBank={store.questionBank}
            t={t}
            next={questionsSelected}
            back={returnToFilters}
            error={form.formState.errors.questions}
            reorderMode={questions.length && store.reorderPage}
            {...field}
          />
        )}
      />
    );
  } else {
    component = (
      <DetailQuestionsFilters
        defaultValues={store.filters}
        questionBank={store.questionBank}
        t={t}
        next={onFiltersChange}
      />
    );
  }

  return (
    <ContextContainer>
      <Paragraph>{t('questionsDescription')}</Paragraph>
      <Title order={4}>{t('questionBank', { name: store.questionBank.name })}</Title>
      {component}
    </ContextContainer>
  );
}

DetailQuestions.propTypes = {
  form: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
};
