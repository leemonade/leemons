import React from 'react';
import { ContextContainer, PageContainer, Paper } from '@bubbles-ui/components';
import { useParams } from 'react-router-dom';
import { getCentersWithToken } from '@users/session';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import Form from '../../../components/Assignment/Form';
import createInstanceRequest from '../../../request/instance/createInstance';
import assignStudentRequest from '../../../request/instance/assignStudent';
import assignTeacherRequest from '../../../request/instance/assignTeacher';

function parseDates(date) {
  if (date instanceof Date) {
    return date.toISOString();
  }

  return undefined;
}

export default function AssignmentPage() {
  const { id } = useParams();

  const handleAssignment = async (values) => {
    const { assignees, startDate, deadline, visualizationDate, ...instanceData } = values;

    const [students, classes] = assignees.reduce(
      ([s, c], { type, assignee }) => {
        if (type === 'student') {
          return [[...s, assignee], c];
        }

        return [s, [...c, assignee]];
      },
      [[], []]
    );

    try {
      const instance = await createInstanceRequest(id, {
        ...instanceData,
        startDate: parseDates(startDate),
        deadline: parseDates(deadline),
        visualizationDate: parseDates(visualizationDate),
      });

      await assignStudentRequest(instance, students);

      const userAgents = (await getCentersWithToken()).map((token) => token.userAgentId);

      // TODO: Get the desired userAgent, for now we just get the first one
      const userAgent = userAgents[0];

      await assignTeacherRequest(instance, userAgent);

      addSuccessAlert('Assignment created successfully');
    } catch (e) {
      addErrorAlert(e.message);
    }
  };

  return (
    <ContextContainer fullHeight>
      <AdminPageHeader values={{ title: 'AssignmentPage' }} />
      <Paper color="solid" shadow="none" padding={0}>
        <PageContainer>
          <ContextContainer padded="vertical">
            <Paper fullWidth padding={5}>
              <Form onSubmit={handleAssignment} />
            </Paper>
          </ContextContainer>
        </PageContainer>
      </Paper>
    </ContextContainer>
  );
}
