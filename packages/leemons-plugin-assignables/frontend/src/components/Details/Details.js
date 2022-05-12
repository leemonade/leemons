import React from 'react';
import { useParams } from 'react-router-dom';
import useAssignableInstance from '../../hooks/assignableInstance/useAssignableInstance';
import { TaskOngoingList } from './components/TaskOngoingList';
import UsersList from './components/UsersList';

export default function Details() {
  const { id } = useParams();

  const instance = useAssignableInstance(id);

  console.log('instance', instance);

  return (
    <>
      <TaskOngoingList />
      <UsersList instance={instance} />
    </>
  );
}
