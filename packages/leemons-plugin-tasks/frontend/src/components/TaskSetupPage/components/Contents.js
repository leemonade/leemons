import React, { useMemo } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { TableInput, Box } from '@bubbles-ui/components';
import { TextEditor } from '@bubbles-ui/editors';
import useTableInputLabels from '../../../helpers/useTableInputLabels';

export default function Contents() {
  const tableInputLabels = useTableInputLabels();
  const { control } = useFormContext();

  const columns = useMemo(() => [
    {
      // TRANSLATE: Column header for the content title
      Header: 'Content',
      accessor: 'content',
      input: { node: <TextEditor />, rules: { required: true } },
      valueRender: (value) => <Box dangerouslySetInnerHTML={{ __html: value }} />,
    },
  ]);

  return (
    <Controller
      control={control}
      name="content"
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
