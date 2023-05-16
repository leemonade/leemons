import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';
import { HtmlText, InputWrapper, TableInput, Textarea } from '@bubbles-ui/components';
// import { TextEditorInput } from '@bubbles-ui/editors';
import useTableInputLabels from '../../../helpers/useTableInputLabels';

export default function Objectives({ form, name, label, required }) {
  const tableInputLabels = useTableInputLabels();

  const {
    control,
    formState: { errors },
  } = form || useFormContext();

  const columns = useMemo(() => [
    {
      Header: '',
      accessor: 'objective',
      input: { node: <Textarea />, rules: { required: true } },
      valueRender: (value) => <HtmlText>{value}</HtmlText>,
    },
  ]);

  return (
    <InputWrapper label={label}>
      <Controller
        control={control}
        name={name}
        rules={{ validate: (value) => !required || value?.length > 0 }}
        render={({ field }) => (
          <TableInput
            {...field}
            columns={columns}
            editable
            // TRANSLATE: Required error label
            error={errors.objectives && 'This field is required'}
            data={field.value || []}
            labels={tableInputLabels}
          />
        )}
      />
    </InputWrapper>
  );
}

Objectives.propTypes = {
  label: PropTypes.string.isRequired,
  required: PropTypes.bool,
  name: PropTypes.string.isRequired,
  form: PropTypes.any,
};
