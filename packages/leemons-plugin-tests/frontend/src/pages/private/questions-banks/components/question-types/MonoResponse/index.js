import React from 'react';
import PropTypes from 'prop-types';
import {
  Checkbox,
  ContextContainer,
  InputWrapper,
  ListInput,
  ListItem,
} from '@bubbles-ui/components';
import { Controller } from 'react-hook-form';
import { TextEditorInput } from '@bubbles-ui/editors';
import { ListInputRender } from './components/ListInputRender';
import { ListItemValueRender } from './components/ListItemValueRender';

// eslint-disable-next-line import/prefer-default-export
export function MonoResponse({ form, t }) {
  const explanationInResponses = form.watch('properties.explanationInResponses');
  return (
    <ContextContainer>
      <InputWrapper label={t('explanationLabel')}>
        <Controller
          control={form.control}
          name="properties.explanationInResponses"
          render={({ field }) => (
            <Checkbox
              checked={field.value}
              label={t('includeExplanationToEveryAnswerLabel')}
              {...field}
            />
          )}
        />
        {!explanationInResponses ? (
          <Controller
            control={form.control}
            name="properties.explanation"
            render={({ field }) => <TextEditorInput {...field} />}
          />
        ) : null}
      </InputWrapper>
      <InputWrapper required label={t('responsesLabel')} description={t('responsesDescription')}>
        <Controller
          control={form.control}
          name="properties.responses"
          render={({ field }) => (
            <ListInput
              {...field}
              inputRender={<ListInputRender t={t} useExplanation={explanationInResponses} />}
              listRender={<ListItem itemValueRender={ListItemValueRender} />}
              hideAddButton
              canAdd
            />
          )}
        />
      </InputWrapper>
    </ContextContainer>
  );
}

MonoResponse.propTypes = {
  form: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};
