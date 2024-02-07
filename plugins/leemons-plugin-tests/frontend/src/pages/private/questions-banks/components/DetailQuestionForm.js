import React from 'react';
import PropTypes from 'prop-types';
import { forIn, get, isEmpty, map } from 'lodash';
import {
  Box,
  Button,
  ContextContainer,
  Select,
  Stack,
  Switch,
  Text,
  Textarea,
  TotalLayoutFooterContainer,
  TotalLayoutStepContainer,
} from '@bubbles-ui/components';
import ImagePicker from '@leebrary/components/ImagePicker';
import { TextEditorInput } from '@bubbles-ui/editors';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { ChevLeftIcon } from '@bubbles-ui/icons/outline';
import { ViewOffIcon } from '@bubbles-ui/icons/solid';
import SelectLevelsOfDifficulty from '@assignables/components/LevelsOfDifficulty/SelectLevelsOfDifficulty';
import { questionComponents, questionTypeT } from './QuestionForm';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const RESPONSES_KEYS = {
  'mono-response': 'responses',
  map: 'markers.list',
};

export default function DetailQuestionForm({
  t,
  stepName,
  scrollRef,
  isPublished,
  store,
  onSave,
  onSaveQuestion,
  defaultValues,
  categories,
  onAddCategory,
  onCancel,
}) {
  const questionTypes = [];
  forIn(questionTypeT, (value, key) => {
    questionTypes.push({ value: key, label: t(value) });
  });

  const form = useForm({ defaultValues });
  const properties = form.watch('properties');
  const type = form.watch('type');
  const responseKey = RESPONSES_KEYS[type];

  const rightAnswerSelected = React.useMemo(() => {
    if (type === 'map') return true;
    return properties?.responses?.some((item) => item?.value?.isCorrectResponse);
  }, [type, properties?.responses]);

  const answerChoices = React.useMemo(() => {
    const answers = get(properties, responseKey, []);
    if (isEmpty(answers)) return [];

    let useLetters = true;
    if (type === 'map' && properties?.markers?.type === 'numbering') {
      useLetters = false;
    }
    return map(answers, (item, index) => ({
      value: index,
      label: useLetters ? LETTERS[index] : `${index + 1}`,
      disabled: type === 'map' ? item?.value?.hideOnHelp : item?.value?.isCorrectResponse,
    }));
  }, [JSON.stringify(properties), type]);

  function handleOnSaveQuestion() {
    form.handleSubmit((data) => {
      onSaveQuestion(data);
    })();
  }

  function handleOnSave() {
    form.handleSubmit((data) => {
      onSave(data);
    })();
  }

  function handleHideOnHelp(index) {
    const data = get(properties, responseKey, []);

    if (index && !isEmpty(data)) {
      // loop through responses and set hideOnHelp to true only on index
      for (let i = 0; i < data.length; i++) {
        if (type === 'map') {
          data[i].hideOnHelp = i === Number(index);
        } else {
          data[i].value.hideOnHelp = i === Number(index);
        }
      }
      form.setValue(`properties.${responseKey}`, data);
    }
  }

  const categoryData = map(categories, (category, index) => ({
    value: category.id ? category.id : index,
    label: category.value,
  }));

  const QuestionComponent = React.useMemo(() => {
    if (!type) return null;

    return React.cloneElement(questionComponents[type], {
      form,
      t,
    });
  }, [type, form, t]);

  const hideOptionsHelp = React.useMemo(() => {
    if (!rightAnswerSelected) return t('hideOptionNoRightAnswer');

    const parts = t('hideOptionsHelp').split('{{icon}}');
    return [
      parts[0],
      <Box
        key={2}
        sx={(theme) => ({
          display: 'inline',
          fontSize: theme.fontSizes[3],
          verticalAlign: 'middle',
        })}
      >
        <ViewOffIcon />
      </Box>,
      parts[1],
    ];
  }, [t, rightAnswerSelected]);

  const answersHidden = React.useMemo(() => {
    const answers = get(properties, responseKey, []);
    if (type === 'map') {
      return answers
        .map((item, index) => (item?.hideOnHelp ? index : -1))
        .filter((item) => item >= 0)[0];
    }

    return answers
      .map((item, index) => (item?.value?.hideOnHelp ? index : -1))
      .filter((item) => item >= 0)[0];
  }, [get(properties, responseKey), type]);

  const hasEnoughAnswers = get(properties, responseKey, []).length >= 3;

  return (
    <FormProvider {...form}>
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
                onClick={onCancel}
              >
                {t('returnToList')}
              </Button>
            }
            rightZone={
              <>
                {!isPublished ? (
                  <Button
                    variant="link"
                    onClick={handleOnSave}
                    disabled={store.saving || !type}
                    loading={store.saving === 'draft'}
                  >
                    {t('saveDraft')}
                  </Button>
                ) : null}
                <Button variant="outline" disabled={!type} onClick={handleOnSaveQuestion}>
                  {t('saveQuestion')}
                </Button>
              </>
            }
          />
        }
      >
        <Box style={{ marginBottom: 20 }}>
          <ContextContainer title={t('questionDetail')}>
            <Box>
              <ContextContainer fullWidth direction="row">
                <Controller
                  control={form.control}
                  name="type"
                  rules={{ required: t('typeRequired') }}
                  render={({ field }) => (
                    <Select
                      required
                      data={questionTypes}
                      error={form.formState.errors.type}
                      label={t('typeLabel')}
                      {...field}
                    />
                  )}
                />
                {type ? (
                  <Controller
                    control={form.control}
                    name="level"
                    render={({ field }) => (
                      <SelectLevelsOfDifficulty
                        error={form.formState.errors.level}
                        label={t('levelLabel')}
                        {...field}
                      />
                    )}
                  />
                ) : null}
              </ContextContainer>
            </Box>
            {type ? (
              <>
                <ContextContainer fullWidth direction="row">
                  <Controller
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <Box style={{ width: '230px' }}>
                        <Select
                          {...field}
                          data={categoryData}
                          searchable
                          creatable
                          getCreateLabel={(value) => `+ ${value}`}
                          withinPortal={true}
                          onCreate={(v) => {
                            onAddCategory(v);
                            field.onChange(categoryData.length);
                          }}
                          error={form.formState.errors.category}
                          label={t('categoryLabel')}
                          onChange={(e) => {
                            const item = categoryData[e];
                            if (item) {
                              field.onChange(item.value);
                            } else {
                              field.onChange(e);
                            }
                          }}
                        />
                      </Box>
                    )}
                  />
                </ContextContainer>

                {/*
                <Controller
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <Box style={{ width: '484px' }}>
                      <TagsAutocomplete
                        {...field}
                        pluginName="tests"
                        type="tests.questionBanks"
                        label={t('tagsLabel')}
                        labels={{ addButton: t('addTag') }}
                      />
                    </Box>
                  )}
                />
                */}

                <Controller
                  control={form.control}
                  name="question"
                  rules={{ required: t('questionRequired') }}
                  render={({ field }) => (
                    <TextEditorInput
                      required
                      error={form.formState.errors.question}
                      label={t('questionLabel')}
                      {...field}
                    />
                  )}
                />
                {type !== 'map' ? (
                  <>
                    <Controller
                      control={form.control}
                      name="properties.hasCover"
                      render={({ field }) => (
                        <Switch {...field} checked={field.value} label={t('hasCoverLabel')} />
                      )}
                    />
                    {properties?.hasCover ? (
                      <Controller
                        control={form.control}
                        name="questionImage"
                        render={({ field }) => <ImagePicker {...field} />}
                      />
                    ) : null}
                  </>
                ) : null}

                {QuestionComponent}

                {/* CLUES ---------------------------------------- */}
                {properties?.hasClues ? (
                  <ContextContainer title={t('cluesLabel')} description={t('cluesDescription')}>
                    <Controller
                      control={form.control}
                      name="clues[0]"
                      render={({ field }) => (
                        <Textarea
                          {...field}
                          value={field.value?.value ? field.value.value : field.value}
                          disabled={!rightAnswerSelected || !hasEnoughAnswers}
                        />
                      )}
                    />
                    <Stack direction="column" spacing={2}>
                      <Box style={{ width: 200 }}>
                        <Select
                          label={t('hideOptionsLabel')}
                          value={answersHidden}
                          data={answerChoices}
                          disabled={!rightAnswerSelected || !hasEnoughAnswers}
                          onChange={handleHideOnHelp}
                        />
                      </Box>
                      <Text size="xs">{hideOptionsHelp}</Text>
                    </Stack>
                  </ContextContainer>
                ) : null}
              </>
            ) : null}
          </ContextContainer>
        </Box>
      </TotalLayoutStepContainer>
    </FormProvider>
  );
}

DetailQuestionForm.propTypes = {
  onSave: PropTypes.func,
  defaultValues: PropTypes.object,
  t: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  categories: PropTypes.array,
  store: PropTypes.object,
  onSaveQuestion: PropTypes.func,
  stepName: PropTypes.string,
  scrollRef: PropTypes.object,
  isPublished: PropTypes.bool,
  onAddCategory: PropTypes.func,
};
