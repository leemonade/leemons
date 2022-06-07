import React from 'react';
import AssignmentList from '../../../components/Ongoing/AssignmentList';

export default function Ongoing({ classe }) {
  return (
    <AssignmentList
      closed={false}
      defaultFilters={{ class: classe?.id, closed: false }}
      filters={{ hideSubject: true }}
      title={null}
      subjectFullLength={false}
    />
  );
}
