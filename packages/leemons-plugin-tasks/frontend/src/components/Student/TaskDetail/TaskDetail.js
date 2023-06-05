import React, { useMemo } from 'react';
import useClassData from '@assignables/hooks/useClassDataQuery';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@tasks/helpers';
import { unflatten, useLocale } from '@common';
import _, { map } from 'lodash';
import { getFileUrl } from '@leebrary/helpers/prepareAsset';
import { Loader } from '@bubbles-ui/components';
import { ActivityContainer } from '@bubbles-ui/leemons';
import useAssignations from '@assignables/requests/hooks/queries/useAssignations';
import useAssignables from '@assignables/requests/hooks/queries/useAssignables';
import { useUserAgents } from '@assignables/components/Assignment/AssignStudents/hooks';
import { useSubjectDetails } from '@academic-portfolio/hooks';
import { getClassIcon } from '@academic-portfolio/helpers/getClassIcon';
import { getMultiClassData } from '@assignables/helpers/getClassData';
import Steps from './components/Steps';

function useTaskDetailLocalizations() {
  const [, translations] = useTranslateLoader([
    prefixPN('task_realization'),
    'plugins.assignables.multiSubject',
  ]);

  return React.useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      const data = _.get(res, prefixPN('task_realization'));
      data.multiSubject = _.get(res, 'plugins.assignables.multiSubject');

      return data;
    }

    return {};
  }, [translations]);
}

function useTaskData({ id, user, localizations }) {
  const { data: assignation, isLoading: assignationIsLoading } = useAssignations({
    query: {
      instance: id,
      user,
    },
    fetchInstance: true,
    details: true,
  });
  const instance = assignation?.instance;
  const assignable = instance?.assignable;
  const asset = assignable?.asset;

  const { data: classData, isLoading: classDataIsLoading } = useClassData(instance, localizations);
  const coverUrl = React.useMemo(() => getFileUrl(asset?.cover), [asset?.cover]);

  return {
    assignation,
    instance,
    assignable,
    asset,
    coverUrl,
    classData,
    isLoading: assignationIsLoading || classDataIsLoading,
  };
}

function useSubjectsData(task) {
  const subjects = map(task?.subjects, 'subject') ?? [];
  const { data: subjectsDetails } = useSubjectDetails(subjects);

  return subjectsDetails?.map((subject) => ({
    id: subject.id,
    name: subject.name,
    subjectName: subject.name,
    icon: getClassIcon({ subject }),
    color: subject.color,
  }));
}

function useTaskPreviewData({ id, localizations }) {
  const { data: task, isLoading: taskIsLoading } = useAssignables({
    id,
    enabled: !!id,
  });

  const [user] = useUserAgents();

  const instance = useMemo(
    () => ({
      assignable: task,
      curriculum: {},
      dates: {},
      alwaysAvailable: 1,
      duration: '0 minutes',
    }),
    [task]
  );

  const assignation = useMemo(
    () => ({
      instance,
      timestamps: {},
      user,
      finished: false,
      started: true,
    }),
    [instance, user]
  );

  const subjectsData = useSubjectsData(instance);
  const multiClassData = getMultiClassData(localizations);

  const classData = subjectsData?.length > 1 ? multiClassData : subjectsData?.[0];

  return {
    assignable: task,
    asset: task?.asset,
    instance,
    assignation,
    isLoading: taskIsLoading,
    classData,
  };
}

export default function TaskDetail({ id, student, preview }) {
  const localizations = useTaskDetailLocalizations();
  const locale = useLocale();

  const [isFirstStep, setIsFirstStep] = React.useState(true);

  const useData = useMemo(() => (preview ? useTaskPreviewData : useTaskData), [preview]);

  const { assignation, instance, classData, asset, coverUrl, isLoading } = useData({
    id,
    user: student,
    localizations,
  });

  if (isLoading) {
    return <Loader />;
  }

  return (
    <ActivityContainer
      header={{
        title: asset?.name,
        subtitle: classData?.name,
        icon: classData?.icon,
        color: classData?.color,
        image: coverUrl,
      }}
      deadline={
        instance?.dates?.deadline && {
          label: localizations?.activityContainer?.deadline?.label,
          deadline:
            instance?.dates?.deadline instanceof Date
              ? instance?.dates?.deadline
              : new Date(instance?.dates?.deadline),
          locale,
        }
      }
      collapsed={!isFirstStep}
    >
      <Steps
        preview={preview}
        assignation={assignation}
        localizations={localizations}
        setIsFirstStep={setIsFirstStep}
      />
    </ActivityContainer>
  );
}
