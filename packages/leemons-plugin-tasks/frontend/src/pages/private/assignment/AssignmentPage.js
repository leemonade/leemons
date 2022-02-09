import React from 'react';
import { ContextContainer, PageContainer, Paper } from '@bubbles-ui/components';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import Form from '../../../components/Assignment/Form';

export default function AssignmentPage() {
  return (
    <ContextContainer fullHeight>
      <AdminPageHeader values={{ title: 'AssignmentPage' }} />
      <Paper color="solid" shadow="none" padding={0}>
        <PageContainer>
          <ContextContainer padded="vertical">
            <Paper fullWidth padding={5}>
              <Form />
            </Paper>
          </ContextContainer>
        </PageContainer>
      </Paper>
    </ContextContainer>
  );
}
