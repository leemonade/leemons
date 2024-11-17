import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { isNil, noop } from 'lodash';
import { Controller } from 'react-hook-form';
import {
  Box,
  Text,
  ContextContainer,
  Switch,
  Button,
  TotalLayoutStepContainer,
  TotalLayoutFooterContainer,
  RadioGroup,
} from '@bubbles-ui/components';
import { ChevLeftIcon, ChevRightIcon } from '@bubbles-ui/icons/outline';
import { addErrorAlert } from '@layout/alert';
import { getQuestionBankRequest } from '../../../../request';
import FinalDropdown from './FinalDropdown';
import { DetailQuestionsStyles } from './DetailQuestions.styles';
import QuestionsTable from './QuestionsTable';
import { RandomQuestionsGenerator } from './RandomQuestionsGenerator';
import { FilteredQuestionsGenerator } from './FilteredQuestionsGenerator';
import { ManualQuestionsGenerator } from './ManualQuestionsGenerator';

export default function DetailQuestions({
  form,
  t,
  stepName,
  scrollRef,
  onPrev = noop,
  onNext = noop,
  onSave = noop,
  onPublish = noop,
  onAssign = noop,
  isLastStep,
  store,
  isNewQBankSelected,
}) {
  const { classes } = DetailQuestionsStyles();
  const [isDirty, setIsDirty] = React.useState(false);
  const [customChoice, setCustomChoice] = React.useState(false);
  const [radioSelection, setRadioSelection] = React.useState(null);
  const [randomQuestions, setRandomQuestions] = React.useState([]);
  const [filteredQuestions, setFilteredQuestions] = React.useState([]);
  const [manualQuestions, setManualQuestions] = React.useState([]);
  const [questionsFiltered, setQuestionsFiltered] = React.useState([]);
  const [questionBank, setQuestionBank] = React.useState([]);
  const formValues = form.watch();
  const isNewTest = store?.isNew;
  const filtersValue = 'filters.nQuestions';
  const nQuestionsSelector = form.watch(filtersValue);

  const customOptions = React.useMemo(
    () => [
      {
        value: 'randomQuestions',
        help: t('randomQuestions'),
      },
      {
        value: 'filteredQuestions',
        help: t('filteredQuestions'),
      },
      {
        value: 'manualQuestions',
        help: t('manualQuestions'),
      },
    ],
    [t]
  );

  useEffect(() => {
    if (!questionBank.questions) return;
    if (formValues.config.customChoice === null || formValues.config.customChoice === undefined) {
      const questionIds = questionBank.questions?.map((q) => q.id);
      form.setValue('questions', questionIds);
    } else if (formValues.config.customChoice === 'randomQuestions') {
      if (formValues.config.randomQuestions?.selectedQuestions && !randomQuestions?.length) {
        const selectedQuestionsIds = formValues.config.randomQuestions.selectedQuestions;
        form.setValue('questions', selectedQuestionsIds);
        const selectedQuestionsData = questionBank.questions?.filter((question) =>
          selectedQuestionsIds.includes(question.id)
        );
        setRandomQuestions(selectedQuestionsData);
      }
      if (randomQuestions.length > 0) {
        form.setValue(
          'questions',
          randomQuestions?.map((q) => q.id)
        );
      }
      if (!formValues?.config?.randomQuestions?.selectedQuestions) {
        form.setValue('questions', []);
      }
    } else if (
      (formValues.config.customChoice === 'filteredQuestions' &&
        formValues.config.filteredQuestions?.level) ||
      formValues.config.filteredQuestions?.categories
    ) {
      form.setValue('filters.level', formValues.config.filteredQuestions.level);
      form.setValue('filters.categories', formValues.config.filteredQuestions.categories);
    }
  }, [questionBank, radioSelection]);

  useEffect(() => {
    if (formValues.config && formValues.config.personalization !== undefined) {
      setCustomChoice(formValues.config.personalization);
    }

    if (formValues.config && formValues.config.customChoice) {
      setRadioSelection(formValues.config.customChoice);
    }
  }, [formValues.config]);

  // ···························································
  // INITIAL DATA PROCESSING

  async function load() {
    try {
      const questionBankId = form.getValues('questionBank');
      const { questionBank: questionBankData } = await getQuestionBankRequest(questionBankId);
      setQuestionBank(questionBankData);
      const nQuestions = questionBank?.questions?.length;
      form.setValue(filtersValue, nQuestions);
    } catch (e) {
      addErrorAlert(e);
    }
  }

  React.useEffect(() => {
    if (isNewQBankSelected) {
      form.setValue('config.personalization', false);
      form.setValue('config.customChoice', null);
      form.setValue('config.manualQuestions', undefined);
      form.setValue('config.filteredQuestions', undefined);
      form.setValue('config.randomQuestions', undefined);
    }
    load();
  }, []);

  // ···························································
  // HANDLERS

  if (!questionBank) {
    return null;
  }

  const nQuestions = questionBank?.questions?.length;

  const isMoreThanOneNQuestions =
    nQuestions > 1
      ? t('nQuestions', { n: nQuestions })
      : t('nQuestions', { n: nQuestions }).slice(0, -1);
  const getNextButtonLabel = () => 'next';

  const generateQuestions = () => {
    const totalQuestions = questionBank?.questions;
    const questionsToSelect = nQuestionsSelector ?? nQuestions;
    const selectedQuestions = [];

    while (selectedQuestions.length < questionsToSelect) {
      const randomIndex = Math.floor(Math.random() * (totalQuestions?.length ?? 0));
      const question = totalQuestions[randomIndex];
      if (!selectedQuestions.some((q) => q.id === question.id)) {
        selectedQuestions.push(question);
      }
    }

    const selectedQuestionIds = selectedQuestions.map((q) => q.id);
    form.setValue('questions', selectedQuestionIds);
    setQuestionsFiltered(selectedQuestions);
    setRandomQuestions(selectedQuestions);
    form.setValue('config.randomQuestions.selectedQuestions', [...selectedQuestionIds]);
  };

  const handleOnSave = () => {
    if (!customChoice) {
      form.setValue(
        'questions',
        questionBank.questions?.map((q) => q.id)
      );
    } else {
      onSave();
    }
  };

  const testHasQuestionsSelected = formValues.questions?.length > 0;

  const filteredQuestionsActive = radioSelection === 'filteredQuestions' ? filteredQuestions : null;
  const RandomQuestionsActive = radioSelection === 'randomQuestions' ? randomQuestions : null;

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
                  onClick={handleOnSave}
                  disabled={!formValues.name || !testHasQuestionsSelected}
                  loading={store.saving === 'draft'}
                >
                  {t('saveDraft')}
                </Button>
              ) : null}

              {isLastStep && !isNil(questionsFiltered) ? (
                <FinalDropdown
                  t={t}
                  form={form}
                  setIsDirty={setIsDirty}
                  onAssign={onAssign}
                  onPublish={onPublish}
                  disabled={!formValues.name || !testHasQuestionsSelected}
                />
              ) : (
                <Button
                  rightIcon={<ChevRightIcon height={20} width={20} />}
                  onClick={onNext}
                  disabled={store.saving || !testHasQuestionsSelected}
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
        <ContextContainer title={t('questionBankMethodSelection')} spacing={2}>
          <Box className={classes.counter}>
            <Text>{isMoreThanOneNQuestions}</Text>
          </Box>
          <ContextContainer>
            <Controller
              key={1}
              control={form.control}
              name="config.personalization"
              render={({ field }) => (
                <Switch
                  {...field}
                  checked={customChoice}
                  label={`${t('customQuestionSelection')}`}
                  onChange={(e) => {
                    form.setValue('config.personalization', e);
                    return setCustomChoice(e);
                  }}
                />
              )}
            />
          </ContextContainer>
          {customChoice ? (
            <ContextContainer spacing={1} className={classes.containerSelection}>
              <Controller
                key={2}
                control={form.control}
                name="customChoices"
                render={({ field }) => (
                  <RadioGroup
                    {...field}
                    value={radioSelection}
                    label={t('customChoicesLabel')}
                    className={classes.radioGroup}
                    placeholder={t('customChoicesPlaceholder')}
                    data={customOptions}
                    onChange={(option) => {
                      form.setValue('config.customChoice', option);
                      return setRadioSelection(option);
                    }}
                  />
                )}
              />
              <Box className={classes.generatorContainer}>
                {radioSelection === 'randomQuestions' && (
                  <RandomQuestionsGenerator
                    t={t}
                    form={form}
                    nQuestions={nQuestions}
                    classes={classes}
                    generateQuestions={generateQuestions}
                  />
                )}
                {radioSelection === 'filteredQuestions' && (
                  <FilteredQuestionsGenerator
                    t={t}
                    form={form}
                    questionBank={questionBank}
                    classes={classes}
                    filteredQuestions={filteredQuestions}
                    setFilteredQuestions={setFilteredQuestions}
                    isNewTest={isNewTest}
                  />
                )}
                {radioSelection === 'manualQuestions' && (
                  <ManualQuestionsGenerator
                    t={t}
                    form={form}
                    questionBank={questionBank}
                    classes={classes}
                    manualQuestions={manualQuestions}
                    setManualQuestions={setManualQuestions}
                  />
                )}
                <Box>
                  {(randomQuestions &&
                    randomQuestions.length > 0 &&
                    radioSelection !== 'manualQuestions') ||
                  (filteredQuestions &&
                    filteredQuestions.length > 0 &&
                    radioSelection !== 'manualQuestions') ? (
                    <Controller
                      key={4}
                      control={form.control}
                      name="questions"
                      render={({ field }) => (
                        <QuestionsTable
                          questions={filteredQuestionsActive ?? RandomQuestionsActive}
                          forceSortable
                          value={field.value}
                          onChange={(e) => field.onChange(e)}
                          questionBank={questionBank}
                          reorderMode={true}
                          hideCheckbox
                          hideOpenIcon
                        />
                      )}
                    />
                  ) : null}
                </Box>
              </Box>
            </ContextContainer>
          ) : null}
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
  onAssign: PropTypes.func,
  onPublish: PropTypes.func,
  store: PropTypes.object,
  isNewQBankSelected: PropTypes.bool,
  setIsNewQBankSelected: PropTypes.func,
};
