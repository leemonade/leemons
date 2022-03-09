import React, { useMemo } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { TableInput, TextInput } from '@bubbles-ui/components';

export default function Attachments() {
  const { control } = useFormContext();

  const columns = useMemo(
    () => [
      {
        Header: 'Attachments',
        accessor: 'attachment',
        input: {
          node: <TextInput />,
        },
      },
    ],
    []
  );

  return (
    <Controller
      name="attachments"
      control={control}
      render={({ field: { onChange, value } }) => (
        <TableInput
          columns={columns}
          removable={true}
          labels={{
            add: 'Add',
            remove: 'Remove',
            edit: 'Edit',
            accept: 'Accept',
            cancel: 'Cancel',
          }}
          // EN: Parse the data to be displayed in the table
          // ES: Procesa los datos a mostrar en la tabla
          data={value.map((item) => ({ attachment: item }))}
          // EN: Parse the data to be sent to the server
          // ES: Procesa los datos a enviar al servidor
          onChange={(v) => {
            onChange(v.map(({ attachment }) => attachment));
          }}
        />
      )}
    />
  );
}
