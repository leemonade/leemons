import React, { useMemo } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { TableInput, Box } from '@bubbles-ui/components';
import { TextEditor } from '@bubbles-ui/editors';

export default function Contents() {
  const { control } = useFormContext();

  const columns = useMemo(() => [
    {
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
            labels={{
              add: 'ADD',
              remove: 'REMOVE',
              edit: 'EDIT',
              accept: 'ACCEPT',
              cancel: 'CANCEL',
            }}
          />
        </>
      )}
    />
  );
}
