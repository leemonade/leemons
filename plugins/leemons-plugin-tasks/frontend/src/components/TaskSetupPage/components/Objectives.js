import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';
import { HtmlText, InputWrapper, TableInput, Textarea, Button } from '@bubbles-ui/components';
import { AddCircleIcon } from '@bubbles-ui/icons/solid';
import useTableInputLabels from '../../../helpers/useTableInputLabels';

export default function Objectives({ form, name, label, required }) {
  const tableInputLabels = useTableInputLabels();
  const localForm = useFormContext();

  const {
    control,
    formState: { errors },
  } = form ?? localForm;
  const curriculumObjectives = form.watch(name);

  const columns = useMemo(() => [
    {
      Header: '',
      accessor: 'objective',
      input: { node: <Textarea />, rules: { required: true } },
      valueRender: (value) => <HtmlText>{value}</HtmlText>,
    },
  ]);

  return (
    <InputWrapper label={label}>
      <Controller
        control={control}
        name={name}
        rules={{ validate: (value) => !required || value?.length > 0 }}
        render={({ field }) => (
          <TableInput
            {...field}
            columns={columns}
            editable
            error={errors.objectives && tableInputLabels.required}
            data={curriculumObjectives || []}
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
        )}
      />
    </InputWrapper>
  );
}

Objectives.propTypes = {
  label: PropTypes.string.isRequired,
  required: PropTypes.bool,
  name: PropTypes.string.isRequired,
  form: PropTypes.any,
};
