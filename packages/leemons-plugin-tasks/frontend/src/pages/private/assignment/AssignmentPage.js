import React, { useState, useEffect } from 'react';
import { ContextContainer, PageContainer, Paper } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { unflatten } from '@common';
import { useParams } from 'react-router-dom';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import hooks from 'leemons-hooks';
import Form from '../../../components/Assignment/Form';
import createInstanceRequest from '../../../request/instance/createInstance';
import assignStudentRequest from '../../../request/instance/assignStudent';
import assignTeacherRequest from '../../../request/instance/assignTeacher';
import { enableMenuItemRequest } from '../../../request';
import { prefixPN } from '../../../helpers/prefixPN';

function parseDates(date) {
  if (date instanceof Date) {
    return date.toISOString();
  }

  return undefined;
}

export default function AssignmentPage() {
  const [, translations] = useTranslateLoader(prefixPN('assignment_page'));
  const [labels, setLabels] = useState({});

  useEffect(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      const data = res.plugins.tasks.assignment_page;

      setLabels(data);
      // EN: Save your translations keys to use them in your component
      // ES: Guarda tus traducciones para usarlas en tu componente
    }
  }, [translations]);

  const { id } = useParams();

  const handleAssignment = async (values) => {
    const { assignees, teachers, startDate, deadline, visualizationDate, ...instanceData } = values;

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

      // TODO: Add subject selector
      await assignStudentRequest(
        instance,
        students
          .map((s) => ({
            subject: 'SUBJECT TEST',
            students: [s],
          }))
          .concat(
            classes.map((c) => ({
              group: c,
            }))
          )
      );
      await assignTeacherRequest(instance, teachers);

      await enableMenuItemRequest('ongoing');
      await enableMenuItemRequest('history');

      await hooks.fireEvent('menu-builder:user:updateItem', 'ongoing');
      await hooks.fireEvent('menu-builder:user:updateItem', 'history');

      addSuccessAlert('Assignment created successfully');
    } catch (e) {
      addErrorAlert(e.message);
    }
  };

  return (
    <ContextContainer fullHeight>
      <AdminPageHeader values={{ title: labels?.page_title }} />
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
