import React, { useEffect, useMemo } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {
  CheckBoxGroup,
  Alert,
  Stack,
  Loader,
  ContextContainer,
  UserDisplayItem,
} from '@bubbles-ui/components';
import { SelectUserAgent } from '@users/components';
import { useForm, Controller } from 'react-hook-form';
import { getUserAgentsInfoRequest } from '@users/request';
import { useApi } from '@common';
import ConditionalInput from '../../../Inputs/ConditionalInput';
import { useGroupedClassesWithSelectedSubjects } from '../hooks';

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
    <p>
      {labels?.unableToAssignStudentsMessage}:{' '}
      <Stack>
        {students?.map((student) => (
          <UserDisplayItem key={student.id} {...student} size="xs" />
        ))}
      </Stack>
    </p>
  );
}

NonAssignableStudents.propTypes = {
  users: PropTypes.arrayOf(PropTypes.string).isRequired,
  labels: PropTypes.shape({
    unableToAssignStudentsMessage: PropTypes.string,
  }),
};
export default function SelectClass({ labels, profiles, onChange, value }) {
  const { control, watch, getValues } = useForm({
    defaultValues: {
      excluded: [],
    },
  });

  const { classes, nonAssignableStudents, assignableStudents } =
    useGroupedClassesWithSelectedSubjects();

  useEffect(() => {
    const handleChange = (data) => {
      if (!data?.assignees) {
        return;
      }

      const selectedClasses = data.assignees
        .map((a) => classes.find((c) => c.id === a))
        // EN: Remove excluded students from assignableStudents
        // ES: Quitar alumnos excluidos de assignableStudents
        .map((c) => ({
          ...c,
          assignableStudents: c.assignableStudents.filter((s) => !data.excluded?.includes(s)),
        }))
        .filter((c) => c.assignableStudents.length);

      const assignees = selectedClasses.flatMap((g) => {
        if (g.type === 'group') {
          return g.classes.map((c) => ({
            group: c.class.id,
            students: c.assignableStudents,
          }));
        }

        return {
          group: g.id,
          students: g.assignableStudents,
        };
      });

      if (assignees.length) {
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
      <Controller
        name="excluded"
        control={control}
        render={({ field: { value: show } }) => (
          <ConditionalInput
            label={labels?.excludeStudents}
            value={!!show?.length}
            showOnTrue
            render={() => (
              <Controller
                name="excluded"
                control={control}
                shouldUnregister
                render={({ field }) => (
                  <SelectUserAgent
                    {...field}
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
    </ContextContainer>
  );
}

SelectClass.propTypes = {
  labels: PropTypes.shape({
    excludeStudents: PropTypes.string,
    unableToAssignStudentsMessage: PropTypes.string,
    matchingStudents: PropTypes.string,
    noStudentsToAssign: PropTypes.string,
  }),
  profiles: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.arrayOf(PropTypes.string),
};
