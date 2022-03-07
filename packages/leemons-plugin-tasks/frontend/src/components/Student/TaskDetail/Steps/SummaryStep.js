import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useApi } from '@common';
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

export default function SummaryStep({ id, onNext }) {
  const options = useMemo(
    () => ({
      id,
      columns: JSON.stringify(['tagline', 'summary', 'objectives', 'cover']),
    }),
    [id]
  );

  const [task] = useApi(getTaskRequest, options);

  return (
    <ContextContainer direction="row" fullHeight fullWidth>
      <ContextContainer>
        <ImageLoader src={task?.cover || ''} withPlaceholder={true} placeholder="Image not found" />
        <Paragraph size="md">{task?.tagline}</Paragraph>
        <ContextContainer title="Summary">
          <Paragraph>{task?.summary}</Paragraph>
        </ContextContainer>
        <ContextContainer subtitle="Content">
          <Paragraph>{task?.content}</Paragraph>
        </ContextContainer>
        <ContextContainer subtitle="Objectives">
          <Box>
            {task?.objectives?.map(({ objective, position }) => (
              <HtmlText key={position}>{objective}</HtmlText>
            ))}
          </Box>
        </ContextContainer>
        <ContextContainer subtitle="Assesment Criteria">
          <Paragraph>ASSESMENT CRITERIA</Paragraph>
        </ContextContainer>
        <Stack fullWidth justifyContent="end">
          <Button onClick={onNext}>Next</Button>
        </Stack>
      </ContextContainer>
      <Divider skipFlex orientation="vertical" />
      <Stack skipFlex style={{ width: 300 }}>
        <ContextContainer noFlex>
          <ContextContainer title="Resources">
            <Anchor href="http://google.com" taget="_blank">
              Hola
            </Anchor>
          </ContextContainer>
          <ContextContainer title="Your team"></ContextContainer>
        </ContextContainer>
      </Stack>
    </ContextContainer>
  );
}

SummaryStep.propTypes = {
  id: PropTypes.string.isRequired,
  onNext: PropTypes.func.isRequired,
};
