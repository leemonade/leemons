import React from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import TaskDetail from '../../../components/Student/TaskDetail/TaskDetail';

export default function Details({ preview }) {
  const { id, user } = useParams();

  if (preview) {
    return <TaskDetail id={id} key={`task.${id}`} preview />;
  }

  return <TaskDetail id={id} student={user} key={`instance.${id}.user.${user}`} />;
}

Details.propTypes = {
  preview: PropTypes.bool,
};
