import React, { useState, useEffect, useRef, forwardRef } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Select, Button, ContextContainer, Box, Text } from '@bubbles-ui/components';
import { DeleteIcon } from '@bubbles-ui/icons/solid';
import { useForm, Controller } from 'react-hook-form';
import { getCentersWithToken } from '@users/session';
import SelectUserAgent from '@users/components/SelectUserAgent';
import { listTeacherClassesRequest } from '@academic-portfolio/request';
import { useApi } from '@common';

export default function AssignUsers({ labels, assignTo, onChange }) {
  const [data, setData] = useState([]);
  const [centers] = useApi(getCentersWithToken);
  const [assignees, setAssignees] = useState([]);
  const userAgents = useRef({ centers: [], agents: [] });

  const {
    handleSubmit,
    formState: { errors },
    control,
    watch,
    resetField,
  } = useForm({
    defaultValues: {},
  });

  // EN: react-hook-form watcher for the assignTo field
  // ES: react-hook-form watcher para el campo assignTo
  const assignToValue = watch('assign');

  // EN: Render the needed selector (class or student)
  // ES: Renderiza el selector necesario (clase o estudiante)
  const AssigneeSelector = forwardRef((props, ref) => {
    if (assignToValue === 'class') {
      return <Select fullWidth {...props} ref={ref} data={data} disabled={!data.length} />;
    }
    if (assignToValue === 'student') {
      return <SelectUserAgent {...props} />;
    }
    return <></>;
  });

  AssigneeSelector.displayName = 'AssigneeSelector';

  // EN: When the assignee changes, we need to reset the form
  // ES: Cuando el asignado cambia, necesitamos resetear el formulario
  useEffect(() => {
    if (assignToValue) {
      resetField('assignee');
    }
  }, [assignToValue]);

  // EN: Fetch the needed data for the assignee selector
  // ES: Obtiene los datos necesarios para el selector de asignado
  useEffect(async () => {
    if (assignToValue === 'class') {
      // EN: Get the new userAgents if required
      // ES: Obtener los nuevos userAgents si es necesario
      if (userAgents.current.centers !== centers) {
        userAgents.current = {
          centers,
          agents: (await getCentersWithToken()).map((agent) => agent.userAgentId),
        };
      }

      // EN: Get the classes the teacher has
      // ES: Obtener las clases que tiene el profesor
      const classes = _.flatten(
        await Promise.all(
          userAgents.current.agents.map(
            async (agent) =>
              (
                await listTeacherClassesRequest({
                  page: 0,
                  size: 100,
                  teacher: agent,
                })
              ).data.items
          )
        )
      ).map((_class) => ({
        value: _class.id,
        // TODO: Update to standard class name
        label: `${_class.courses.name || _class.courses.index} - ${_class.subject.name}`,
      }));

      setData(classes);
    } else {
      setData([]);
    }
  }, [assignToValue, centers]);

  // EN: Emit the change to the parent component
  // ES: Emite el cambio al componente padre
  useEffect(() => {
    if (typeof onChange === 'function') {
      onChange(assignees);
    }
  }, [assignees, onChange]);

  const assigneeLabel =
    assignToValue === 'class' ? labels.classroomToAssign : labels.studentToAssign;

  // EN: Handle the form submit
  // ES: Maneja el submit del formulario
  const onSubmit = (value) => {
    if (value.assign && value.assignee) {
      const exists = assignees.reduce((acc, { type, assignee }) => {
        if (acc === true) {
          return acc;
        }

        if (type === value.assign && assignee === value.assignee) {
          return true;
        }

        return acc;
      }, false);

      if (!exists) {
        setAssignees((a) => [...a, { type: value.assign, assignee: value.assignee }]);
      }
    }
  };

  // EN: Handle the assignee delete
  // ES: Maneja el eliminado del asignado
  const removeAssignee = (type, assignee) => {
    setAssignees((a) => a.filter((assign) => assign.type !== type && assign.assignee !== assignee));
  };

  return (
    <>
      <ContextContainer alignItems="end" direction="row">
        <Controller
          control={control}
          name="assign"
          rules={{ required: 'Assign required' }}
          render={({ field }) => (
            <Select
              fullWidth
              error={errors.assign}
              label={labels?.assignTo}
              {...field}
              data={assignTo}
            />
          )}
        />
        {assignToValue && (
          <Controller
            control={control}
            name="assignee"
            rules={{ required: 'Assignee Required' }}
            render={({ field }) => (
              <AssigneeSelector error={errors.assignee} label={assigneeLabel} {...field} />
            )}
          />
        )}
        <Button size="sm" onClick={handleSubmit(onSubmit)}>
          Add
        </Button>
      </ContextContainer>
      <Box>
        {assignees.map(({ type, assignee }) => (
          <Box key={`${type} - ${assignee}`}>
            <Text>
              {type} - {assignee}
            </Text>
            <DeleteIcon onClick={() => removeAssignee(type, assignee)} />
          </Box>
        ))}
      </Box>
    </>
  );
}

AssignUsers.propTypes = {
  labels: PropTypes.object,
  assignTo: PropTypes.array,
  onChange: PropTypes.func,
};
