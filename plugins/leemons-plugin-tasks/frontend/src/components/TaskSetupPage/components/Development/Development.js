import React from 'react';
import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';
import { InputWrapper } from '@bubbles-ui/components';
import { TextEditorInput } from '@bubbles-ui/editors';

export default function Development({ name, label, required }) {
  const { control } = useFormContext();

  return (
    <InputWrapper label={label}>
      <Controller
        control={control}
        name={name}
        rules={{ validate: (value) => !required || value?.length > 0 }}
        render={({ field, fieldState: { error } }) => (
          <TextEditorInput
            {...field}
            error={error && 'This field is required'}
            value={field.value?.[0] ? field.value[0].development : null}
            onChange={(value) => field.onChange(value ? [{ development: value }] : [])}
            editorStyles={{ minHeight: '96px' }}
          />
        )}
      />
    </InputWrapper>
  );
}

Development.propTypes = {
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  required: PropTypes.bool,
  name: PropTypes.string.isRequired,
  form: PropTypes.any,
};
