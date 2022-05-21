import React from 'react';
import { useParams } from 'react-router-dom';
import { LoadingOverlay } from '@bubbles-ui/components';
import useAssignableInstance from '../../hooks/assignableInstance/useAssignableInstance';
import { TaskOngoingList } from './components/TaskOngoingList';
import UsersList from './components/UsersList';

export default function Details() {
  const { id } = useParams();

  const instance = useAssignableInstance(id);

  if (instance) {
    return (
      <>
        <TaskOngoingList instance={instance} />
        <UsersList instance={instance} />
      </>
    );
  }

  return <LoadingOverlay visible />;
}
