import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useFormContext, Controller } from 'react-hook-form';
import { TableInput, Box } from '@bubbles-ui/components';
import { TextEditor } from '@bubbles-ui/editors';
import useTableInputLabels from '../../../helpers/useTableInputLabels';

export default function Contents({ required }) {
  const tableInputLabels = useTableInputLabels();
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const columns = useMemo(() => [
    {
      // TRANSLATE: Column header for the content title
      Header: `Content${required ? '*' : ''}`,
      accessor: 'content',
      input: { node: <TextEditor />, rules: { required: true } },
      valueRender: (value) => <Box dangerouslySetInnerHTML={{ __html: value }} />,
    },
  ]);

  return (
    <Controller
      control={control}
      name="content"
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
};
