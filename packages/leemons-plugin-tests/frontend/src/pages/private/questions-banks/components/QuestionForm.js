import React from 'react';
import PropTypes from 'prop-types';
import { forIn } from 'lodash';
import {
  Box,
  Button,
  Checkbox,
  ContextContainer,
  ListInput,
  Select,
  Stack,
  Title,
} from '@bubbles-ui/components';
import { TextEditorInput } from '@bubbles-ui/editors';
import { Controller, useForm } from 'react-hook-form';
import { ChevLeftIcon } from '@bubbles-ui/icons/outline';
import { TagsAutocomplete } from '@common';
import { MonoResponse } from './question-types/MonoResponse';
import { Map } from './question-types/Map';

const typesWithImage = ['mono-response'];
const questionComponents = {
  'mono-response': <MonoResponse />,
  map: <Map />,
};

export const questionTypeT = {
  'mono-response': 'monoResponse',
  map: 'map',
};

export default function QuestionForm({ t, onSave, defaultValues, onCancel }) {
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

  return (
    <Box sx={(theme) => ({ marginBottom: theme.spacing[8] })}>
      <ContextContainer>
        <Box>
          <Button variant="link" onClick={onCancel}>
            <ChevLeftIcon />
            {t('returnToList')}
          </Button>
        </Box>

        <Title order={4}>{t('questionDetail')}</Title>

        <ContextContainer direction="row">
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

          <Controller
            control={form.control}
            name="level"
            render={({ field }) => (
              <Select
                data={[{ value: 'falta-implementar', label: 'Falta implementar' }]}
                error={form.formState.errors.level}
                label={t('levelLabel')}
                {...field}
              />
            )}
          />

          {typesWithImage.includes(form.watch('type')) && (
            <Box style={{ alignSelf: 'flex-end' }}>
              <Controller
                control={form.control}
                name="withImages"
                render={({ field }) => (
                  <Checkbox
                    checked={field.value}
                    error={form.formState.errors.withImages}
                    label={t('withImagesLabel')}
                    {...field}
                  />
                )}
              />
            </Box>
          )}
        </ContextContainer>

        <Controller
          control={form.control}
          name="tags"
          render={({ field }) => (
            <TagsAutocomplete
              pluginName="tests"
              type="plugins.tests.questionBanks"
              label={t('tagsLabel')}
              labels={{ addButton: t('addTag') }}
              {...field}
            />
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
              canAdd
              label={t('cluesLabel')}
              description={t('cluesDescription')}
              {...field}
            />
          )}
        />

        <Stack justifyContent="end">
          <Button onClick={save}>{t('save')}</Button>
        </Stack>
      </ContextContainer>
    </Box>
  );
}

QuestionForm.propTypes = {
  onSave: PropTypes.func,
  defaultValues: PropTypes.object,
  t: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
};
