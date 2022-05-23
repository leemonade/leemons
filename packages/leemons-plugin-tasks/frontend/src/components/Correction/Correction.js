import React from 'react';
import {
  Box,
  Title,
  Text,
  ActivityAccordion,
  ActivityAccordionPanel,
  Badge,
  ContextContainer,
  Paragraph,
} from '@bubbles-ui/components';
import { TextEditorInput } from '@bubbles-ui/editors';
import useClassData from '@assignables/hooks/useClassData';
import { PluginComunicaIcon, RatingStarIcon } from '@bubbles-ui/icons/outline';
import useProgramEvaluationSystem from '@assignables/hooks/useProgramEvaluationSystem';
import { CorrectionStyles } from './Correction.style';

function Header({ assignation }) {
  const { instance } = assignation;
  const { assignable } = instance;
  const { asset } = assignable;

  const classData = useClassData(assignable.classes);

  return (
    <Box>
      <Title>{asset.name}</Title>
      <Text>{classData.name}</Text>
    </Box>
  );
}

export default function Correction({ assignation }) {
  const { classes } = CorrectionStyles();
  const evaluationSystem = useProgramEvaluationSystem(assignation?.instance);
  return (
    <Box className={classes?.root}>
      <Box className={classes?.aside}>
        <Header assignation={assignation}></Header>
      </Box>
      <Box className={classes?.main}>
        <Paragraph align="center">Submission card (What happens when multi-file?)</Paragraph>
        <Paragraph align="center">Subjects bar (swiper?) (Add separation)</Paragraph>

        <ActivityAccordion>
          <ActivityAccordionPanel
            label="Punctuation"
            icon={<RatingStarIcon />}
            rightSection={
              <Badge
                label={
                  <ContextContainer direction="row" spacing={1}>
                    <Text>Min. to pass</Text>
                    <Badge
                      label={evaluationSystem?.minScaleToPromote?.letter}
                      closable={false}
                      severity="warning"
                    />
                  </ContextContainer>
                }
                closable={false}
              />
            }
          ></ActivityAccordionPanel>
          <ActivityAccordionPanel
            label="Feedback for student"
            icon={<PluginComunicaIcon />}
            rightSection={<Badge label="Optional" closable={false} />}
          >
            <TextEditorInput />
          </ActivityAccordionPanel>
        </ActivityAccordion>
      </Box>
    </Box>
  );
}
