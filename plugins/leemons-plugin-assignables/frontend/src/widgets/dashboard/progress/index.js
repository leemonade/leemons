import React from 'react';
import PropTypes from 'prop-types';
import { ContextContainer, LoadingOverlay, Box } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@assignables/helpers/prefixPN';
import useWelcome from '@dashboard/request/hooks/queries/useWelcome';
import { ProgressChart } from '@assignables/components/ProgressChart';
import { useIsStudent } from '@academic-portfolio/hooks';
import useProgramEvaluationSystems from '@grades/hooks/queries/useProgramEvaluationSystem';
import useProgramClasses from '@academic-portfolio/hooks/useProgramClasses';
import useAcademicCalendarPeriods from '@scores/components/__DEPRECATED__/ScoresPage/useAcademicCalendarPeriods';
import { useAverageGradePerClass } from '@client-manager/hooks/useAverageGradePerClass';

export default function Progress({ program }) {
  const { data: welcomeCompleted } = useWelcome();
  const isStudent = useIsStudent();
  const [t] = useTranslateLoader(prefixPN('progress'));

  const { data: programEvaluationSystem } = useProgramEvaluationSystems({
    program: program.id,
    options: { enabled: !!program },
  });

  const { data: classesData } = useProgramClasses(program.id, { enabled: !!program });

  const periods = useAcademicCalendarPeriods({ classes: [{ program: program.id }] });
  const period = React.useMemo(() => {
    const currentDate = new Date();
    const currentPeriod = periods.find((p) => {
      const periodStartDate = new Date(p.startDate);
      const periodEndDate = new Date(p.endDate);
      return periodStartDate <= currentDate && currentDate <= periodEndDate;
    });
    return currentPeriod?.periods?.[program.id]?.[classesData[0].courses.id];
  }, [periods, classesData, program]);

  const { data: averageGradePerClass, isLoading: averageGradePerClassLoading } =
    useAverageGradePerClass({
      classIds: classesData?.map((c) => c.id),
      period,
      enabled: classesData?.length > 0 && !!periods,
    });

  const progressData = React.useMemo(
    () =>
      averageGradePerClass?.map((grade) => {
        let { subjectName } = grade;

        if (grade.classroomId) {
          subjectName = `${subjectName} (${grade.classroomId})`;
        }

        return {
          label: subjectName,
          value: grade.grade,
        };
      }) ?? [],
    [averageGradePerClass]
  );

  if (!welcomeCompleted || progressData.length === 0) {
    return null;
  }

  const titleKey = `dashboardTitle.main.${isStudent ? 'student' : 'teacher'}`;

  if (!isStudent) {
    return null;
  }

  return (
    <ContextContainer title={t(titleKey)}>
      <Box pt={10}>
        {averageGradePerClassLoading ? (
          <Box sx={{ height: 390 }}>
            <LoadingOverlay visible />
          </Box>
        ) : (
          <ProgressChart
            data={progressData}
            maxValue={programEvaluationSystem?.maxScale?.number}
            passValue={programEvaluationSystem?.minScaleToPromote?.number}
            height={390}
          />
        )}
      </Box>
    </ContextContainer>
  );
}

Progress.propTypes = {
  program: PropTypes.string.isRequired,
};
