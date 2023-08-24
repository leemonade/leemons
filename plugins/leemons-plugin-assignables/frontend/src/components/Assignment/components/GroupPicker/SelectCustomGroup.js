import React from 'react';
import PropTypes from 'prop-types';
import { Box, Loader, TextInput, Switch, createStyles } from '@bubbles-ui/components';
import { SelectUserAgent } from '@users/components';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { intersection } from 'lodash';

export const useSelectCustomGroupStyles = createStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.other.global.spacing.gap.lg,
    maxWidth: `calc(543px - ${theme.other.global.spacing.gap.lg})`,
  },
}));

function useOnChange({ control, onChange, classes }) {
  const { name: groupName, students: selectedStudents, hideGroupName } = useWatch({ control });

  React.useEffect(() => {
    if (!groupName?.length || !selectedStudents?.length) {
      onChange({
        type: 'customGroup',
        value: [],
        raw: { name: groupName, students: selectedStudents, hideGroupName },
      });
    }

    // EN: Get the groups that are selected through their students
    // ES: Obtener los grupos que seleccionaron a través de sus estudiantes
    const selectedGroups = classes
      .map((klass) => ({
        ...klass,
        students: intersection(klass.students, selectedStudents),
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
          name: groupName,
          showToStudents: !hideGroupName,
        }));
      }

      return {
        group: group.id,
        type: 'custom',
        students: group.students,
        c: group,
        name: groupName,
        showToStudents: !hideGroupName,
      };
    });

    onChange({
      type: 'customGroup',
      value: selectedClasses,
      raw: { name: groupName, students: selectedStudents, hideGroupName },
    });
  }, [groupName, selectedStudents]);
}

export function SelectCustomGroup({
  groupedClassesWithSelectedSubjects,
  localizations,
  onChange,
  studentProfile,
  value,
  error,
}) {
  const { control } = useForm({
    defaultValues: value?.raw,
  });
  const { assignableStudents, classes: availableClasses } = groupedClassesWithSelectedSubjects;

  useOnChange({ control, onChange, classes: availableClasses });

  const { classes } = useSelectCustomGroupStyles();

  if (!assignableStudents) {
    return <Loader />;
  }

  return (
    <Box className={classes.root}>
      <Box>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextInput
              {...field}
              label={localizations?.groupName?.label}
              error={error && !field.value?.length && localizations?.groupName?.error}
              placeholder={localizations?.groupName?.placeholder}
            />
          )}
        />
        <Controller
          name="hideGroupName"
          control={control}
          render={({ field }) => (
            <Switch
              {...field}
              checked={!!field.value}
              shouldUnregister
              label={localizations?.hideCustomName}
            />
          )}
        />
      </Box>

      <Controller
        name="students"
        control={control}
        rules={{
          required: true,
          minLength: 1,
        }}
        render={({ field }) => (
          <SelectUserAgent
            {...field}
            error={error && !field.value?.length && localizations?.studentsInput?.error}
            checked={field.value}
            maxSelectedValues={0}
            users={assignableStudents}
            profiles={[studentProfile]}
            label={localizations?.studentsInput?.label}
            placeholder={localizations?.studentsInput?.placeholder}
          />
        )}
      />
    </Box>
  );
}

SelectCustomGroup.propTypes = {
  groupedClassesWithSelectedSubjects: PropTypes.shape({
    assignableStudents: PropTypes.array,
    classes: PropTypes.array,
  }).isRequired,
  localizations: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.object,
  studentProfile: PropTypes.string.isRequired,
  error: PropTypes.any,
};
