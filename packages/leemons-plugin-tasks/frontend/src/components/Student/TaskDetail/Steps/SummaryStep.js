import React, { useEffect, useState, useMemo } from 'react';
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
import useInstance from '../helpers/useInstance';
import useTask from '../helpers/useTask';

function useTaskInfo(instanceId, id) {
  const instance = useInstance(instanceId, ['showCurriculum']);

  const columns = useMemo(() => {
    const cols = ['tagline', 'summary', 'cover', 'attachments', 'subjects'];
    const instance = {
      showCurriculum: {
        content: true,
        objectives: true,
        assessmentCriteria: true,
      },
    };

    // TODO: To get the curriculum, backend must be changed to return it
    if (instance?.showCurriculum?.content) {
      cols.push('content');
    }

    if (instance?.showCurriculum?.objectives) {
      cols.push('objectives');
    }

    if (instance?.showCurriculum?.assessmentCriteria) {
      cols.push('assessmentCriteria');
    }
    return cols;
  }, [instance]);

  const task = useTask(id || instance?.task?.id, columns);

  return task;
}

export default function SummaryStep({ id, instance, onNext }) {
  const task = useTaskInfo(instance, id);

  return (
    <ContextContainer direction="row" fullHeight fullWidth>
      <ContextContainer>
        <ImageLoader
          src={
            // TODO: Remove image fake
            task?.cover ||
            'https://images.unsplash.com/photo-1596603324167-4cbb7a0de677?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2662&q=80'
          }
          height="300px"
          withPlaceholder={true}
          placeholder="Image not found"
        />
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
