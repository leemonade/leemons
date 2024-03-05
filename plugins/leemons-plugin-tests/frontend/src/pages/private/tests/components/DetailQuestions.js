import React from 'react';
import PropTypes from 'prop-types';
import { filter, isNil, noop } from 'lodash';
import { Controller, useForm } from 'react-hook-form';
import {
  Box,
  ContextContainer,
  Paragraph,
  Title,
  Button,
  TotalLayoutStepContainer,
  TotalLayoutFooterContainer,
  DropdownButton,
} from '@bubbles-ui/components';
import { ChevLeftIcon, ChevRightIcon } from '@bubbles-ui/icons/outline';
import { useStore } from '@common';
import { addErrorAlert } from '@layout/alert';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { getQuestionBankRequest } from '../../../../request';
import DetailQuestionsFilters from './DetailQuestionsFilters';
import DetailQuestionsSelect from './DetailQuestionsSelect';
import FinalDropdown from './FinalDropdown';

export default function DetailQuestions({
  form,
  t,
  stepName,
  scrollRef,
  onNext = noop,
  onPrev = noop,
  onSave = noop,
  onPublish = noop,
  onAssign = noop,
  isLastStep,
}) {
  const [isDirty, setIsDirty] = React.useState(false);
  const [, , , getErrorMessage] = useRequestErrorMessage();
  const [store, render] = useStore();
  const formValues = form.watch();

  const questions = form.watch('questions');
  const filters = form.watch('filters');
  const filtersForm = useForm({ defaultValues: filters });

  function checkFilters({ type, level, categories, question }) {
    let good = true;

    if (type?.length > 0 && !type.includes(question.type)) {
      good = false;
    }
    if (level?.length > 0 && !level.includes(question.level)) {
      good = false;
    }
    if (categories?.length > 0 && !categories.includes(question.category)) {
      good = false;
    }

    return good;
  }

  function getQuestionsApplyingFilters() {
    const f = form.getValues('filters');
    const q = filter(store.questionBank.questions, (question) => {
      if (f.useAllQuestions) {
        return true;
      }

      let good = checkFilters({ ...f, question });

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

  function returnToFilters() {
    if (store.reorderPage) {
      store.reorderPage = false;
    } else {
      store.questionsFiltered = null;
    }
    render();
  }

  // ···························································
  // INITIAL DATA PROCESSING

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

  React.useEffect(() => {
    load();
  }, []);

  // ···························································
  // HANDLERS

  const validate = async () => form.trigger(['questions']);

  async function questionsSelected() {
    setIsDirty(true);
    if (await validate()) {
      if (store.reorderPage) {
        onNext();
      } else {
        store.reorderPage = true;
        render();
      }
    }
  }

  async function handleOnNext() {
    if (isNil(store.questionsFiltered)) {
      filtersForm.handleSubmit((data) => {
        form.setValue('filters', data);
        onFiltersChange();
      })();
    } else {
      questionsSelected();
    }
  }

  async function handleOnPrev() {
    if (isNil(store.questionsFiltered)) {
      onPrev();
    } else {
      returnToFilters();
    }
  }

  if (!store.questionBank) {
    return null;
  }

  const reorderMode = questions?.length && store.reorderPage;
  let nQuestions = store.questionBank.questions.length;
  if (!isNil(store.questionsFiltered)) {
    nQuestions = reorderMode ? questions.length : store.questionsFiltered.length;
  }

  const getNextButtonLabel = () => {
    if (!isNil(store.questionsFiltered)) {
      return reorderMode ? 'next' : 'assignSelectedQuestions';
    }
    return 'next';
  };

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
              onClick={handleOnPrev}
            >
              {t('previous')}
            </Button>
          }
          rightZone={
            <>
              {!formValues.published ? (
                <Button
                  variant="link"
                  onClick={onSave}
                  disabled={!formValues.name || store.saving}
                  loading={store.saving === 'draft'}
                >
                  {t('saveDraft')}
                </Button>
              ) : null}

              {isLastStep && !isNil(store.questionsFiltered) ? (
                <FinalDropdown
                  t={t}
                  form={form}
                  store={store}
                  setIsDirty={setIsDirty}
                  onAssign={onAssign}
                  onPublish={onPublish}
                />
              ) : (
                <Button
                  rightIcon={<ChevRightIcon height={20} width={20} />}
                  onClick={handleOnNext}
                  disabled={store.saving}
                  loading={store.saving === 'publish'}
                >
                  {t(getNextButtonLabel())}
                </Button>
              )}
            </>
          }
        />
      }
    >
      <Box>
        <ContextContainer title={t('questionBank', { name: store.questionBank.name })}>
          <Title order={6}>{t('nQuestions', { n: nQuestions })}</Title>
          <Paragraph>
            {t(reorderMode ? 'questionsDescriptionReorder' : 'questionsDescription')}
          </Paragraph>

          {isNil(store.questionsFiltered) ? (
            <Box style={{ paddingBottom: 16 }}>
              <Controller
                key={2}
                control={form.control}
                name="filters"
                render={({ field }) => (
                  <DetailQuestionsFilters
                    {...field}
                    t={t}
                    form={filtersForm}
                    questionBank={store.questionBank}
                  />
                )}
              />
            </Box>
          ) : (
            <Controller
              key={1}
              control={form.control}
              name="questions"
              render={({ field }) => (
                <DetailQuestionsSelect
                  {...field}
                  t={t}
                  questions={store.questionsFiltered}
                  questionBank={store.questionBank}
                  error={isDirty ? form.formState.errors.questions : null}
                  reorderMode={reorderMode}
                />
              )}
            />
          )}
        </ContextContainer>
      </Box>
    </TotalLayoutStepContainer>
  );
}

DetailQuestions.propTypes = {
  t: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  onNext: PropTypes.func,
  onPrev: PropTypes.func,
  onSave: PropTypes.func,
  stepName: PropTypes.string,
  scrollRef: PropTypes.any,
  isLastStep: PropTypes.bool,
  onPublish: PropTypes.func,
  onAssign: PropTypes.func,
};
