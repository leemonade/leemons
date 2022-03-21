import React, { useState, useEffect, useRef, forwardRef, useMemo } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Select, Button, ContextContainer, Box, Text } from '@bubbles-ui/components';
import { DeleteIcon } from '@bubbles-ui/icons/solid';
import { useForm, Controller } from 'react-hook-form';
import { getCentersWithToken } from '@users/session';
import SelectUserAgent from '@users/components/SelectUserAgent';
import { listTeacherClassesRequest } from '@academic-portfolio/request';
import { useApi } from '@common';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { getProfiles } from '../../request/profiles';

export default function AssignUsers({ labels, profile, assignTo, onChange }) {
  const [data, setData] = useState([]);
  const [centers] = useApi(getCentersWithToken);
  const [assignees, setAssignees] = useState([]);
  const userAgents = useRef({ centers: [], agents: [] });
  const [profiles, setProfiles] = useState(null);

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
  const AssigneeSelector = useMemo(() => {
    const Component = forwardRef((props, ref) => {
      if (assignToValue === 'class') {
        return <Select fullWidth {...props} ref={ref} data={data} disabled={!data.length} />;
      }
      if (assignToValue === 'student') {
        return <SelectUserAgent maxSelectedValues={0} {...props} />;
      }
      return <></>;
    });
    Component.displayName = 'AssigneeSelector';

    return Component;
  }, [assignToValue, data]);

  useEffect(async () => {
    const p = await getProfiles(profile);
    setProfiles([p[0].profile]);
  }, []);

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
      if (value.assign === 'class') {
        const exists = assignees.find((assignee) => assignee.group === value.assignee);

        // EN: Do not allow to duplicate existing classes
        // ES: No permitir duplicar clases existentes
        if (exists) {
          addErrorAlert('Tried to assign a class that is already assigned');
          return;
        }

        setAssignees((a) => [
          ...a,
          {
            group: value.assignee,
            label: data.find((d) => d.value === value.assignee)?.label,
            type: 'class',
          },
        ]);
        return;
      }
      setAssignees((a) => [...a, { students: value.assignee, subject: 'WIP', type: 'students' }]);
    }
  };

  // EN: Handle the assignee delete
  // ES: Maneja el eliminado del asignado
  const removeAssignee = (assigneeToRemove) => {
    setAssignees((a) => a.filter((assigneeToTest) => assigneeToTest !== assigneeToRemove));
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
        {assignToValue === 'student' && <p>Select subject</p>}
        {assignToValue && (
          <Controller
            control={control}
            name="assignee"
            rules={{ required: 'Assignee Required' }}
            render={({ field }) => (
              <AssigneeSelector
                profiles={profiles}
                error={errors.assignee}
                label={assigneeLabel}
                {...field}
              />
            )}
          />
        )}
        <Button size="sm" onClick={handleSubmit(onSubmit)}>
          Add
        </Button>
      </ContextContainer>
      <Box>
        {assignees.map((o, i) => {
          const { type, label, students } = o;
          return (
            <Box key={i}>
              <Text>
                {type} - {type === 'class' ? label : `${students.length} students`}
              </Text>
              <DeleteIcon onClick={() => removeAssignee(o)} />
            </Box>
          );
        })}
      </Box>
    </>
  );
}

AssignUsers.propTypes = {
  labels: PropTypes.object,
  assignTo: PropTypes.array,
  onChange: PropTypes.func,
};
