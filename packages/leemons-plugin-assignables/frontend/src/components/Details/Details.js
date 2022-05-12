import React from 'react';
import { useParams } from 'react-router-dom';
// import useInstance from '../Student/TaskDetail/helpers/useInstance';
import { TaskOngoingList } from './components/TaskOngoingList';
import UsersList from './components/UsersList';

export default function Details() {
  const { id } = useParams();

  // const instance = useInstance(instanceId);

  console.log(id);

  return (
    <>
      <TaskOngoingList />
      <UsersList />
    </>
  );
}
