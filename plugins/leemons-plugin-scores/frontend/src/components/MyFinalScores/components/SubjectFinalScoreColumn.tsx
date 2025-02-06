import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { Box, Stack, LoadingOverlay } from '@bubbles-ui/components';
import { ExpandDiagonalIcon } from '@bubbles-ui/icons/outline';
import useProgramEvaluationSystems from '@grades/hooks/queries/useProgramEvaluationSystem';

import { useSubstages } from '../hooks/useSubstages';
import { Class } from '../types/class';

import { EvaluationScoreDisplay } from './EvaluationScoreDisplay';
import { FinalScoreTotal } from './FinalScoreTotal';

import useSubjectScoreColumnStyles from '@scores/components/MyScores/components/SubjectsScoreList/components/SubjectScoreColumn/SubjectsScoreColumn.styles';
import Header from '@scores/components/MyScores/components/SubjectsScoreList/components/SubjectScoreColumn/components/Header';
import useMyScoresStore from '@scores/stores/myScoresStore';

interface Props {
  classData: Class;
  filters: unknown;
}

export function SubjectFinalScoreColumn({ classData }: Props) {
  const addColumn = useMyScoresStore((store) => store.addColumn);
  const removeColumn = useMyScoresStore((store) => store.removeColumn);

  const substages = useSubstages(classData);

  useEffect(() => {
    if (substages.length) {
      addColumn(classData.id, substages);
    } else {
      removeColumn(classData.id);
    }
  }, [addColumn, removeColumn, classData.id, substages]);

  useEffect(() => () => removeColumn(classData.id), [removeColumn, classData.id]);

  const { data: evaluationSystem, isLoading: evaluationSystemLoading } =
    useProgramEvaluationSystems({ program: classData.program.id });

  const { classes } = useSubjectScoreColumnStyles({ color: classData.color });

  if (!substages.length || !evaluationSystem) {
    return null;
  }

  if (evaluationSystemLoading) {
    return <LoadingOverlay visible />;
  }

  return (
    <Stack className={classes.root} direction="column" spacing={4}>
      <Link className={classes.opener} to={`/private/dashboard/class/${classData.id}`}>
        <ExpandDiagonalIcon width={18} height={18} color="#2F463F" />
      </Link>
      <Box>
        <Header class={classData} />
      </Box>
      <Box>
        <Stack direction="column" fullWidth>
          <FinalScoreTotal
            classId={classData.id}
            evaluationSystem={
              evaluationSystem as {
                minScaleToPromote: {
                  number: number;
                };
              }
            }
          />
          {substages.map((substage) => (
            <EvaluationScoreDisplay
              substage={substage}
              key={substage.id}
              classId={classData.id}
              evaluationSystem={evaluationSystem}
            />
          ))}
        </Stack>
      </Box>
    </Stack>
  );
}
