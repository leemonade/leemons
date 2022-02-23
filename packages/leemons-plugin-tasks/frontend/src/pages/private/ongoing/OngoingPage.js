import React from 'react';
import { PageContainer, ContextContainer } from '@bubbles-ui/components';
import { AdminPageHeader } from '@bubbles-ui/leemons';

import TeacherAssignedTasksLists from '../../../components/Ongoing/TeacherAssignedTasksLists';

export default function OngoingPage() {
  return (
    <ContextContainer fullHeight>
      <AdminPageHeader values={{ title: 'ONGOING' }} />
      <PageContainer>
        <TeacherAssignedTasksLists />
      </PageContainer>
    </ContextContainer>
  );
}
