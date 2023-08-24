import { Box, Loader } from '@bubbles-ui/components';
import React from 'react';

import { addErrorAlert, addSuccessAlert } from '@layout/alert';

import { useProgramDetail, useSubjectDetails } from '@academic-portfolio/hooks';
import { useScoresMutation } from '@scores/requests/hooks/mutations';
import { EmptyState } from './EmptyState';
import { Filters } from './Filters';
import { ScoresTable } from './ScoresTable';
import { useExcelDownloadHandler } from './useExcelDownloadHandler';
import { useTableData } from './useTableData';

function LoadingState() {
  return (
    <Box
      sx={(theme) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        width: '100%',
        backgroundColor: theme.white,
      })}
    >
      <Loader />
    </Box>
  );
}

function handleOpen({ rowId, columnId, activitiesData, labels }) {
  const activityObj = activitiesData?.activities?.find((a) => a.id === columnId);
  const activity = activityObj?.activity;

  if (!activityObj) {
    addErrorAlert(labels?.unableToOpen);

    return;
  }

  if (!activity) {
    addErrorAlert('Not implemented yet for evaluations');

    return;
  }

  const url = activity.assignable.roleDetails.evaluationDetailUrl;

  window.open(url.replace(':id', columnId).replace(':user', rowId), '_blank', 'noopener');
}

function renderView({ isLoading, activitiesData, grades, filters, labels }) {
  if (isLoading) {
    return <LoadingState />;
  }

  if (activitiesData?.activities?.length && grades?.length && activitiesData?.value?.length) {
    return (
      <ScoresTable
        activitiesData={activitiesData}
        grades={grades}
        filters={filters}
        onOpen={({ rowId, columnId }) => handleOpen({ rowId, columnId, activitiesData, labels })}
        labels={labels?.scoresTable}
      />
    );
  }

  return <EmptyState />;
}

function getStudentsScores({ activitiesData, grades, isLoading, period, class: klass, labels }) {
  if (!activitiesData || !grades || isLoading) {
    addErrorAlert(labels?.noData);
    throw new Error('noData');
  }

  if (!period?.period?.type === 'academic-calendar') {
    addErrorAlert(labels?.noPeriod);

    throw new Error('noPeriod');
  }

  const calificableActivities = activitiesData.activities.filter(
    (activity) => activity.type === 'calificable'
  );
  const calificableActivitiesCount = calificableActivities.length;

  const studentGrades = activitiesData.value.map((student) => {
    let totalGrade;

    if (student.customScore === null) {
      totalGrade = student.activities.reduce((grade, activity) => {
        if (!activity.grade) {
          return grade;
        }

        return grade + activity.grade.grade;
      }, 0);
    }

    return {
      studentName: `${student.name} ${student.surname}`,
      student: student.id,
      period: period.period.id,
      grade:
        student.customScore !== null
          ? student.customScore
          : totalGrade / calificableActivitiesCount,
    };
  });

  return studentGrades.map((student) => ({
    student: student.student,
    period: student.period,
    class: klass?.id ? klass?.id : undefined,
    published: true,
    grade: student.grade,
  }));
}

export default function ActivitiesTab({ filters, labels }) {
  const [localFilters, setLocalFilters] = React.useState({});
  const { activitiesData, grades, isLoading } = useTableData({ filters, localFilters });
  const { mutateAsync } = useScoresMutation();

  const { data: programData } = useProgramDetail(filters?.program, { enabled: !!filters?.program });
  const { data: subjectData } = useSubjectDetails(filters.subject, { enabled: !!filters.subject });

  useExcelDownloadHandler({ activitiesData, grades, filters, programData, subjectData });

  return (
    <Box style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Filters
        onChange={setLocalFilters}
        period={filters?.period}
        labels={labels?.filters}
        isPeriodSubmitted={activitiesData?.isPeriodSubmitted}
        onSubmitEvaluationReport={() => {
          try {
            const scores = getStudentsScores({
              activitiesData,
              grades,
              isLoading,
              period: filters?.period,
              class: filters?.class,
              labels: labels?.periodSubmission,
            });

            mutateAsync({ scores })
              .then(() =>
                addSuccessAlert(
                  labels?.periodSubmission?.success?.replace(
                    '{{period}}',
                    filters?.period?.period?.name
                  )
                )
              )
              .catch((e) =>
                addErrorAlert(
                  labels?.periodSubmission?.error
                    ?.replace('{{period}}', filters?.period?.period?.name)
                    ?.replace('{{error}}', e.message || e.error)
                )
              );
          } catch (e) {
            //
          }
        }}
      />
      {renderView({ isLoading, activitiesData, grades, filters, labels })}
    </Box>
  );
}
