import React, { useMemo } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';

import { Box, Loader, createStyles, RadioGroup, Checkbox } from '@bubbles-ui/components';
import ConditionalInput from '@tasks/components/Inputs/ConditionalInput';
import { SelectUserAgent } from '@users/components';
import { intersection } from 'lodash';
import PropTypes from 'prop-types';

import { NonAssignableStudents } from './NonAssignableStudents';
import SelectedStudentsInfo from './SelectedStudentsInfo';

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
  radioContainer: {
    paddingLeft: theme.other.global.spacing.gap.lg,
  },
}));

function useOnChange({ control, onChange, availableClasses }) {
  const { classes: selectedClasses, autoAssign, showExcluded, excluded } = useWatch({ control });

  const teacherTypes = useMemo(() => {
    return availableClasses.filter(c => (selectedClasses ?? []).includes(c.id))?.flatMap(c => c.teacherTypes);
  }, [selectedClasses, availableClasses]);

  React.useEffect(() => {
    if (!selectedClasses || !availableClasses?.length) {
      onChange({
        type: 'class',
        value: [],
        autoAssign: !!autoAssign,
        teacherTypes,
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
        teacherTypes,
        raw: { classes: selectedClasses, autoAssign, showExcluded, excluded },
      });
    } else {
      onChange({
        type: 'class',
        value: [],
        autoAssign: !!autoAssign,
        teacherTypes,
        raw: { classes: selectedClasses, autoAssign, showExcluded, excluded },
      });
    }
  }, [selectedClasses, autoAssign, showExcluded, excluded, availableClasses, onChange, teacherTypes]);
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
            label: `${klass.label}`,
            help: `${klass.assignableStudents.length}/${klass.totalStudents} ${localizations?.studentsCount}`,
            helpPosition: 'bottom',
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
    [availableClasses, localizations?.studentsCount]
  );

  const { classes } = useSelectClassStyles();

  if (!assignableStudents) {
    return <Loader />;
  }

  return (
    <Box className={classes.root}>
      <Box className={classes.radioContainer}>
        <Controller
          name="classes"
          control={control}
          render={({ field }) => (
            <RadioGroup
              {...field}
              direction="column"
              orientation="vertical"
              onChange={(newValue) => field.onChange([newValue])}
              value={field.value?.[0] ?? null}
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
      </Box>
      {!!nonAssignableStudents?.length && (
        <NonAssignableStudents
          users={nonAssignableStudents}
          error={localizations?.notAllStudentsAssigned}
        />
      )}
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
      <SelectedStudentsInfo
        control={control}
        value={value}
        availableClasses={availableClasses}
        localizations={localizations}
      />
      <Controller
        name="autoAssign"
        control={control}
        defaultValue={true}
        render={({ field }) => (
          <Checkbox {...field} checked={field.value} label={localizations?.autoAssignStudents} />
        )}
      />
    </Box>
  );
}

SelectClass.propTypes = {
  control: PropTypes.object,
  onChange: PropTypes.func,
  value: PropTypes.object,
  availableClasses: PropTypes.array,
  localizations: PropTypes.object,
  assignableStudents: PropTypes.array,
  studentProfile: PropTypes.object,
  groupedClassesWithSelectedSubjects: PropTypes.object,
  error: PropTypes.bool,
};

export default SelectClass;
