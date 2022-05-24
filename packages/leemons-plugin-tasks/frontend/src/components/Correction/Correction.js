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
  ScoreInput,
} from '@bubbles-ui/components';
import { TextEditorInput } from '@bubbles-ui/editors';
import useClassData from '@assignables/hooks/useClassData';
import { PluginComunicaIcon, RatingStarIcon } from '@bubbles-ui/icons/outline';
import useProgramEvaluationSystem from '@assignables/hooks/useProgramEvaluationSystem';
import { useSubjects } from '@academic-portfolio/hooks';
import prepareAsset from '@leebrary/helpers/prepareAsset';
import { CorrectionStyles } from './Correction.style';
import { SubjectSelector } from './components/SubjectSelector';
import Submission from './components/Submission';

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
  const evaluationSystem = useProgramEvaluationSystem(assignation?.instance);

  const scoreInputProps = useMemo(() => {
    if (!evaluationSystem) {
      return null;
    }

    return {
      showLetters: evaluationSystem.type === 'letter',
      acceptCustom: evaluationSystem.type === 'letter' ? 'text' : 'number',
      grades: evaluationSystem.scales.map((scale) => ({
        score: scale.number,
        letter: scale.letter,
      })),
      tags: evaluationSystem.tags,
      evaluation: evaluationSystem.id,
    };
  }, [evaluationSystem]);

  const { classes } = CorrectionStyles();
  return (
    <Box className={classes?.root}>
      <Box className={classes?.aside}>
        <Header assignation={assignation}></Header>
      </Box>
      <ContextContainer spacing={2} className={classes?.main}>
        <Submission assignation={assignation} />
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
                      label={
                        evaluationSystem?.minScaleToPromote?.letter ||
                        evaluationSystem?.minScaleToPromote?.number
                      }
                      closable={false}
                      severity="warning"
                    />
                  </ContextContainer>
                }
                closable={false}
              />
            }
          >
            <Box className={classes.accordionPanel}>
              {evaluationSystem && scoreInputProps && (
                <ScoreInput {...scoreInputProps} value={{ score: 0 }} />
              )}
            </Box>
          </ActivityAccordionPanel>
          <ActivityAccordionPanel
            label="Feedback for student"
            icon={<PluginComunicaIcon />}
            rightSection={<Badge label="Optional" closable={false} />}
          >
            <Box className={classes.accordionPanel}>
              <TextEditorInput />
            </Box>
          </ActivityAccordionPanel>
        </ActivityAccordion>
      </ContextContainer>
    </Box>
  );
}
