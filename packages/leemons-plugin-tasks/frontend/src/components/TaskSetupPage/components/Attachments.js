import React, { useMemo } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { TableInput, TextInput } from '@bubbles-ui/components';
import useTableInputLabels from '../../../helpers/useTableInputLabels';
import { FilePicker } from './FilePicker';

export default function Attachments() {
  const tableInputLabels = useTableInputLabels();
  const { control } = useFormContext();

  // const columns = useMemo(
  //   () => [
  //     {
  //       // TRANSLATE: Column header for the attachment title
  //       Header: 'Attachments',
  //       accessor: 'attachment',
  //       input: {
  //         node: <TextInput />,
  //       },
  //     },
  //   ],
  //   []
  // );

  return (
    <Controller
      name="attachments"
      control={control}
      render={({ field: { onChange, value } }) => (
        <FilePicker
          accept={null}
          multipleUpload
          onChange={(files) => {
            if (!files) {
              onChange([]);
              return;
            }

            const fls = Array.isArray(files) ? files : [files];
            onChange(fls?.map((file) => file.name));
          }}
          initialFiles={value?.map((file) => ({ name: file }))}
        />
        // <TableInput
        //   columns={columns}
        //   removable={true}
        //   labels={tableInputLabels}
        //   // EN: Parse the data to be displayed in the table
        //   // ES: Procesa los datos a mostrar en la tabla
        //   data={value?.map((item) => ({ attachment: item }))}
        //   // EN: Parse the data to be sent to the server
        //   // ES: Procesa los datos a enviar al servidor
        //   onChange={(v) => {
        //     onChange(v.map(({ attachment }) => attachment));
        //   }}
        // />
      )}
    />
  );
}
