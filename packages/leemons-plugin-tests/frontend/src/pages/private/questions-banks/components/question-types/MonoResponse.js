import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, ContextContainer, InputWrapper } from '@bubbles-ui/components';
import { Controller } from 'react-hook-form';
import { TextEditorInput } from '@bubbles-ui/editors';

export default function MonoResponse({ form, t }) {
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
    </ContextContainer>
  );
}

MonoResponse.propTypes = {
  form: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};
