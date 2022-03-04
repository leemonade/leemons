import React from 'react';
import { Link } from 'react-router-dom';
import {
  ContextContainer,
  Paragraph,
  ImageLoader,
  Button,
  Box,
  Stack,
  Anchor,
  Divider,
} from '@bubbles-ui/components';

export default function SummaryStep({ onNext }) {
  return (
    <ContextContainer direction="row" fullHeight fullWidth>
      <ContextContainer>
        <ImageLoader src="" withPlaceholder={true} placeholder="Image not found" />
        <Paragraph size="md">TAGLINE</Paragraph>
        <ContextContainer title="Summary">
          <Paragraph>SUMMARY</Paragraph>
        </ContextContainer>
        <ContextContainer subtitle="Content">
          <Paragraph>CONTENT</Paragraph>
        </ContextContainer>
        <ContextContainer subtitle="Objectives">
          <Paragraph>OBJECTIVES</Paragraph>
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
