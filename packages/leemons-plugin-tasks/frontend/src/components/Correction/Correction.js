import React, { useMemo } from 'react';
import _ from 'lodash';
import {
  Box,
  Title,
  Text,
  ActivityAccordion,
  ActivityAccordionPanel,
  Badge,
  ContextContainer,
  ImageLoader,
} from '@bubbles-ui/components';
import { TextEditorInput } from '@bubbles-ui/editors';
import useClassData from '@assignables/hooks/useClassData';
import { PluginComunicaIcon, RatingStarIcon } from '@bubbles-ui/icons/outline';
import useProgramEvaluationSystem from '@assignables/hooks/useProgramEvaluationSystem';
import { useSubjects } from '@academic-portfolio/hooks';
import prepareAsset from '@leebrary/helpers/prepareAsset';
import { CorrectionStyles } from './Correction.style';
import { SubjectSelector } from './components/SubjectSelector';

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

function SubmissionSwiper({ assignation }) {
  return <Box>Submission swiper</Box>;
}

export default function Correction({ assignation }) {
  const evaluationSystem = useProgramEvaluationSystem(assignation?.instance);

  const { classes } = CorrectionStyles();
  return (
    <Box className={classes?.root}>
      <Box className={classes?.aside}>
        <Header assignation={assignation}></Header>
      </Box>
      <ContextContainer spacing={2} className={classes?.main}>
        <SubmissionSwiper assignation={assignation} />
        <SubjectSelector assignation={assignation} />

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
          ></ActivityAccordionPanel>
        </ActivityAccordion>
      </ContextContainer>
    </Box>
  );
}
