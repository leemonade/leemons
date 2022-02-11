import React, { useState, useEffect, useRef, useCallback, forwardRef } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Select, Button, ContextContainer } from '@bubbles-ui/components';
import { useForm, Controller } from 'react-hook-form';
import { useSession, getCentersWithToken } from '@users/session';
import SelectUserAgent from '@users/components/SelectUserAgent';
import { goLoginPage } from '@users/navigate';
import { listTeacherClassesRequest } from '@academic-portfolio/request';
import { useApi } from '@common';

export default function AssignUsers({ labels, modes, assignTo }) {
  const [data, setData] = useState([]);
  const [centers, centersLoading, centersError] = useApi(getCentersWithToken);
  const userAgents = useRef({ centers: [], agents: [] });

  const { handleSubmit, errors, control, watch, resetField } = useForm({
    defaultValues: {},
  });

  // EN: react-hook-form watcher for the assignTo field
  // ES: react-hook-form watcher para el campo assignTo
  const assignToValue = watch('assign');

  const AssigneeSelector = forwardRef((props, ref) => {
    if (assignToValue === 'class') {
      return <Select fullWidth {...props} ref={ref} data={data} disabled={!data.length} />;
    }
    if (assignToValue === 'student') {
      return <SelectUserAgent {...props} ref={ref} />;
    }
    return <></>;
  });

  AssigneeSelector.displayName = 'AssigneeSelector';

  useEffect(() => {
    if (assignToValue) {
      resetField('assignee');
    }
  }, [assignToValue]);

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

  const assigneeLabel =
    assignToValue === 'class' ? labels.classroomToAssign : labels.studentToAssign;

  return (
    <form>
      <ContextContainer alignItems="end" direction="row">
        <Controller
          control={control}
          name="assign"
          render={({ field }) => (
            <Select fullWidth label={labels?.assignTo} {...field} data={assignTo} />
          )}
        />
        {assignToValue && (
          <Controller
            control={control}
            name="assignee"
            render={({ field }) => <AssigneeSelector label={assigneeLabel} {...field} />}
          />
        )}
        <Button size="sm">Add</Button>
      </ContextContainer>
    </form>
  );
}

AssignUsers.propTypes = {
  labels: PropTypes.Object,
  modes: PropTypes.Array,
  assignTo: PropTypes.Array,
};
