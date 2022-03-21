import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  ContextContainer,
  Paragraph,
  ImageLoader,
  Button,
  Stack,
  Anchor,
  Divider,
  HtmlText,
  Box,
} from '@bubbles-ui/components';
import getTaskRequest from '../../../../request/task/getTask';
import getInstanceRequest from '../../../../request/instance/get';

function useTaskInfo(instance, id) {
  const [task, setTask] = useState(null);

  useEffect(async () => {
    const inst = await getInstanceRequest({
      id: instance,
      columns: JSON.stringify(['showCurriculum']),
    });
    if (!inst) {
      return;
    }

    const options = {
      id: inst?.task?.id,
      columns: ['tagline', 'summary', 'cover', 'attachments'],
    };

    if (inst?.showCurriculum?.content) {
      options.columns.push('content');
    }

    if (inst?.showCurriculum?.objectives) {
      options.columns.push('objectives');
    }

    if (inst?.showCurriculum?.assessmentCriteria) {
      options.columns.push('assessmentCriteria');
    }

    options.columns = JSON.stringify(options.columns);

    const t = await getTaskRequest(options);

    setTask(t);
  }, [id, instance]);

  return task;
}
export default function SummaryStep({ id, instance, onNext }) {
  const task = useTaskInfo(instance, id);

  return (
    <ContextContainer direction="row" fullHeight fullWidth>
      <ContextContainer>
        <ImageLoader src={task?.cover || ''} withPlaceholder={true} placeholder="Image not found" />
        <Paragraph size="md">{task?.tagline}</Paragraph>
        <ContextContainer title="Summary">
          <Paragraph>{task?.summary}</Paragraph>
        </ContextContainer>
        {task?.content && (
          <ContextContainer subtitle="Content">
            {task?.content?.map(({ content, position }) => (
              <HtmlText key={position}>{content}</HtmlText>
            ))}
          </ContextContainer>
        )}
        {task?.objectives && (
          <ContextContainer subtitle="Objectives">
            <Box>
              {task?.objectives?.map(({ objective, position }) => (
                <HtmlText key={position}>{objective}</HtmlText>
              ))}
            </Box>
          </ContextContainer>
        )}
        {task?.assessmentCriteria && (
          <ContextContainer subtitle="Assesment Criteria">
            {task?.assessmentCriteria?.map(({ assessmentCriteria, position }) => (
              <HtmlText key={position}>{assessmentCriteria}</HtmlText>
            ))}
          </ContextContainer>
        )}
        <Stack fullWidth justifyContent="end">
          <Button onClick={onNext}>Next</Button>
        </Stack>
      </ContextContainer>
      <Divider skipFlex orientation="vertical" />
      <Stack skipFlex style={{ width: 300 }}>
        <ContextContainer noFlex>
          <ContextContainer title="Resources">
            <Stack direction="column">
              {task?.attachments?.map((a, i) => (
                <Anchor href="https://leemons.io" taget="_blank" key={i}>
                  {a}
                </Anchor>
              ))}
            </Stack>
          </ContextContainer>
          {/* <ContextContainer title="Your team"></ContextContainer> */}
        </ContextContainer>
      </Stack>
    </ContextContainer>
  );
}

SummaryStep.propTypes = {
  id: PropTypes.string.isRequired,
  instance: PropTypes.string.isRequired,
  onNext: PropTypes.func.isRequired,
};
