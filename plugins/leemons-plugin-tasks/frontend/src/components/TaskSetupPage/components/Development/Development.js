import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';
import { Box, InputWrapper, TableInput, Button } from '@bubbles-ui/components';
import { AddCircleIcon } from '@bubbles-ui/icons/outline';
import { TextEditorInput, TextEditorViewer } from '@common/components';
import useTableInputLabels from '@tasks/helpers/useTableInputLabels';

export default function Development({ name, label, placeholder, required }) {
  const tableInputLabels = useTableInputLabels();

  const { control } = useFormContext();

  const columns = useMemo(() => [
    {
      Header: '',
      accessor: 'development',
      input: {
        node: <TextEditorInput placeholder={placeholder} />,
        rules: { required: true },
      },
      valueRender: (value) => <TextEditorViewer>{value}</TextEditorViewer>,
    },
  ]);

  return (
    <InputWrapper label={label}>
      <Controller
        control={control}
        name={name}
        rules={{ validate: (value) => !required || value?.length > 0 }}
        render={({ field, fieldState: { error } }) => (
          <Box style={{ marginRight: 5 }}>
            <TableInput
              {...field}
              columns={columns}
              editable
              resetOnAdd
              // TRANSLATE: Required error label
              error={error && 'This field is required'}
              data={field.value || []}
              labels={tableInputLabels}
              renderActionButton={({ disabled, onAdd }) => (
                <Button
                  variant="link"
                  leftIcon={<AddCircleIcon />}
                  disabled={disabled}
                  onClick={onAdd}
                >
                  {tableInputLabels.add}
                </Button>
              )}
            />
          </Box>
        )}
      />
    </InputWrapper>
  );
}

Development.propTypes = {
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  required: PropTypes.bool,
  name: PropTypes.string.isRequired,
  form: PropTypes.any,
};
