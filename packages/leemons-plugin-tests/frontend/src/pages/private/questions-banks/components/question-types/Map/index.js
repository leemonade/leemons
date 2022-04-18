import React from 'react';
import PropTypes from 'prop-types';
import { Button, ContextContainer, InputWrapper } from '@bubbles-ui/components';
import { Controller } from 'react-hook-form';
import { TextEditorInput } from '@bubbles-ui/editors';

// eslint-disable-next-line import/prefer-default-export
export function Map({ form, t }) {
  function addMap() {}

  return (
    <ContextContainer>
      <InputWrapper required label={t('mapLabel')}>
        <Button onClick={addMap}>{t('addMap')}</Button>
      </InputWrapper>
      <InputWrapper
        required
        label={t('itemsLabel')}
        description={t('itemsDescriptionBeforeMap')}
      ></InputWrapper>
      <InputWrapper label={t('explanationLabel')}>
        <Controller
          control={form.control}
          name="properties.explanation"
          render={({ field }) => <TextEditorInput {...field} />}
        />
      </InputWrapper>
    </ContextContainer>
  );
}

Map.propTypes = {
  form: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};
