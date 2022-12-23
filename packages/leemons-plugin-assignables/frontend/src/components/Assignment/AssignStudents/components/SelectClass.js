import React, { useEffect } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {
  CheckBoxGroup,
  Alert,
  Stack,
  Loader,
  ContextContainer,
  UserDisplayItem,
  Paragraph,
  Switch,
  Box,
} from '@bubbles-ui/components';
import { SelectUserAgent } from '@users/components';
import { useForm, Controller } from 'react-hook-form';
import { getUserAgentsInfoRequest } from '@users/request';
import { useApi } from '@common';
import ConditionalInput from '@tasks/components/Inputs/ConditionalInput';

function useUserAgentsInfo(users) {
  const [data] = useApi(getUserAgentsInfoRequest, users);

  if (data?.userAgents) {
    return data?.userAgents.map(({ user }) => user);
  }

  return null;
}

function NonAssignableStudents({ users, labels }) {
  const students = useUserAgentsInfo(users);

  return (
    <Paragraph>
      {labels?.unableToAssignStudentsMessage}:{' '}
      <Stack>
        {students?.map((student) => (
          <UserDisplayItem key={student.id} {...student} size="xs" />
        ))}
      </Stack>
    </Paragraph>
  );
}

NonAssignableStudents.propTypes = {
  users: PropTypes.arrayOf(PropTypes.string).isRequired,
  labels: PropTypes.shape({
    unableToAssignStudentsMessage: PropTypes.string,
  }),
};

export default function SelectClass({
  labels,
  profiles,
  onChange,
  value,
  defaultValue,
  groupedClassesWithSelectedSubjects,
  showResultsCheck,
  showCorrectAnswersCheck,
}) {
  const { control, watch, getValues } = useForm({
    defaultValues: {
      excluded: [],
      ...defaultValue,
      showResults: true,
      showCorrectAnswers: true,
      showExcluded: _.isNil(defaultValue?.showExcluded)
        ? defaultValue?.excluded?.length > 0
        : defaultValue?.showExcluded,
    },
  });

  const { classes, nonAssignableStudents, assignableStudents } = groupedClassesWithSelectedSubjects;

  useEffect(() => {
    const handleChange = (data, { name: fieldChanged } = {}) => {
      if (!data?.assignees) {
        return;
      }

      if (!classes?.length) {
        return;
      }

      const selectedClasses = data.assignees
        .map((a) => classes.find((c) => c.id === a))
        // EN: Remove excluded students from assignableStudents
        // ES: Quitar alumnos excluidos de assignableStudents
        .map((c) => ({
          ...c,
          assignableStudents: data.showExcluded
            ? c.assignableStudents.filter((s) => !data.excluded?.includes(s))
            : c.assignableStudents,
        }))
        .filter((c) => c.assignableStudents.length);

      const assignees = selectedClasses.flatMap((g) => {
        if (g.type === 'group') {
          return g.classes.map((c) => ({
            group: c.class.id,
            students: _.intersection(c.assignableStudents, g.assignableStudents),
          }));
        }

        return {
          group: g.id,
          students: g.assignableStudents,
        };
      });

      if (assignees.length) {
        if (
          !value ||
          !_.isEqual(value, assignees) ||
          ['addNewClassStudents', 'showResults', 'showCorrectAnswers'].includes(fieldChanged)
        ) {
          onChange(assignees, data);
        }
      } else if (!value || value?.length) {
        onChange([], data);
      }
    };

    const subscription = watch(handleChange);

    handleChange(getValues());

    return subscription.unsubscribe;
  }, [watch, classes, value]);

  if (!assignableStudents) {
    return <Loader />;
  }

  if (!assignableStudents?.length) {
    return <Alert title={labels?.noStudentsToAssign} severity="error" closeable={false} />;
  }

  return (
    <ContextContainer>
      <Controller
        name="assignees"
        control={control}
        render={({ field }) => (
          <CheckBoxGroup
            {...field}
            direction="column"
            data={classes
              ?.map((c) => {
                const disabled = !c.assignableStudents.length;
                return {
                  value: `${c.id}${disabled ? '-disabled' : ''}`,
                  disabled,
                  label: `${c.label} (${c.assignableStudents.length}/${c.totalStudents} ${labels?.matchingStudents})`,
                  _type: c.type,
                  checked: !disabled && field.value?.includes(c.id),
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
              })}
          />
        )}
      />
      {!!nonAssignableStudents?.length && (
        <NonAssignableStudents users={nonAssignableStudents} labels={labels} />
      )}
      <Box>
        <Controller
          name="addNewClassStudents"
          control={control}
          render={({ field }) => (
            <Switch {...field} label={labels?.addNewClassStudents} checked={field.value} />
          )}
        />
        <Controller
          name="showExcluded"
          control={control}
          render={({ field: { value: show, onChange: onToggle } }) => (
            <ConditionalInput
              label={labels?.excludeStudents}
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
                      clearable={labels?.clearStudents}
                      label={labels?.excludeStudents}
                      maxSelectedValues={0}
                      users={assignableStudents}
                      profiles={profiles}
                    />
                  )}
                />
              )}
            />
          )}
        />
        {showResultsCheck && (
          <Controller
            control={control}
            name={'showResults'}
            render={({ field }) => (
              <Switch
                {...field}
                checked={!field.value}
                onChange={(v) => field.onChange(!v)}
                label={labels?.showResults}
              />
            )}
          />
        )}
        {showCorrectAnswersCheck && (
          <Controller
            control={control}
            name={'showCorrectAnswers'}
            render={({ field }) => (
              <Switch
                {...field}
                checked={!field.value}
                onChange={(v) => field.onChange(!v)}
                label={labels?.showCorrectAnswers}
              />
            )}
          />
        )}
      </Box>
    </ContextContainer>
  );
}

SelectClass.propTypes = {
  labels: PropTypes.shape({
    excludeStudents: PropTypes.string,
    clearStudents: PropTypes.string,
    unableToAssignStudentsMessage: PropTypes.string,
    matchingStudents: PropTypes.string,
    noStudentsToAssign: PropTypes.string,
    addNewClassStudents: PropTypes.string,
  }),
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
    nonAssignableStudents: PropTypes.arrayOf(PropTypes.string).isRequired,
    assignableStudents: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  defaultValue: PropTypes.shape({
    assignees: PropTypes.arrayOf(PropTypes.string),
    excluded: PropTypes.arrayOf(PropTypes.string),
    showExcluded: PropTypes.bool,
    showResults: PropTypes.bool,
    showCorrectAnswers: PropTypes.bool,
  }),
  showResultsCheck: PropTypes.bool,
  showCorrectAnswersCheck: PropTypes.bool,
};
