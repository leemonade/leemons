import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useFormContext, Controller } from 'react-hook-form';
import { TableInput, Box } from '@bubbles-ui/components';
import { TextEditor } from '@bubbles-ui/editors';
import useTableInputLabels from '../../../helpers/useTableInputLabels';

export default function Objectives({ name, label, required }) {
  const tableInputLabels = useTableInputLabels();

  const {
    control,
    formState: { errors },
  } = useFormContext();

  const columns = useMemo(() => [
    {
      Header: label + (required ? '*' : ''),
      accessor: 'objective',
      input: { node: <TextEditor />, rules: { required: true } },
      valueRender: (value) => <Box dangerouslySetInnerHTML={{ __html: value }} />,
    },
  ]);

  return (
    <Controller
      control={control}
      name={name}
      rules={{ validate: (value) => !required || value?.length > 0 }}
      render={({ field }) => (
        <>
          <TableInput
            {...field}
            columns={columns}
            editable
            // TRANSLATE: Required error label
            error={errors.objectives && 'This field is required'}
            data={field.value || []}
            labels={tableInputLabels}
          />
        </>
      )}
    />
  );
}

Objectives.propTypes = {
  label: PropTypes.string.isRequired,
  required: PropTypes.bool,
  name: PropTypes.string.isRequired,
};
