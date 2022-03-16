import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useFormContext, Controller } from 'react-hook-form';
import { TableInput, Box } from '@bubbles-ui/components';
import { TextEditor } from '@bubbles-ui/editors';
import useTableInputLabels from '../../../helpers/useTableInputLabels';

export default function Objectives({ label }) {
  const tableInputLabels = useTableInputLabels();

  const { control } = useFormContext();

  const columns = useMemo(() => [
    {
      Header: label,
      accessor: 'objective',
      input: { node: <TextEditor />, rules: { required: true } },
      valueRender: (value) => <Box dangerouslySetInnerHTML={{ __html: value }} />,
    },
  ]);

  return (
    <Controller
      control={control}
      name="objectives"
      render={({ field }) => (
        <>
          <TableInput
            {...field}
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

Objectives.propTypes = {
  label: PropTypes.string.isRequired,
};
