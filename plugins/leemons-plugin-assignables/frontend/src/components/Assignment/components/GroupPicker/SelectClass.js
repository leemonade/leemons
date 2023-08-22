import React from 'react';
import PropTypes from 'prop-types';
import { Box, Loader, Switch, CheckBoxGroup, createStyles } from '@bubbles-ui/components';
import { useForm, Controller, useWatch } from 'react-hook-form';
import ConditionalInput from '@tasks/components/Inputs/ConditionalInput';
import { SelectUserAgent } from '@users/components';
import { intersection } from 'lodash';
import { NonAssignableStudents } from './NonAssignableStudents';

const useSelectClassStyles = createStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.other.global.spacing.gap.lg,
    maxWidth: `calc(543px - ${theme.other.global.spacing.gap.lg})`,
  },
  switchContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.other.global.spacing.gap.sm,
  },
}));

function useOnChange({ control, onChange, availableClasses }) {
  const { classes: selectedClasses, autoAssign, showExcluded, excluded } = useWatch({ control });

  React.useEffect(() => {
    if (!selectedClasses || !availableClasses?.length) {
      onChange({
        type: 'class',
        value: [],
        autoAssign: !!autoAssign,
        raw: { classes: selectedClasses, autoAssign, showExcluded, excluded },
      });
      return;
    }

    const availableClassesById = {};
    availableClasses.forEach((klass) => {
      availableClassesById[klass.id] = klass;
    });

    const value = selectedClasses
      .map((klass) => {
        const classData = availableClassesById[klass];

        if (!showExcluded || !excluded?.length) {
          return classData;
        }

        const excludedStudentsById = {};
        excluded?.forEach((student) => {
          excludedStudentsById[student] = true;
        });

        return {
          ...classData,
          assignableStudents: classData.assignableStudents.filter(
            (student) => !excludedStudentsById[student]
          ),
        };
      })
      .filter((klass) => klass.assignableStudents.length)
      .flatMap((group) => {
        if (group.type === 'group') {
          return group.classes.map((klass) => ({
            group: klass.class.id,
            students: intersection(klass.assignableStudents, group.assignableStudents),
          }));
        }

        return {
          group: group.id,
          students: group.assignableStudents,
        };
      });

    if (value?.length) {
      onChange({
        type: 'class',
        value,
        autoAssign: !!autoAssign,
        raw: { classes: selectedClasses, autoAssign, showExcluded, excluded },
      });
    } else {
      onChange({
        type: 'class',
        value: [],
        autoAssign: !!autoAssign,
        raw: { classes: selectedClasses, autoAssign, showExcluded, excluded },
      });
    }
  }, [selectedClasses, autoAssign, showExcluded, excluded]);
}

export function SelectClass({
  localizations,
  groupedClassesWithSelectedSubjects,
  studentProfile,
  onChange,
  value,
  error,
}) {
  const { control } = useForm({
    defaultValues: value?.raw,
  });

  const {
    assignableStudents,
    classes: availableClasses,
    nonAssignableStudents,
  } = groupedClassesWithSelectedSubjects;

  useOnChange({ control, onChange, availableClasses });

  const data = React.useMemo(
    () =>
      availableClasses
        ?.map((klass) => {
          const hasPickableStudents = !!klass.assignableStudents.length;

          return {
            value: `${klass.id}${hasPickableStudents ? '' : '-disabled'}`,
            disabled: !hasPickableStudents,
            label: `${klass.label} (${klass.assignableStudents.length}/${klass.totalStudents} ${localizations?.studentsCount})`,
            _type: klass.type,
          };
        })
        // Sort in the following order:
        // - Enabled first
        // - type == group first
        // - alphabetical
        .sort((a, b) => {
          if (a.disabled === b.disabled) {
            if (a._type === b._type) {
              return a.label > b.label ? 1 : -1;
            }
            return a._type === 'group' ? -1 : 1;
          }
          return a.disabled ? 1 : -1;
        }),
    [availableClasses, value?.classes]
  );

  const { classes } = useSelectClassStyles();

  if (!assignableStudents) {
    return <Loader />;
  }

  return (
    <Box className={classes.root}>
      <Controller
        name="classes"
        control={control}
        render={({ field }) => (
          <CheckBoxGroup
            {...field}
            direction="column"
            data={
              data?.map((klass) => ({
                ...klass,
                checked: !klass.disabled && field.value?.includes(klass.value),
              })) || []
            }
            error={error && localizations?.error}
          />
        )}
      />
      {!!nonAssignableStudents?.length && (
        <NonAssignableStudents
          users={nonAssignableStudents}
          error={localizations?.notAllStudentsAssigned}
        />
      )}
      <Box className={classes.switchContainer}>
        <Controller
          name="autoAssign"
          control={control}
          render={({ field }) => (
            <Switch {...field} checked={field.value} label={localizations?.autoAssignStudents} />
          )}
        />
        <Controller
          name="showExcluded"
          control={control}
          render={({ field: { value: show, onChange: onToggle } }) => (
            <ConditionalInput
              label={localizations?.excludeStudents}
              value={!!show}
              showOnTrue
              onChange={onToggle}
              render={() => (
                <Controller
                  name="excluded"
                  control={control}
                  render={({ field }) => (
                    <SelectUserAgent
                      {...field}
                      label={localizations?.excludeStudentsInput?.label}
                      placeholder={localizations?.excludeStudentsInput?.placeholder}
                      maxSelectedValues={0}
                      users={assignableStudents}
                      profiles={[studentProfile]}
                    />
                  )}
                />
              )}
            />
          )}
        />
      </Box>
    </Box>
  );
}

SelectClass.propTypes = {
  localizations: PropTypes.object,
  groupedClassesWithSelectedSubjects: PropTypes.object,
  value: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  studentProfile: PropTypes.string.isRequired,
  error: PropTypes.any,
};

export default SelectClass;
