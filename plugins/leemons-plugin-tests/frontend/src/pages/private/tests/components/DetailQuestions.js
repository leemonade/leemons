import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { isNil, noop } from 'lodash';
import { Controller, useForm } from 'react-hook-form';
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
    if (
      !customChoice &&
      questionBank?.questions &&
      isNewTest &&
      !randomQuestions &&
      !filteredQuestions &&
      !manualQuestions
    ) {
      const currentQuestions = form.getValues('questions');
      const questionIds = questionBank.questions?.map((q) => q.id);
      if (JSON.stringify(currentQuestions) !== JSON.stringify(questionBank.questions)) {
        form.setValue('questions', questionIds);
      }
    }
    if (questionBank && isNewTest) {
      const currentNQuestions = form.getValues(filtersValue);
      const questionBankNQuestions = questionBank?.questions?.length ?? 0;
      if (currentNQuestions !== questionBankNQuestions) {
        form.setValue(filtersValue, questionBankNQuestions);
      }
    }
    if (radioSelection === 'filteredQuestions') {
      if (filteredQuestions?.length > 0 && isNewTest) {
        const currentQuestions = form.getValues('questions');
        const finalQuestionIds = filteredQuestions?.map((q) => q.id);
        if (JSON.stringify(currentQuestions) !== JSON.stringify(finalQuestionIds)) {
          form.setValue('questions', finalQuestionIds);
        }
      } else if (filteredQuestions?.length === 0 && isNewTest) {
        setFilteredQuestions(questionBank.questions);
        const currentQuestions = form.getValues('questions');
        const questionBankQuestionIds = questionBank.questions?.map((q) => q.id);
        if (JSON.stringify(currentQuestions) !== JSON.stringify(questionBankQuestionIds)) {
          form.setValue('questions', questionBankQuestionIds);
        }
      }
    }

    if (radioSelection === 'manualQuestions' && isNewTest) {
      setManualQuestions(questionBank.questions);
    }
  }, [
    questionBank,
    form,
    radioSelection,
    manualQuestions,
    filteredQuestions,
    randomQuestions,
    customChoice,
    isNewTest,
    formValues.questions,
    filtersValue,
  ]);

  useEffect(() => {
    if (radioSelection === 'randomQuestions') {
      if (!isNewTest) {
        const currentQuestions = form.getValues('questions');
        const randomQuestionsIds = questionBank?.questions?.map((q) => q.id);
        if (JSON.stringify(currentQuestions) !== JSON.stringify(randomQuestionsIds)) {
          setRandomQuestions(questionBank.questions);
          return form.setValue('questions', randomQuestionsIds);
        }
      }
      if (!randomQuestions.length && isNewTest) {
        form.setValue('questions', []);
      } else if (randomQuestions.length) {
        form.setValue(
          'questions',
          randomQuestions.map((q) => q.id)
        );
      }
    }
    if (radioSelection === 'filteredQuestions' && !!filteredQuestions?.length) {
      if (!isNewTest) {
        const currentQuestions = form.getValues('questions');
        const finalQuestionIds = filteredQuestions?.map((q) => q.id);
        if (JSON.stringify(currentQuestions) !== JSON.stringify(finalQuestionIds)) {
          return form.setValue('questions', finalQuestionIds);
        }
      }
      form.setValue(
        'questions',
        filteredQuestions.map((q) => q.id)
      );
    }
    if (radioSelection === 'manualQuestions' && !!manualQuestions?.length) {
      if (!isNewTest) {
        const currentQuestions = form.getValues('questions');
        const finalQuestionIds = manualQuestions?.map((q) => q.id);
        if (JSON.stringify(currentQuestions) !== JSON.stringify(finalQuestionIds)) {
          return form.setValue('questions', finalQuestionIds);
        }
      }
      form.setValue(
        'questions',
        manualQuestions.map((q) => q.id)
      );
    }
  }, [radioSelection, questionBank.questions]);

  useEffect(() => {
    // Establecer el estado del Switch basado en formValues.config.personalization
    if (formValues.config && formValues.config.personalization !== undefined) {
      setCustomChoice(formValues.config.personalization);
    }

    // Establecer el RadioButton seleccionado basado en formValues.config.customChoice
    if (formValues.config && formValues.config.customChoice) {
      setRadioSelection(formValues.config.customChoice);
    }
  }, [formValues.config]);

  useEffect(() => {
    if (!isNewTest && questionBank.questions) {
      const matchedQuestions = formValues.questions
        .map((questionId) => questionBank.questions?.find((q) => q.id === questionId))
        .filter((question) => question !== undefined);

      if (JSON.stringify(matchedQuestions) !== JSON.stringify(questionBank.questions)) {
        setRandomQuestions(matchedQuestions);
        setFilteredQuestions(matchedQuestions);
        setManualQuestions(matchedQuestions);
      }
    }
  }, []);

  // ···························································
  // INITIAL DATA PROCESSING

  async function load() {
    try {
      const questionBankId = form.getValues('questionBank');
      const { questionBank: questionBankData } = await getQuestionBankRequest(questionBankId);
      setQuestionBank(questionBankData);
      const nQuestions = questionBank.questions.length;
      form.setValue(filtersValue, nQuestions);
    } catch (e) {
      // addErrorAlert(getErrorMessage(e));
    }
  }

  React.useEffect(() => {
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
    const totalQuestions = questionBank.questions;
    const questionsToSelect = nQuestionsSelector;
    const selectedQuestions = [];

    while (selectedQuestions.length < questionsToSelect) {
      const randomIndex = Math.floor(Math.random() * totalQuestions.length);
      const question = totalQuestions[randomIndex];
      if (!selectedQuestions.map((q) => q.id).includes(question.id)) {
        selectedQuestions.push(question);
      }
    }
    const selectedQuestionIds = selectedQuestions.map((question) => question.id);
    form.setValue('questions', selectedQuestionIds);
    setQuestionsFiltered(selectedQuestions);
    setRandomQuestions(selectedQuestions);
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
                  disabled={!formValues.name}
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
                />
              ) : (
                <Button
                  rightIcon={<ChevRightIcon height={20} width={20} />}
                  onClick={onNext}
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
};
