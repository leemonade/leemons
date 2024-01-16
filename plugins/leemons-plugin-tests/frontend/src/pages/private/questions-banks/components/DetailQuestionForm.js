import React from 'react';
import PropTypes from 'prop-types';
import { forIn, isEmpty, map } from 'lodash';
import {
  Box,
  Switch,
  Button,
  ContextContainer,
  ListInput,
  Select,
  TotalLayoutStepContainer,
  TotalLayoutFooterContainer,
} from '@bubbles-ui/components';
import ImagePicker from '@leebrary/components/ImagePicker';
import { TextEditorInput } from '@bubbles-ui/editors';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { ChevLeftIcon } from '@bubbles-ui/icons/outline';
import { TagsAutocomplete } from '@common';
import SelectLevelsOfDifficulty from '@assignables/components/LevelsOfDifficulty/SelectLevelsOfDifficulty';
import { questionComponents, questionTypeT } from './QuestionForm';

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
  onCancel,
}) {
  const questionTypes = [];
  forIn(questionTypeT, (value, key) => {
    questionTypes.push({ value: key, label: t(value) });
  });

  const form = useForm({ defaultValues });
  const properties = form.watch('properties');
  const type = form.watch('type');

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
                {categoryData?.length ? (
                  <ContextContainer fullWidth direction="row">
                    <Controller
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <Box style={{ width: '230px' }}>
                          <Select
                            data={categoryData}
                            error={form.formState.errors.category}
                            label={t('categoryLabel')}
                            {...field}
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
                ) : null}

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
                        <Switch {...field} checked={field.value} label="Imagen destacada" />
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
                <ContextContainer title={t('cluesLabel')} description={t('cluesDescription')}>
                  <Controller
                    control={form.control}
                    name="clues"
                    render={({ field }) => (
                      <ListInput
                        canAdd={isEmpty(field.value)}
                        addButtonLabel={t('addClue')}
                        {...field}
                      />
                    )}
                  />
                </ContextContainer>
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
};
