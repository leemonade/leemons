import React from 'react';
import { TaskOngoingDetail } from './TaskOngoingDetail';
import { TaskOngoingList } from './TaskOngoingList/TaskOngoingList';

export default function Details() {
  return (
    <>
      <TaskOngoingDetail />
      <TaskOngoingList />
    </>
  );
}
