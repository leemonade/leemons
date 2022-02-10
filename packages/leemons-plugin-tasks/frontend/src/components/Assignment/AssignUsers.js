import React from 'react';
import PropTypes from 'prop-types';
import { Select, Button, ContextContainer } from '@bubbles-ui/components';
import { useForm, Controller } from 'react-hook-form';

export default function AssignUsers({ labels, modes, assignTo }) {
  const { handleSubmit, errors, control, watch } = useForm({
    defaultValues: {},
  });

  const assignToValue = watch('assign');

  const assigneeLabel =
    assignToValue === 'class' ? labels.classroomToAssign : labels.studentToAssign;

  const data = [
    {
      value: '1',
      label: 'Option 1',
    },
    {
      value: '2',
      label: 'Option 2',
    },
  ];

  return (
    <form>
      <ContextContainer alignItems="end" direction="row">
        <Controller
          control={control}
          name="assign"
          render={({ field }) => (
            <Select fullWidth label={labels?.assignTo} {...field} data={assignTo} />
          )}
        />
        {/* <Controller
        control={control}
        name="mode"
        render={({ field }) => <Select fullWidth label={labels?.mode} {...field} data={modes} />}
      /> */}
        {assignToValue && (
          <Controller
            control={control}
            name="assignee"
            render={({ field }) => (
              <Select fullWidth label={assigneeLabel} {...field} data={data} />
            )}
          />
        )}
        <Button size="sm">Add</Button>
      </ContextContainer>
    </form>
  );
}

AssignUsers.propTypes = {
  labels: PropTypes.Object,
  modes: PropTypes.Array,
  assignTo: PropTypes.Array,
};
