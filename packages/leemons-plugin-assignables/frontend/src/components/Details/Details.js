import React from 'react';
import { useParams } from 'react-router-dom';
import { LoadingOverlay, Text } from '@bubbles-ui/components';
import useAssignableInstances from '../../hooks/assignableInstance/useAssignableInstancesQuery';
import { TaskOngoingList } from './components/TaskOngoingList';
import UsersList from './components/UsersList';

export default function Details() {
  const { id } = useParams();

  const { data: instance, isLoading, isError } = useAssignableInstances({ id });

  if (instance) {
    return (
      <>
        <TaskOngoingList instance={instance} />
        <UsersList instance={instance} />
      </>
    );
  }

  if (isLoading) {
    return <LoadingOverlay visible />;
  }

  if (isError) {
    // TRANSLATE: Error message when an error occurs while fetching assignable instance
    return <Text>An error ocurred</Text>;
  }
}
