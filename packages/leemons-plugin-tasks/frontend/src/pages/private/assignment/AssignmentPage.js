import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { ContextContainer, PageContainer, Paper } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { unflatten } from '@common';
import { useParams, useHistory } from 'react-router-dom';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { useLayout } from '@layout/context';
import Form from '@assignables/components/Assignment/Form';
import createInstanceRequest from '../../../request/instance/createInstance';
import getTaskRequest from '../../../request/task/getTask';
import { prefixPN } from '../../../helpers/prefixPN';

function parseDates(date) {
  if (date instanceof Date) {
    return date.toISOString();
  }

  return undefined;
}

export default function AssignmentPage() {
  const history = useHistory();
  const [, translations] = useTranslateLoader(prefixPN('assignment_page'));
  const [labels, setLabels] = useState({});
  const [task, setTask] = useState(null);

  const { setLoading } = useLayout();

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

  useEffect(() => {
    (async () => {
      setLoading(true);
      if (!id) {
        return;
      }
      const t = await getTaskRequest({ id });

      setLoading(false);
      setTask(t);
    })();
  }, [id]);

  const handleAssignment = async (values) => {
    const { assignees, teachers, dates, curriculum, alwaysAvailable, ...instanceData } = values;

    const students = _.uniq(assignees.flatMap((assignee) => assignee.students));
    const classes = assignees.flatMap((assignee) => assignee.group);

    _.forIn(dates, (value, key) => {
      dates[key] = parseDates(value);
    });

    try {
      const taskInstanceData = {
        ...instanceData,
        students,
        classes,
        curriculum: curriculum ? _.omit(curriculum, 'toogle') : {},
        alwaysAvailable: alwaysAvailable || false,
        dates: alwaysAvailable ? {} : dates,
        // TODO: let the user decide
      };

      if (assignees[0]?.type === 'custom') {
        _.set(taskInstanceData, 'metadata.groupName', assignees[0].name);
        _.set(taskInstanceData, 'metadata.showGroupNameToStudents', assignees[0].showToStudents);
      }

      await createInstanceRequest(id, taskInstanceData);

      addSuccessAlert('Assignment created successfully');
      history.push('/private/assignables/ongoing');
    } catch (e) {
      addErrorAlert(e.message);
    }
  };

  if (!task) {
    return null;
  }

  return (
    <ContextContainer fullHeight>
      <AdminPageHeader values={{ title: `${labels?.page_title}: ${task?.asset?.name}` }} />
      <Paper color="solid" shadow="none" padding={0}>
        <PageContainer>
          <ContextContainer padded="vertical">
            <Paper fullWidth padding={5}>
              <Form onSubmit={handleAssignment} assignable={task} />
            </Paper>
          </ContextContainer>
        </PageContainer>
      </Paper>
    </ContextContainer>
  );
}
