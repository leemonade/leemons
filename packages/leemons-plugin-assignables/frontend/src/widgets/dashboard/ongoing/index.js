import React from 'react';
import AssignmentList from '../../../components/Ongoing/AssignmentList';
import prefixPN from '../../../helpers/prefixPN';

export default function Ongoing({ classe }) {
  return (
    <AssignmentList
      closed={false}
      defualtFilters={{ class: classe?.id }}
      filters={{ hideSubject: true }}
      title={null}
      subjectFullLength={false}
    />
  );
}
