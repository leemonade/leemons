import { SelectUserAgent } from '@users/components';
import { intersection } from 'lodash';
import React from 'react';
import { useForm, useWatch, Controller } from 'react-hook-form';

function useOnChange({ control, onChange, classes }) {
  const { student } = useWatch({ control });

  React.useEffect(() => {
    // EN: Get the groups that are selected through their students
    // ES: Obtener los grupos que seleccionaron a través de sus estudiantes
    const selectedGroups = classes
      .map((klass) => ({
        ...klass,
        students: intersection(klass.students, [student]),
      }))
      .filter((klass) => klass.students.length);

    // EN: Get the classes selected through their groups
    // ES: Obtener las clases que seleccionaron a través de sus grupos
    const selectedClasses = selectedGroups.flatMap((group) => {
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

    onChange({
      type: 'customGroup',
      value: selectedClasses,
      raw: { student },
    });
  }, [student]);
}

export default function SelectSingleStudent({
  onChange,
  value,
  error,
  studentProfile,
  groupedClassesWithSelectedSubjects,
  localizations,
}) {
  const form = useForm({
    defaultValues: value?.raw,
  });

  React.useEffect(() => console.log('value', value), [value]);

  const { assignableStudents, classes: availableClasses } = groupedClassesWithSelectedSubjects;

  useOnChange({ control: form.control, onChange, classes: availableClasses });

  return (
    <Controller
      name="student"
      control={form.control}
      render={({ field }) => (
        <SelectUserAgent
          {...field}
          error={error && !field.value && localizations?.studentInput?.error}
          checked={field.value}
          maxSelectedValues={1}
          users={assignableStudents}
          profiles={[studentProfile]}
          label={localizations?.studentInput?.label}
          placeholder={localizations?.studentInput?.placeholder}
        />
      )}
    />
  );
}
