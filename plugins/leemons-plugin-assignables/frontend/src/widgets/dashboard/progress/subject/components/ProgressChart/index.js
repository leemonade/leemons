import React from 'react';
import PropTypes from 'prop-types';
import { LoadingOverlay } from '@bubbles-ui/components';
import { ProgressChart } from '@assignables/components/ProgressChart';
import { useIsStudent, useIsTeacher } from '@academic-portfolio/hooks';
import { DistributionChart } from '@assignables/components/DistributionChart';
import useAcademicCalendarPeriods from '@scores/components/__DEPRECATED__/ScoresPage/useAcademicCalendarPeriods';
import { useStudentCountPerScale } from '@client-manager/hooks/useStudentCountPerScale';
import useProgramEvaluationSystems from '@grades/hooks/queries/useProgramEvaluationSystem';
import { useAverageGradePerClass } from '@client-manager/hooks/useAverageGradePerClass';

export default function ProgressChartWidget({ classe, roundValues }) {
  const isStudent = useIsStudent();
  const isTeacher = useIsTeacher();

  const periods = useAcademicCalendarPeriods({ classes: [classe] });
  const period = React.useMemo(() => {
    const currentDate = new Date();
    const currentPeriod = periods.find((p) => {
      const periodStartDate = new Date(p.startDate);
      const periodEndDate = new Date(p.endDate);
      return periodStartDate <= currentDate && currentDate <= periodEndDate;
    });
    return currentPeriod?.periods?.[classe.program]?.[classe.courses.id];
  }, [periods, classe]);

  const { data: studentCountPerScale, isLoading: studentCountPerScaleLoading } =
    useStudentCountPerScale({
      classId: classe.id,
      period,
      enabled: isTeacher && !!periods,
    });

  const enabledStudentGrades = isStudent && !!periods;
  const { data: studentGrades, isLoading: studentGradesLoading } = useAverageGradePerClass({
    classIds: [classe.id],
    period,
    groupBy: 'assignation',
    enabled: enabledStudentGrades,
  });

  const { data: programEvaluationSystem } = useProgramEvaluationSystems({
    program: classe.program,
    options: { enabled: !!classe.program },
  });

  const teacherData = React.useMemo(
    () =>
      studentCountPerScale?.map((scale) => ({
        label: String(scale.scale),
        value: scale.count,
      })) ?? [],
    [studentCountPerScale]
  );

  const studentData = React.useMemo(
    () =>
      studentGrades
        ?.map((grade) => ({
          label: grade.assignationName,
          value: grade.grade,
        }))
        .filter((grade) => grade.value !== null) ?? [],
    [studentGrades]
  );

  return (
    <>
      {isStudent && studentGradesLoading && <LoadingOverlay visible />}
      {isStudent && !studentGradesLoading && (
        <ProgressChart
          data={studentData}
          maxValue={programEvaluationSystem?.maxScale?.number}
          passValue={programEvaluationSystem?.minScaleToPromote?.number}
          height={390}
          roundValues={roundValues}
        />
      )}
      {isTeacher && studentCountPerScaleLoading && <LoadingOverlay visible />}
      {isTeacher && !studentCountPerScaleLoading && (
        <DistributionChart
          data={teacherData}
          passValue={programEvaluationSystem?.minScaleToPromote?.number}
          minimumScale={programEvaluationSystem?.minScale?.number}
          height={390}
        />
      )}
    </>
  );
}

ProgressChartWidget.propTypes = {
  classe: PropTypes.object.isRequired,
  roundValues: PropTypes.bool,
};
