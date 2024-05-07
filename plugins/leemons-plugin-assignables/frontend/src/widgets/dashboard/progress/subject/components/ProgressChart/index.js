import React from 'react';
import PropTypes from 'prop-types';
import { LoadingOverlay } from '@bubbles-ui/components';
import { ProgressChart } from '@assignables/components/ProgressChart';
import { useIsStudent, useIsTeacher } from '@academic-portfolio/hooks';
import { DistributionChart } from '@assignables/components/DistributionChart';
import useAcademicCalendarPeriods from '@scores/components/__DEPRECATED__/ScoresPage/useAcademicCalendarPeriods';
import { useStudentCountPerScale } from '@client-manager/hooks/useStudentCountPerScale';
import useProgramEvaluationSystems from '@grades/hooks/queries/useProgramEvaluationSystem';

const STUDENT_MOCK_DATA = [
  {
    label:
      'Bloque 1. Procesos, métodos y actitudes en matemáticas. Procesos, métodos y actitudes en matemáticas',
    value: 3,
  },
  {
    label: 'Bloque 2. Números y álgebra',
    value: 5,
  },
  {
    label: 'Bloque 3. Funciones y gráficos',
    value: 9,
  },
  {
    label: 'Bloque 4. Estadística y probabilidad',
    value: 8,
  },
];

export default function ProgressChartWidget({ classe }) {
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

  return (
    <>
      {isStudent && (
        <ProgressChart data={STUDENT_MOCK_DATA} maxValue={10} passValue={5} height={390} />
      )}
      {isTeacher && studentCountPerScaleLoading && <LoadingOverlay visible />}
      {isTeacher && !studentCountPerScaleLoading && (
        <DistributionChart
          data={teacherData}
          passValue={programEvaluationSystem?.minScaleToPromote?.number}
          height={390}
        />
      )}
    </>
  );
}

ProgressChartWidget.propTypes = {
  classe: PropTypes.object.isRequired,
};
