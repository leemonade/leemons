import React from 'react';
import { Text } from '@bubbles-ui/components';
import AssignmentList from '../../../components/Ongoing/AssignmentList';

export default function Ongoing({ classe }) {
  return (
    <AssignmentList
      archived={false}
      defaultFilters={{ class: classe?.id, closed: false }}
      filters={{ hideSubject: true }}
      fullWidth
      titleComponent={<Text size="lg" color="primary"></Text>}
      subjectFullLength={false}
    />
  );
}
