import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';
import { HtmlText, InputWrapper, TableInput } from '@bubbles-ui/components';
import { TextEditorInput } from '@bubbles-ui/editors';
import useTableInputLabels from '@tasks/helpers/useTableInputLabels';

export default function Development({ name, label, placeholder, required }) {
  const tableInputLabels = useTableInputLabels();

  const { control } = useFormContext();

  const columns = useMemo(() => [
    {
      Header: '',
      accessor: 'development',
      input: { node: <TextEditorInput placeholder={placeholder} />, rules: { required: true } },
      valueRender: (value) => <HtmlText>{value}</HtmlText>,
    },
  ]);

  return (
    <InputWrapper label={label}>
      <Controller
        control={control}
        name={name}
        rules={{ validate: (value) => !required || value?.length > 0 }}
        render={({ field, fieldState: { error } }) => (
          <TableInput
            {...field}
            columns={columns}
            editable
            // TRANSLATE: Required error label
            error={error && 'This field is required'}
            data={field.value || []}
            labels={tableInputLabels}
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
