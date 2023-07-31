import React from 'react';
import PropTypes from 'prop-types';
import { forIn, isEmpty, map } from 'lodash';
import {
  Box,
  Button,
  ContextContainer,
  InputWrapper,
  ListInput,
  Select,
  Stack,
  Title,
} from '@bubbles-ui/components';
import ImagePicker from '@leebrary/components/ImagePicker';
import { TextEditorInput } from '@bubbles-ui/editors';
import { Controller, useForm } from 'react-hook-form';
import { ChevLeftIcon } from '@bubbles-ui/icons/outline';
import { TagsAutocomplete } from '@common';
import SelectLevelsOfDifficulty from '@assignables/components/LevelsOfDifficulty/SelectLevelsOfDifficulty';
import { MonoResponse } from './question-types/MonoResponse';
import { QuestionMap } from './question-types/Map';

const typesWithImage = ['mono-response'];
const questionComponents = {
  'mono-response': <MonoResponse />,
  map: <QuestionMap />,
};

export const questionTypeT = {
  'mono-response': 'monoResponse',
  map: 'map',
};

export default function QuestionForm({ t, onSave, defaultValues, categories, onCancel }) {
  const questionTypes = [];
  forIn(questionTypeT, (value, key) => {
    questionTypes.push({ value: key, label: t(value) });
  });

  const form = useForm({ defaultValues });
  const type = form.watch('type');

  function save() {
    form.handleSubmit((data) => {
      onSave(data);
    })();
  }

  const categoryData = map(categories, (category, index) => ({
    value: category.id ? category.id : index,
    label: category.value,
  }));

  return (
    <Box sx={(theme) => ({ marginBottom: theme.spacing[8] })}>
      <ContextContainer>
        <Box>
          <Button variant="light" leftIcon={<ChevLeftIcon />} onClick={onCancel}>
            {t('returnToList')}
          </Button>
        </Box>

        <Title order={4}>{t('questionDetail')}</Title>

        <Box style={{ width: '230px' }}>
          <ContextContainer fullWidth direction="row">
            <Controller
              control={form.control}
              name="type"
              rules={{ required: t('typeRequired') }}
              render={({ field }) => (
                <Box style={{ width: '100%' }}>
                  <Select
                    required
                    data={questionTypes}
                    error={form.formState.errors.type}
                    label={t('typeLabel')}
                    {...field}
                  />
                </Box>
              )}
            />
          </ContextContainer>
        </Box>
        {type ? (
          <>
            <ContextContainer divided>
              <ContextContainer>
                <ContextContainer fullWidth direction="row">
                  {categoryData && categoryData.length ? (
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
                  ) : null}

                  <Controller
                    control={form.control}
                    name="level"
                    render={({ field }) => (
                      <Box style={{ width: '230px' }}>
                        <SelectLevelsOfDifficulty
                          error={form.formState.errors.level}
                          label={t('levelLabel')}
                          {...field}
                        />
                      </Box>
                    )}
                  />
                </ContextContainer>

                <Controller
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <Box style={{ width: '484px' }}>
                      <TagsAutocomplete
                        pluginName="tests"
                        type="plugins.tests.questionBanks"
                        label={t('tagsLabel')}
                        labels={{ addButton: t('addTag') }}
                        {...field}
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
                  <Controller
                    control={form.control}
                    name="questionImage"
                    render={({ field }) => (
                      <InputWrapper label={t('questionImage')}>
                        <ImagePicker {...field} />
                      </InputWrapper>
                    )}
                  />
                ) : null}

                {type
                  ? React.cloneElement(questionComponents[type], {
                      form,
                      t,
                    })
                  : null}

                <Controller
                  control={form.control}
                  name="clues"
                  render={({ field }) => (
                    <ListInput
                      canAdd={isEmpty(field.value)}
                      addButtonLabel={t('addClue')}
                      label={t('cluesLabel')}
                      description={t('cluesDescription')}
                      {...field}
                    />
                  )}
                />
              </ContextContainer>

              <Stack alignItems="center" justifyContent="space-between">
                <Button variant="light" leftIcon={<ChevLeftIcon />} onClick={onCancel}>
                  {t('returnToList')}
                </Button>
                <Button onClick={save}>{t('saveQuestion')}</Button>
              </Stack>
            </ContextContainer>
          </>
        ) : null}
      </ContextContainer>
    </Box>
  );
}

QuestionForm.propTypes = {
  onSave: PropTypes.func,
  defaultValues: PropTypes.object,
  t: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  categories: PropTypes.array,
};
