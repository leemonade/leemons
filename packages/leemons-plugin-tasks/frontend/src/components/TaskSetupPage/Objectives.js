import React, { useMemo } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { TableInput } from '@bubbles-ui/components';
import { TextEditor } from '@bubbles-ui/editors';

export default function Objectives({ id }) {
  const { control } = useFormContext();

  const columns = useMemo(() => [
    {
      Header: 'Objective',
      accessor: 'objective',
      input: { node: <TextEditor />, rules: { required: true } },
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
