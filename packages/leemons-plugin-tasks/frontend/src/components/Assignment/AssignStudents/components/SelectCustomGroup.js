import React, { useEffect } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { useForm, Controller } from 'react-hook-form';
import { TextInput, Alert, Loader, ContextContainer } from '@bubbles-ui/components';
import SelectUserAgent from '@users/components/SelectUserAgent';
import useGroupedClassesWithSelectedSubjects from '../hooks/useGroupedClassesWithSelectedSubjects';

export default function SelectCustomGroup({ labels, profiles, onChange, value }) {
  const { control, watch, getValues } = useForm({
    defaultValues: {},
  });

  const { assignableStudents, subjects } = useGroupedClassesWithSelectedSubjects();

  useEffect(() => {
    const handleChange = (v) => {
      if (v.name?.length && v.assignees?.length) {
        const assignees =
          // EN: Create a group per subject
          // ES: Crear un grupo por asignatura
          subjects.map((subject) => ({
            // TODO: Save custom group with name and students to be reused
            group: undefined, // v.name,
            type: 'custom',
            subject,
            students: v.assignees,
          }));

        // EN: Do not update if same values
        // ES: No actualizar si son iguales
        if (!value || !_.isEqual(value, assignees)) {
          onChange(assignees);
        }
      } else if (!value || value?.length) {
        onChange([]);
      }
    };

    const subscription = watch(handleChange);

    handleChange(getValues());
    return subscription.unsubscribe;
  }, [watch, subjects, onChange, value]);

  if (!assignableStudents) {
    return <Loader />;
  }
  if (!assignableStudents?.length) {
    return <Alert title={labels?.noStudentsToAssign} severity="error" closeable={false} />;
  }
  return (
    <ContextContainer>
      <Controller
        name="name"
        shouldUnregister
        control={control}
        render={({ field }) => <TextInput {...field} label={labels?.groupName} />}
      />
      <Controller
        name="assignees"
        shouldUnregister
        control={control}
        render={({ field }) => (
          <SelectUserAgent
            {...field}
            label={labels?.students}
            maxSelectedValues={0}
            users={assignableStudents}
            profiles={profiles}
          />
        )}
      />
    </ContextContainer>
  );
}

SelectCustomGroup.propTypes = {
  labels: PropTypes.shape({
    groupName: PropTypes.string,
    students: PropTypes.string,
    noStudentsToAssign: PropTypes.string,
  }).isRequired,
  profiles: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.arrayOf(PropTypes.string),
};
