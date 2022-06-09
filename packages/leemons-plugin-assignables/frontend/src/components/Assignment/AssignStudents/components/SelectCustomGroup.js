import React, { useEffect } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { useForm, Controller } from 'react-hook-form';
import { TextInput, Alert, Loader, ContextContainer } from '@bubbles-ui/components';
import SelectUserAgent from '@users/components/SelectUserAgent';

export default function SelectCustomGroup({
  labels,
  profiles,
  onChange,
  value,
  groupedClassesWithSelectedSubjects,
}) {
  const { control, watch, getValues } = useForm({
    defaultValues: {},
  });

  const { assignableStudents, subjects, classes } = groupedClassesWithSelectedSubjects;

  useEffect(() => {
    const handleChange = (v) => {
      if (v.name?.length && v.assignees?.length) {
        // EN: Get the groups that are selected through their students
        // ES: Obtener los grupos que seleccionaron a través de sus estudiantes
        const groupsMatchingStudents = classes
          .map((c) => ({
            ...c,
            students: _.intersection(c.students, v.assignees),
          }))
          .filter((c) => c.students.length);

        // EN: Get the classes selected through their groups
        // ES: Obtener las clases que seleccionaron a través de sus grupos
        const classesMatchingStudents = groupsMatchingStudents.flatMap((group) => {
          if (group.type === 'group') {
            return group.classes.map((c) => ({
              group: c.class.id,
              type: 'custom',
              students: group.students,
              c,
            }));
          }

          return {
            group: group.id,
            type: 'custom',
            students: group.students,
            c: group,
          };
        });

        // EN: Do not update if same values
        // ES: No actualizar si son iguales
        if (!value || !_.isEqual(value, classesMatchingStudents)) {
          onChange(classesMatchingStudents);
        }
      } else if (!value || value?.length) {
        onChange([]);
      }
    };

    const subscription = watch(handleChange);

    handleChange(getValues());
    return subscription.unsubscribe;
  }, [watch, subjects, onChange, value, classes]);

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
  groupedClassesWithSelectedSubjects: PropTypes.shape({
    classes: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        assignableStudents: PropTypes.arrayOf(PropTypes.string).isRequired,
        totalStudents: PropTypes.number.isRequired,
        type: PropTypes.string.isRequired,
      })
    ).isRequired,
    subjects: PropTypes.arrayOf(PropTypes.string).isRequired,
    assignableStudents: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};
