import React from 'react';
import { useParams } from 'react-router-dom';
import TaskDetail from '../../../components/Student/TaskDetail/TaskDetail';

export default function Details() {
  const { id, user } = useParams();

  return <TaskDetail id={id} student={user} key={`instance.${id}.user.${user}`} />;
}
