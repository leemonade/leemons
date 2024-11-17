import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useFormContext, Controller } from 'react-hook-form';
import { TableInput, Box } from '@bubbles-ui/components';
import { TextEditorInput } from '@bubbles-ui/editors';
import useTableInputLabels from '../../../helpers/useTableInputLabels';

export default function Contents({ name, label, required }) {
  const tableInputLabels = useTableInputLabels();
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const columns = useMemo(() => [
    {
      Header: `${label}${required ? '*' : ''}`,
      accessor: 'content',
      input: { node: <TextEditorInput />, rules: { required: true } },
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
            // TRANSLATE: Required error label
            error={errors.content && 'This field is required'}
            columns={columns}
            editable
            data={field.value || []}
            labels={tableInputLabels}
          />
        </>
      )}
    />
  );
}

Contents.propTypes = {
  required: PropTypes.bool,
  name: PropTypes.string,
  label: PropTypes.string,
};
