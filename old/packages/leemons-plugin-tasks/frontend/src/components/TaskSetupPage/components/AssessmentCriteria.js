import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useFormContext, Controller } from 'react-hook-form';
import { TableInput, Box } from '@bubbles-ui/components';
import { TextEditorInput } from '@bubbles-ui/editors';

import useTableInputLabels from '../../../helpers/useTableInputLabels';

export default function AssessmentCriteria({ label, name, error }) {
  const tableInputLabels = useTableInputLabels();
  const { control } = useFormContext();

  const columns = useMemo(() => [
    {
      Header: label,
      accessor: 'assessmentCriteria',
      input: { node: <TextEditorInput />, rules: { required: true } },
      valueRender: (value) => <Box dangerouslySetInnerHTML={{ __html: value }} />,
    },
  ]);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <>
          <TableInput
            {...field}
            error={error}
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

AssessmentCriteria.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  error: PropTypes.string,
};
