import React, { useMemo } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import _ from 'lodash';
import { Box, Title, Text, Button } from '@bubbles-ui/components';
import useClassData from '@assignables/hooks/useClassData';
import useProgramEvaluationSystem from '@assignables/hooks/useProgramEvaluationSystem';
import { unflatten } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { CorrectionStyles } from './Correction.style';
import Submission from './components/Submission';
import { prefixPN } from '../../helpers';
import SubjectTabs from './components/SubjectTabs';
import Accordion from './components/Accordion';

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
  const defaultValues = useMemo(() => {
    const grades = assignation.grades || [];
    const mainGrades = grades.filter(({ type }) => type === 'main');
    const gradesObject = mainGrades.reduce((acc, { id, grade, feedback }) => {
      acc[id] = { score: grade, feedback };
      return acc;
    }, {});

    return gradesObject;
  }, []);
  const form = useForm({
    defaultValues,
  });
  const { handleSubmit } = form;

  const [, translations] = useTranslateLoader(prefixPN('task_correction'));
  const labels = useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      const data = _.get(res, prefixPN('task_correction'));

      // EN: Modify the data object here
      // ES: Modifica el objeto data aquí
      return data;
    }

    return {};
  }, [translations]);

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
    <FormProvider {...form}>
      <Box className={classes?.root}>
        <Box className={classes?.aside}>
          <Header assignation={assignation}></Header>
        </Box>
        <Box className={classes?.main}>
          <Box className={classes?.mainContent}>
            <Submission assignation={assignation} labels={labels.submission} />
            <SubjectTabs assignation={assignation}>
              <Accordion
                classes={classes}
                evaluationSystem={evaluationSystem}
                labels={labels}
                scoreInputProps={scoreInputProps}
              />
            </SubjectTabs>
          </Box>
          <Box className={classes?.mainButtons}>
            <Button variant="outline" onClick={handleSubmit((e) => console.log('values', e))}>
              Save changes
            </Button>
            <Button onClick={handleSubmit((e) => console.log('values', e))}>Send evaluation</Button>
          </Box>
        </Box>
      </Box>
    </FormProvider>
  );
}
