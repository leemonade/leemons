import React, { useEffect } from 'react';
import useAssignation from '@assignables/hooks/assignations/useAssignation';
import { useParams, useHistory } from 'react-router-dom';
import { Loader, Text, createStyles, Box } from '@bubbles-ui/components';
import AssignableUserNavigator from '@assignables/components/AssignableUserNavigator';
import useAssignableInstance from '@assignables/hooks/assignableInstance/useAssignableInstance';
import Correction from '../../../components/Correction';

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
    width: '332px',
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
  const history = useHistory();
  const { instance: instanceId } = useParams();
  let { student } = useParams();
  const { classes } = styles();

  if (!student || student === 'null' || student === 'undefined') {
    student = null;
  }
  const instance = useAssignableInstance(instanceId, true);
  const [assignation, error, loading] = useAssignation(
    instanceId,
    student || instance?.students?.[0]?.user
  );

  const onStudentChange = (user) => {
    if (user) {
      history.push(`/private/tasks/correction/${instanceId}/${user}`);
    }
  };

  useEffect(() => {
    if (!student && assignation?.user) {
      onStudentChange(assignation.user);
    }
  }, [assignation?.user]);

  if ((loading && !assignation) || !student) {
    return <Loader />;
  }
  if (error) {
    return <Text>Error: {error.message}</Text>;
  }
  return (
    <Box className={classes.root}>
      <Box className={classes.aside}>
        <AssignableUserNavigator instance={instance} onChange={onStudentChange} value={student} />
      </Box>
      <Box className={classes.main}>
        <Correction assignation={assignation} />
      </Box>
    </Box>
  );
}
