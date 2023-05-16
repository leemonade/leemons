import React, { useEffect, useRef, useMemo } from 'react';
import useAssignation from '@assignables/hooks/assignations/useAssignations';
import { useParams, useHistory } from 'react-router-dom';
import { Loader, Text, createStyles, Box } from '@bubbles-ui/components';
import AssignableUserNavigator from '@assignables/components/AssignableUserNavigator';
import { useForm, FormProvider } from 'react-hook-form';
import { useIsTeacher } from '@academic-portfolio/hooks';
import useInstances from '@assignables/requests/hooks/queries/useInstances';
import Correction from '../../../components/Correction';
import StudentCorrection from '../../../components/StudentCorrection';

const styles = createStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: theme.colors.interactive03,
    minHeight: '100%',
  },
  aside: {
    marginTop: theme.spacing[10],
    background: theme.colors.uiBackground04,
    minWidth: '332px',
    maxWidth: '332px',
    height: 'fit-content',
  },
  main: {
    margin: theme.spacing[10],
    width: '100%',
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing[5],
    justifyContent: 'start',
  },
}));

export default function CorrectionPage() {
  const isTeacher = useIsTeacher();
  const isFirstUser = useRef(true);
  const history = useHistory();
  const { instance: instanceId } = useParams();
  let { student } = useParams();
  const { classes } = styles();
  const form = useForm();

  if (!student || student === 'null' || student === 'undefined') {
    student = null;
  }

  const { data: instance, error, isLoading: loading } = useInstances({ id: instanceId });

  const { data: assignation } = useAssignation(
    {
      instance: instanceId,
      user: student,
    },
    true,
    !student
  );

  const fullAssignation = useMemo(
    () => ({
      ...assignation,
      instance,
    }),
    [assignation, instance]
  );

  useEffect(() => {
    if (instance && isFirstUser.current && !student) {
      const studentToUse = instance?.students?.[0]?.user;
      if (studentToUse) {
        history.push(`/private/tasks/correction/${instanceId}/${studentToUse}`);
      }
    }
  }, [instance]);

  useEffect(() => {
    if (assignation && isFirstUser.current) {
      isFirstUser.current = false;
    }
  }, [assignation]);

  const onStudentChange = (user) => {
    history.push(`/private/tasks/correction/${instanceId}/${user}`);
  };

  useEffect(() => {
    if (!student && assignation?.user) {
      onStudentChange(assignation.user);
    }
  }, [assignation?.user]);

  if (isFirstUser.current && loading && !assignation) {
    return <Loader />;
  }
  if (error) {
    return <Text>Error: {error}</Text>;
  }

  if (isTeacher) {
    return (
      <FormProvider {...form}>
        <Box className={classes.root}>
          <Box className={classes.aside}>
            <AssignableUserNavigator
              instance={instance}
              onChange={onStudentChange}
              value={student}
            />
          </Box>
          <Box className={classes.main}>
            {!!assignation && (
              <Correction assignation={fullAssignation} instance={instance} loading={loading} />
            )}
          </Box>
        </Box>
      </FormProvider>
    );
  }
  return <StudentCorrection assignation={fullAssignation} />;
}
